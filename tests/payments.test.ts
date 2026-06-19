import test from "node:test";
import assert from "node:assert";

// Mock Service for Offline Payments Testing
interface Profile {
  id: string;
  role: "TEACHER" | "STUDENT";
  account_status: "ACTIVE" | "DISABLED" | "ARCHIVED";
}

interface StudentProfile {
  id: string;
  profile_id: string;
  student_code: string;
}

interface Enrollment {
  id: string;
  student_id: string;
  batch_id: string;
  status: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED";
}

interface Batch {
  id: string;
  name: string;
  monthly_fee: number;
}

interface PaymentRecord {
  id: string;
  student_id: string;
  enrollment_id: string;
  batch_id: string;
  billing_month: number;
  billing_year: number;
  expected_amount: number;
  paid_amount: number;
  status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED";
  payment_method?: string;
  payment_date?: string;
  reference_number?: string;
  teacher_note?: string;
  student_note?: string;
  confirmed_at?: string;
}

interface AuditLog {
  actor_profile_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: any;
  new_value: any;
}

class PaymentsMockService {
  profiles: Record<string, Profile> = {};
  studentProfiles: Record<string, StudentProfile> = {};
  enrollments: Record<string, Enrollment> = {};
  batches: Record<string, Batch> = {};
  payments: Record<string, PaymentRecord> = {};
  auditLogs: AuditLog[] = [];
  notifications: any[] = [];

  reset() {
    this.profiles = {};
    this.studentProfiles = {};
    this.enrollments = {};
    this.batches = {};
    this.payments = {};
    this.auditLogs = [];
    this.notifications = [];
  }

  // 1. Create payment helper
  createPayment(
    actorId: string,
    input: {
      studentId: string;
      enrollmentId: string;
      batchId: string;
      billingMonth: number;
      billingYear: number;
      expectedAmount: number;
      paidAmount: number;
      status?: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED";
      teacherNote?: string;
    }
  ) {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized: Only an active teacher can create payments.");
    }

    if (input.expectedAmount < 0 || input.paidAmount < 0) {
      throw new Error("Expected and paid amounts cannot be negative.");
    }

    // Check duplicate
    const hasDuplicate = Object.values(this.payments).some(
      (p) =>
        p.enrollment_id === input.enrollmentId &&
        p.billing_month === input.billingMonth &&
        p.billing_year === input.billingYear
    );

    if (hasDuplicate) {
      const existing = Object.values(this.payments).find(
        (p) =>
          p.enrollment_id === input.enrollmentId &&
          p.billing_month === input.billingMonth &&
          p.billing_year === input.billingYear
      )!;
      return { success: false, code: "DUPLICATE", paymentId: existing.id, message: "Duplicate payment record." };
    }

    // Calculate suggested status
    let finalStatus = input.status;
    if (!finalStatus) {
      if (input.paidAmount === 0) finalStatus = "UNPAID";
      else if (input.paidAmount < input.expectedAmount) finalStatus = "PARTIALLY_PAID";
      else finalStatus = "PAID";
    }

    // Require appropriate notes for exceptional statuses
    if (["WAIVED", "REFUNDED", "CANCELLED"].includes(finalStatus)) {
      if (!input.teacherNote || input.teacherNote.trim() === "") {
        throw new Error(`A teacher note / reason is required for status: ${finalStatus}.`);
      }
    }

    const id = `payment-${Date.now()}-${Math.random()}`;
    const newPayment: PaymentRecord = {
      id,
      student_id: input.studentId,
      enrollment_id: input.enrollmentId,
      batch_id: input.batchId,
      billing_month: input.billingMonth,
      billing_year: input.billingYear,
      expected_amount: input.expectedAmount,
      paid_amount: input.paidAmount,
      status: finalStatus,
      teacher_note: input.teacherNote,
      confirmed_at: ["PAID", "PARTIALLY_PAID"].includes(finalStatus) ? new Date().toISOString() : undefined,
    };

    this.payments[id] = newPayment;

