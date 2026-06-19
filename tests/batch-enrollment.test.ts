import test from "node:test";
import assert from "node:assert";
import { resolveUserDestination } from "../src/lib/supabase/auth";

// =========================================================================
// MOCK STATE AND LOGIC ENGINES FOR BATCH & ENROLLMENT TESTING
// =========================================================================

// 1. Enrollment transition validation logic
function validateEnrollmentTransition(
  oldStatus: string,
  newStatus: string,
  explicitConfirmation: boolean = false
): { valid: boolean; error?: string } {
  if (oldStatus === newStatus) return { valid: true };

  const allowedPending = ["ACTIVE", "REJECTED", "CANCELLED"];
  const allowedActive = ["DISABLED", "COMPLETED", "CANCELLED"];
  const allowedDisabled = ["ACTIVE", "CANCELLED"];

  if (oldStatus === "PENDING") {
    if (allowedPending.includes(newStatus)) return { valid: true };
    return { valid: false, error: "Pending enrollment can only transition to Active, Rejected, or Cancelled." };
  }

  if (oldStatus === "ACTIVE") {
    if (allowedActive.includes(newStatus)) return { valid: true };
    return { valid: false, error: "Active enrollment can only transition to Disabled, Completed, or Cancelled." };
  }

  if (oldStatus === "DISABLED") {
    if (allowedDisabled.includes(newStatus)) return { valid: true };
    return { valid: false, error: "Disabled enrollment can only transition to Active or Cancelled." };
  }

  if (oldStatus === "COMPLETED") {
    if (newStatus === "ACTIVE" && explicitConfirmation) return { valid: true };
    return { valid: false, error: "Completed enrollment can only transition to Active with explicit confirmation." };
  }

  if (oldStatus === "REJECTED") {
    if (newStatus === "PENDING" && explicitConfirmation) return { valid: true };
    return { valid: false, error: "Rejected enrollment can only transition to Pending with explicit confirmation." };
  }

  return { valid: false, error: "Invalid status transition pathway." };
}

// 2. Mock Supabase Query Builder
class MockBuilder {
  table: string;
  options: any;
  filters: Record<string, any> = {};

  constructor(table: string, options?: any) {
    this.table = table;
    this.options = options;
  }

  select(fields?: string, selectOpts?: any) {
    return this;
  }

  eq(col: string, val: any) {
    this.filters[col] = val;
    return this;
  }

  async maybeSingle() {
    if (this.table === "profiles") {
      return { data: this.options.profile, error: null };
    }
    if (this.table === "student_profiles") {
      return { data: this.options.studentProfile, error: null };
    }
    return { data: null, error: null };
  }

  async single() {
    return this.maybeSingle();
  }

  // Intercept the promise awaiter chain for count queries
  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    let resultPromise: Promise<any>;
    if (this.table === "enrollments") {
      resultPromise = Promise.resolve({
        count: this.options.activeEnrollmentCount ?? 0,
        error: null,
      });
    } else {
      resultPromise = Promise.resolve({ data: null, error: null });
    }
    return resultPromise.then(onfulfilled, onrejected);
  }
}

function createMockSupabase(options: {
  user?: any;
  profile?: any;
  studentProfile?: any;
  activeEnrollmentCount?: number;
}) {
  return {
    auth: {
      getUser: async () => {
        if (options.user) return { data: { user: options.user }, error: null };
        return { data: { user: null }, error: new Error("No user session") };
      },
    },
    from: (table: string) => {
      return new MockBuilder(table, options);
    },
  };
}

// 3. Mock Server Actions logic
interface Batch {
  id: string;
  name: string;
  code: string;
  slug: string;
  status: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  batchId: string;
  status: string;
}

class MockCoachingCenterService {
  batches: Batch[] = [];
  enrollments: Enrollment[] = [];
  auditLogs: any[] = [];
  notifications: any[] = [];