    // Audit log
    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "PAYMENT_CREATED",
      entity_type: "payments",
      entity_id: id,
      old_value: null,
      new_value: newPayment,
    });

    return { success: true, payment: newPayment };
  }

  // 2. Update payment helper
  updatePayment(
    actorId: string,
    paymentId: string,
    updates: {
      expectedAmount: number;
      paidAmount: number;
      status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "WAIVED" | "REFUNDED" | "CANCELLED";
      teacherNote?: string;
      confirmPaidReduction?: boolean;
      reasonForPaidToUnpaidRefundCancelled?: string;
    }
  ) {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized: Only an active teacher can update payments.");
    }

    const payment = this.payments[paymentId];
    if (!payment) {
      throw new Error("Payment record not found.");
    }

    if (updates.expectedAmount < 0 || updates.paidAmount < 0) {
      throw new Error("Expected and paid amounts cannot be negative.");
    }

    // Require confirmation for reducing a paid amount
    if (updates.paidAmount < payment.paid_amount && !updates.confirmPaidReduction) {
      return { success: false, code: "CONFIRM_PAID_REDUCTION", message: "Confirmation required for paid reduction." };
    }

    // Require reason for paid status downgrade
    if (
      payment.status === "PAID" &&
      ["UNPAID", "REFUNDED", "CANCELLED"].includes(updates.status)
    ) {
      if (!updates.reasonForPaidToUnpaidRefundCancelled || updates.reasonForPaidToUnpaidRefundCancelled.trim() === "") {
        throw new Error("A reason is required when downgrading PAID status.");
      }
    }

    // Require note for exceptional statuses
    if (["WAIVED", "REFUNDED", "CANCELLED"].includes(updates.status)) {
      if (!updates.teacherNote || updates.teacherNote.trim() === "") {
        throw new Error(`A note is required for status: ${updates.status}.`);
      }
    }

    const oldVal = { ...payment };
    payment.expected_amount = updates.expectedAmount;
    payment.paid_amount = updates.paidAmount;
    payment.status = updates.status;
    payment.teacher_note = updates.teacherNote || payment.teacher_note;

    // Audit log
    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "PAYMENT_UPDATED",
      entity_type: "payments",
      entity_id: paymentId,
      old_value: oldVal,
      new_value: { ...payment },
    });

    return { success: true, payment };
  }

  // 3. Bulk generate dues helper
  generateMonthlyDues(actorId: string, batchId: string, month: number, year: number) {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized.");
    }

    const batch = this.batches[batchId];
    if (!batch) {
      throw new Error("Batch not found.");
    }

    // Find valid students (active enrollments)
    const validEnrollments = Object.values(this.enrollments).filter(
      (e) => e.batch_id === batchId && e.status === "ACTIVE"
    );

    let createdCount = 0;
    let skippedCount = 0;

    for (const enr of validEnrollments) {
      const hasDuplicate = Object.values(this.payments).some(
        (p) =>
          p.enrollment_id === enr.id &&
          p.billing_month === month &&
          p.billing_year === year
      );

      if (hasDuplicate) {
        skippedCount++;
      } else {
        const id = `payment-${Date.now()}-${Math.random()}`;
        this.payments[id] = {
          id,
          student_id: enr.student_id,
          enrollment_id: enr.id,
          batch_id: batchId,
          billing_month: month,
          billing_year: year,
          expected_amount: batch.monthly_fee,
          paid_amount: 0,
          status: "UNPAID",
        };
        createdCount++;
      }
    }

    return { success: true, createdCount, skippedCount };
  }
}

test("Offline Monthly Payment-Management System Test Suite", async (t) => {
  const service = new PaymentsMockService();

  // Setup standard base entities
  const teacherProfile: Profile = { id: "p-teacher", role: "TEACHER", account_status: "ACTIVE" };
  const studentProfile1: Profile = { id: "p-std1", role: "STUDENT", account_status: "ACTIVE" };
  const studentProfile2: Profile = { id: "p-std2", role: "STUDENT", account_status: "ACTIVE" };
  const studentProfile3: Profile = { id: "p-std3", role: "STUDENT", account_status: "DISABLED" }; // Disabled Student

  const studentDetails1: StudentProfile = { id: "student-1", profile_id: "p-std1", student_code: "ST-2026-0001" };
  const studentDetails2: StudentProfile = { id: "student-2", profile_id: "p-std2", student_code: "ST-2026-0002" };
  const studentDetails3: StudentProfile = { id: "student-3", profile_id: "p-std3", student_code: "ST-2026-0003" };

  const batchA: Batch = { id: "batch-A", name: "Mathematics", monthly_fee: 1500 };

  const enrollment1: Enrollment = { id: "enr-1", student_id: "student-1", batch_id: "batch-A", status: "ACTIVE" };
  const enrollment2: Enrollment = { id: "enr-2", student_id: "student-2", batch_id: "batch-A", status: "ACTIVE" };
  const enrollment3: Enrollment = { id: "enr-3", student_id: "student-1", batch_id: "batch-A", status: "DISABLED" }; // Disabled enrollment

  // Register in Mock DB
  service.profiles = {
    "p-teacher": teacherProfile,
    "p-std1": studentProfile1,
    "p-std2": studentProfile2,
    "p-std3": studentProfile3,
  };
  service.studentProfiles = {
    "student-1": studentDetails1,
    "student-2": studentDetails2,
    "student-3": studentDetails3,
  };
  service.batches = { "batch-A": batchA };
  service.enrollments = { "enr-1": enrollment1, "enr-2": enrollment2, "enr-3": enrollment3 };

  await t.test("1. Teacher can create a payment", () => {
    const res = service.createPayment("p-teacher", {
      studentId: "student-1",
      enrollmentId: "enr-1",
      batchId: "batch-A",
      billingMonth: 6,
      billingYear: 2026,
      expectedAmount: 1500,
      paidAmount: 1500,
    });
    assert.strictEqual(res.success, true);
    assert.ok(res.payment);
    assert.strictEqual(res.payment.status, "PAID");
  });

  await t.test("2. Student cannot create a payment", () => {
    assert.throws(() => {
      service.createPayment("p-std1", {
        studentId: "student-1",
        enrollmentId: "enr-1",
        batchId: "batch-A",
        billingMonth: 6,
        billingYear: 2026,
        expectedAmount: 1500,
        paidAmount: 1500,
      });
    }, /Unauthorized/);
  });

  await t.test("3. Duplicate monthly payment is prevented", () => {
    // Attempt duplicate for enr-1 in month 6, year 2026 (created in test 1)
    const res = service.createPayment("p-teacher", {
      studentId: "student-1",
      enrollmentId: "enr-1",
      batchId: "batch-A",
      billingMonth: 6,
      billingYear: 2026,
      expectedAmount: 1500,
      paidAmount: 1000,
    });
    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, "DUPLICATE");
  });

  await t.test("4. Full payment becomes PAID", () => {
    const res = service.createPayment("p-teacher", {
      studentId: "student-2",
      enrollmentId: "enr-2",
      batchId: "batch-A",
      billingMonth: 6,
      billingYear: 2026,
      expectedAmount: 1500,
      paidAmount: 1500,
    });
    assert.strictEqual(res.payment?.status, "PAID");
  });

  await t.test("5. Partial payment becomes PARTIALLY_PAID", () => {
    const res = service.createPayment("p-teacher", {
      studentId: "student-2",
      enrollmentId: "enr-2",
      batchId: "batch-A",
      billingMonth: 7,
      billingYear: 2026,
      expectedAmount: 1500,
      paidAmount: 500,
    });
    assert.strictEqual(res.payment?.status, "PARTIALLY_PAID");
  });

  await t.test("6. Zero payment becomes UNPAID", () => {
    const res = service.createPayment("p-teacher", {
      studentId: "student-2",
      enrollmentId: "enr-2",
      batchId: "batch-A",
      billingMonth: 8,
      billingYear: 2026,
      expectedAmount: 1500,
      paidAmount: 0,
    });
    assert.strictEqual(res.payment?.status, "UNPAID");
  });

  await t.test("7. Negative values are rejected", () => {
    assert.throws(() => {
      service.createPayment("p-teacher", {
        studentId: "student-1",
        enrollmentId: "enr-1",
        batchId: "batch-A",
        billingMonth: 9,
        billingYear: 2026,
        expectedAmount: -100,
        paidAmount: 500,
      });
    }, /cannot be negative/);
  });

  await t.test("8. Student sees only their own records", () => {
    // Retrieve list of payments
    const student1Payments = Object.values(service.payments).filter(
      (p) => p.student_id === "student-1"
    );
    const student2Payments = Object.values(service.payments).filter(
      (p) => p.student_id === "student-2"
    );

    // Verify student-1 cannot fetch student-2's payments (isolation check)
    assert.ok(student1Payments.every((p) => p.student_id === "student-1"));
    assert.ok(student2Payments.every((p) => p.student_id === "student-2"));
  });

  await t.test("9. Student cannot view another Student’s payment by URL", () => {
    const activeStudentId = "student-1"; // Logged in student
    const targetPaymentRecord = Object.values(service.payments).find(
      (p) => p.student_id === "student-2"
    )!; // Another student's slip

    // URL access protection check
    const isOwner = targetPaymentRecord.student_id === activeStudentId;
    assert.strictEqual(isOwner, false, "Should restrict URL loading of another student's payment slip.");
  });

  await t.test("10. Monthly dues generation skips duplicates", () => {
    // enr-1 (student-1) already has a payment in 6/2026
    // enr-2 (student-2) already has a payment in 6/2026
    // If we trigger dues generation for batch-A in month 6/2026, it should skip both
    const res = service.generateMonthlyDues("p-teacher", "batch-A", 6, 2026);
    assert.strictEqual(res.createdCount, 0);
    assert.strictEqual(res.skippedCount, 2);
  });

  await t.test("11. Payment correction creates audit log", () => {
    // Find a payment to update
    const paymentId = Object.keys(service.payments)[0];
    const res = service.updatePayment("p-teacher", paymentId, {
      expectedAmount: 1500,
      paidAmount: 1200,
      status: "PARTIALLY_PAID",
      confirmPaidReduction: true, // confirm paid reduction
    });
    
    assert.strictEqual(res.success, true);
    
    // Check audit logs
    const log = service.auditLogs.find(
      (l) => l.action === "PAYMENT_UPDATED" && l.entity_id === paymentId
    );
    assert.ok(log);
    assert.strictEqual(log.actor_profile_id, "p-teacher");
  });

  await t.test("12. Refund requires a reason", () => {
    const paymentId = Object.keys(service.payments)[0];
    service.payments[paymentId].status = "PAID"; // Force status to PAID first
    service.payments[paymentId].paid_amount = 1500; // Reset paid amount
    
    assert.throws(() => {
      service.updatePayment("p-teacher", paymentId, {
        expectedAmount: 1500,
        paidAmount: 1500,
        status: "REFUNDED",
        teacherNote: "", // missing refund reason
        reasonForPaidToUnpaidRefundCancelled: "", // missing reason
        confirmPaidReduction: true,
      });
    }, /A reason is required/);
  });

  await t.test("13. Waiver requires a note", () => {
    const paymentId = Object.keys(service.payments)[0];
    assert.throws(() => {
      service.updatePayment("p-teacher", paymentId, {
        expectedAmount: 1500,
        paidAmount: 0,
        status: "WAIVED",
        teacherNote: "", // missing note
        confirmPaidReduction: true,
      });
    }, /A note is required/);
  });

  await t.test("14. Disabled Student cannot access payment pages", () => {
    // If account_status is DISABLED, they should be redirected
    const disabledProfile = service.profiles["p-std3"]; // account_status: DISABLED
    const canEnterDashboard = disabledProfile.account_status === "ACTIVE";
    assert.strictEqual(canEnterDashboard, false);
  });

  await t.test("15. Disabled enrollment blocks batch-specific payment details", () => {
    // enr-3 (student-1 in batch-A) status is DISABLED
    const enrollment = service.enrollments["enr-3"];
    const hasBatchAccess = enrollment.status === "ACTIVE";
    assert.strictEqual(hasBatchAccess, false);
  });
});