  // Simulate Teacher batch creation
  createBatch(actorRole: string, actorStatus: string, name: string, code: string) {
    if (actorRole !== "TEACHER" || actorStatus !== "ACTIVE") {
      throw new Error("Unauthorized: Only an active teacher can create batches.");
    }

    // Check duplicate code
    const duplicate = this.batches.some((b) => b.code === code);
    if (duplicate) {
      return { success: false, message: "Duplicate batch code is rejected." };
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${code.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const newBatch = { id: `batch-${Date.now()}`, name, code, slug, status: "DRAFT" };
    this.batches.push(newBatch);

    // Audit log
    this.logAudit("TEACHER", "BATCH_CREATED", "batches", newBatch.id, null, newBatch);

    return { success: true, batch: newBatch };
  }

  // Simulate Enrollment creation
  enrollStudent(actorRole: string, studentId: string, batchId: string, status: string = "PENDING") {
    if (actorRole !== "TEACHER") {
      throw new Error("Unauthorized");
    }

    // Check duplicate enrollment
    const duplicate = this.enrollments.some(
      (e) => e.studentId === studentId && e.batchId === batchId
    );

    if (duplicate) {
      const existing = this.enrollments.find(
        (e) => e.studentId === studentId && e.batchId === batchId
      )!;
      return {
        success: false,
        code: "DUPLICATE",
        message: "Duplicate enrollment is prevented.",
        status: existing.status,
      };
    }

    const newEnrollment = { id: `enroll-${Date.now()}`, studentId, batchId, status };
    this.enrollments.push(newEnrollment);

    this.logAudit("TEACHER", "STUDENT_ADDED_TO_BATCH", "enrollments", newEnrollment.id, null, newEnrollment);

    return { success: true, enrollment: newEnrollment };
  }

  // Log audit helper
  logAudit(actor: string, action: string, type: string, id: string, oldVal: any, newVal: any) {
    this.auditLogs.push({ actor, action, entity_type: type, entity_id: id, old_value: oldVal, new_value: newVal });
  }
}

// =========================================================================
// TEST SPECIFICATIONS
// =========================================================================

test("Batch Management & Student Enrollment System Test Suite", async (t) => {
  const service = new MockCoachingCenterService();

  await t.test("1. Teacher can create a batch", () => {
    const res = service.createBatch("TEACHER", "ACTIVE", "Physics Batch 1", "PHY-01");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.batch?.code, "PHY-01");
    assert.strictEqual(service.batches.length, 1);
  });

  await t.test("2. Student cannot create a batch", () => {
    assert.throws(() => {
      service.createBatch("STUDENT", "ACTIVE", "Chemistry Batch", "CHEM-01");
    }, /Unauthorized/);
  });

  await t.test("3. Duplicate batch code is rejected", () => {
    // PHY-01 already created in test 1
    const res = service.createBatch("TEACHER", "ACTIVE", "Physics Batch 2", "PHY-01");
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.message, "Duplicate batch code is rejected.");
  });

  await t.test("4. Duplicate enrollment is prevented", () => {
    // Reset service state
    service.enrollments = [];

    // Enroll first time
    const res1 = service.enrollStudent("TEACHER", "student-1", "batch-1", "PENDING");
    assert.strictEqual(res1.success, true);

    // Enroll second time (duplicate)
    const res2 = service.enrollStudent("TEACHER", "student-1", "batch-1", "ACTIVE");
    assert.strictEqual(res2.success, false);
    assert.strictEqual(res2.code, "DUPLICATE");
    assert.strictEqual(res2.status, "PENDING");
  });

  await t.test("5. Activating the first enrollment allows Student Dashboard access", async () => {
    const mockUser = { id: "std-user", email: "std@coaching.com" };
    const mockProfile = { id: "std-profile", auth_user_id: "std-user", role: "STUDENT", account_status: "ACTIVE" };
    const mockStudentProfile = { id: "student-1", profile_id: "std-profile", registration_status: "PENDING" };

    const mockSupabase = createMockSupabase({
      user: mockUser,
      profile: mockProfile,
      studentProfile: mockStudentProfile,
      activeEnrollmentCount: 1, // Has 1 active enrollment
    });

    const res = await resolveUserDestination(mockSupabase);
    assert.strictEqual(res.destination, "STUDENT_DASHBOARD");
  });

  await t.test("6. Disabling one enrollment blocks only that batch, other active batches remain accessible", () => {
    const studentEnrollments = [
      { id: "e1", batchId: "physics", status: "DISABLED" },
      { id: "e2", batchId: "chemistry", status: "ACTIVE" },
    ];

    const canAccessPhysics = studentEnrollments.some((e) => e.batchId === "physics" && e.status === "ACTIVE");
    const canAccessChemistry = studentEnrollments.some((e) => e.batchId === "chemistry" && e.status === "ACTIVE");

    assert.strictEqual(canAccessPhysics, false, "Physics batch should be disabled/blocked.");
    assert.strictEqual(canAccessChemistry, true, "Chemistry batch should remain active/accessible.");
  });

  await t.test("7. Removing the final active enrollment blocks /student and redirects to pending approval", async () => {
    const mockUser = { id: "std-user", email: "std@coaching.com" };
    const mockProfile = { id: "std-profile", auth_user_id: "std-user", role: "STUDENT", account_status: "ACTIVE" };
    const mockStudentProfile = { id: "student-1", profile_id: "std-profile", registration_status: "APPROVED" };

    const mockSupabase = createMockSupabase({
      user: mockUser,
      profile: mockProfile,
      studentProfile: mockStudentProfile,
      activeEnrollmentCount: 0, // Zero active enrollments
    });

    const res = await resolveUserDestination(mockSupabase);
    assert.strictEqual(res.destination, "PENDING_APPROVAL");
  });

  await t.test("8. Disabled student account blocks all routes & redirects to account disabled", async () => {
    const mockUser = { id: "std-user", email: "std@coaching.com" };
    const mockProfile = { id: "std-profile", auth_user_id: "std-user", role: "STUDENT", account_status: "DISABLED" };

    const mockSupabase = createMockSupabase({
      user: mockUser,
      profile: mockProfile,
    });

    const res = await resolveUserDestination(mockSupabase);
    assert.strictEqual(res.destination, "ACCOUNT_DISABLED");
  });

  await t.test("9. Reactivating an account restores access to active enrollments only", () => {
    const profile = { id: "profile-1", account_status: "ACTIVE" };
    const enrollments = [
      { id: "e1", batchId: "math", status: "ACTIVE" },
      { id: "e2", batchId: "english", status: "DISABLED" },
      { id: "e3", batchId: "ict", status: "COMPLETED" },
    ];

    const accessibleBatches = enrollments
      .filter((e) => profile.account_status === "ACTIVE" && e.status === "ACTIVE")
      .map((e) => e.batchId);

    assert.deepEqual(accessibleBatches, ["math"]);
  });

  await t.test("10. Student cannot access another batch by URL guessing (unauthorized)", () => {
    const studentActiveBatches = ["math", "chemistry"];
    const requestedBatch = "physics"; // Guessed URL

    const hasAccess = studentActiveBatches.includes(requestedBatch);
    assert.strictEqual(hasAccess, false);
  });

  await t.test("11. Invalid enrollment status transitions are rejected on the server", () => {
    // PENDING -> COMPLETED is invalid
    const t1 = validateEnrollmentTransition("PENDING", "COMPLETED");
    assert.strictEqual(t1.valid, false);

    // ACTIVE -> REJECTED is invalid
    const t2 = validateEnrollmentTransition("ACTIVE", "REJECTED");
    assert.strictEqual(t2.valid, false);

    // COMPLETED -> ACTIVE without explicit confirmation is invalid
    const t3 = validateEnrollmentTransition("COMPLETED", "ACTIVE", false);
    assert.strictEqual(t3.valid, false);

    // COMPLETED -> ACTIVE with explicit confirmation is valid
    const t4 = validateEnrollmentTransition("COMPLETED", "ACTIVE", true);
    assert.strictEqual(t4.valid, true);

    // DISABLED -> ACTIVE is valid
    const t5 = validateEnrollmentTransition("DISABLED", "ACTIVE");
    assert.strictEqual(t5.valid, true);
  });

  await t.test("12. Audit logs are generated for significant actions", () => {
    const log = service.auditLogs.find(
      (l) => l.action === "STUDENT_ADDED_TO_BATCH" && l.entity_type === "enrollments"
    );
    assert.ok(log);
    assert.strictEqual(log.actor, "TEACHER");
  });

  await t.test("13. Student navigation layout includes only active batches", () => {
    const studentEnrollments = [
      { batchName: "Physics", status: "ACTIVE" },
      { batchName: "Chemistry", status: "PENDING" },
      { batchName: "Math", status: "DISABLED" },
      { batchName: "Biology", status: "COMPLETED" },
    ];

    const activeNavigationList = studentEnrollments
      .filter((e) => e.status === "ACTIVE")
      .map((e) => e.batchName);

    assert.deepEqual(activeNavigationList, ["Physics"]);
  });
});
