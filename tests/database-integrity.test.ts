(process.env as any).NODE_ENV = "test";

import test from "node:test";
import assert from "node:assert";

// =========================================================================
// IN-MEMORY DATABASE SCHEMA SIMULATOR FOR CONSTRAINT AUDITING
// =========================================================================

interface Profile {
  id: string;
  role: "TEACHER" | "STUDENT";
  email: string;
  account_status: "ACTIVE" | "DISABLED";
}

interface StudentProfile {
  id: string;
  profile_id: string;
  student_code: string;
}

interface Batch {
  id: string;
  name: string;
  code: string;
  slug: string;
  monthly_fee: number;
  admission_fee: number;
  capacity: number;
}

interface Enrollment {
  id: string;
  student_id: string;
  batch_id: string;
  status: string;
}

interface Payment {
  id: string;
  student_id: string;
  enrollment_id: string;
  batch_id: string;
  billing_month: number;
  billing_year: number;
  expected_amount: number;
  paid_amount: number;
  status: string;
}

interface Exam {
  id: string;
  batch_id: string;
  name: string;
  total_marks: number;
  pass_marks: number;
}

interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  obtained_marks: number | null;
}

class DatabaseSimulator {
  profiles: Map<string, Profile> = new Map();
  studentProfiles: Map<string, StudentProfile> = new Map();
  batches: Map<string, Batch> = new Map();
  enrollments: Map<string, Enrollment> = new Map();
  payments: Map<string, Payment> = new Map();
  exams: Map<string, Exam> = new Map();
  examResults: Map<string, ExamResult> = new Map();

  reset() {
    this.profiles.clear();
    this.studentProfiles.clear();
    this.batches.clear();
    this.enrollments.clear();
    this.payments.clear();
    this.exams.clear();
    this.examResults.clear();
  }

  // Insert Profile
  insertProfile(p: Profile) {
    // Constraint: Max 1 active teacher
    if (p.role === "TEACHER") {
      const existingTeacher = Array.from(this.profiles.values()).find(
        (prof) => prof.role === "TEACHER"
      );
      if (existingTeacher) {
        throw new Error("23505: Unique constraint violation (unique_active_teacher)");
      }
    }
    this.profiles.set(p.id, p);
  }

  // Insert Student Profile
  insertStudentProfile(sp: StudentProfile) {
    // FK check
    if (!this.profiles.has(sp.profile_id)) {
      throw new Error("23503: Foreign key violation (profile_id)");
    }
    // Unique student code check
    const codeDup = Array.from(this.studentProfiles.values()).some(
      (s) => s.student_code === sp.student_code
    );
    if (codeDup) {
      throw new Error("23505: Unique violation (student_code)");
    }
    // Unique profile_id check
    const profileDup = Array.from(this.studentProfiles.values()).some(
      (s) => s.profile_id === sp.profile_id
    );
    if (profileDup) {
      throw new Error("23505: Unique violation (profile_id)");
    }

    this.studentProfiles.set(sp.id, sp);
  }

  // Insert Batch
  insertBatch(b: Batch) {
    // Unique code check
    const codeDup = Array.from(this.batches.values()).some((x) => x.code === b.code);
    if (codeDup) {
      throw new Error("23505: Unique violation (code)");
    }
    // Unique slug check
    const slugDup = Array.from(this.batches.values()).some((x) => x.slug === b.slug);
    if (slugDup) {
      throw new Error("23505: Unique violation (slug)");
    }
    // CHECK non-negative amounts
    if (b.monthly_fee < 0 || b.admission_fee < 0) {
      throw new Error("23514: Check constraint violation (non-negative fees)");
    }
    // CHECK capacity > 0
    if (b.capacity <= 0) {
      throw new Error("23514: Check constraint violation (capacity > 0)");
    }

    this.batches.set(b.id, b);
  }

  // Insert Enrollment
  insertEnrollment(e: Enrollment) {
    // FK checks
    if (!this.studentProfiles.has(e.student_id)) {
      throw new Error("23503: Foreign key violation (student_id)");
    }
    if (!this.batches.has(e.batch_id)) {
      throw new Error("23503: Foreign key violation (batch_id)");
    }
    // Unique student + batch constraint
    const dup = Array.from(this.enrollments.values()).some(
      (x) => x.student_id === e.student_id && x.batch_id === e.batch_id
    );
    if (dup) {
      throw new Error("23505: Unique violation (unique_student_batch)");
    }

    this.enrollments.set(e.id, e);
  }

  // Insert Payment
  insertPayment(p: Payment) {
    // FK checks
    if (!this.studentProfiles.has(p.student_id)) {
      throw new Error("23503: Foreign key violation (student_id)");
    }
    if (!this.enrollments.has(p.enrollment_id)) {
      throw new Error("23503: Foreign key violation (enrollment_id)");
    }
    if (!this.batches.has(p.batch_id)) {
      throw new Error("23503: Foreign key violation (batch_id)");
    }
    // Billing Month check (1-12)
    if (p.billing_month < 1 || p.billing_month > 12) {
      throw new Error("23514: Check constraint violation (billing_month range)");
    }
    // Billing Year check (>= 2020)
    if (p.billing_year < 2020) {
      throw new Error("23514: Check constraint violation (billing_year range)");
    }
    // Non-negative expected_amount and paid_amount
    if (p.expected_amount < 0 || p.paid_amount < 0) {
      throw new Error("23514: Check constraint violation (non-negative amounts)");
    }
    // Unique monthly payment per enrollment
    const dup = Array.from(this.payments.values()).some(
      (x) =>
        x.enrollment_id === p.enrollment_id &&
        x.billing_month === p.billing_month &&
        x.billing_year === p.billing_year
    );
    if (dup) {
      throw new Error("23505: Unique violation (unique_enrollment_month_year)");
    }

    this.payments.set(p.id, p);
  }

  // Insert Exam
  insertExam(ex: Exam) {
    if (ex.total_marks <= 0) {
      throw new Error("23514: Check constraint violation (total_marks > 0)");
    }
    if (ex.pass_marks < 0 || ex.pass_marks > ex.total_marks) {
      throw new Error("23514: Check constraint violation (pass_marks boundary)");
    }
    this.exams.set(ex.id, ex);
  }

  // Insert Exam Result
  insertExamResult(er: ExamResult) {
    const exam = this.exams.get(er.exam_id);
    if (!exam) {
      throw new Error("23503: Foreign key violation (exam_id)");
    }
    if (!this.studentProfiles.has(er.student_id)) {
      throw new Error("23503: Foreign key violation (student_id)");
    }
    // Trigger check: obtained_marks <= total_marks
    if (er.obtained_marks !== null) {
      if (er.obtained_marks < 0 || er.obtained_marks > exam.total_marks) {
        throw new Error("23514: Trigger constraint exception (obtained_marks boundary)");
      }
    }
    // Unique constraint: unique_exam_student
    const dup = Array.from(this.examResults.values()).some(
      (x) => x.exam_id === er.exam_id && x.student_id === er.student_id
    );
    if (dup) {
      throw new Error("23505: Unique violation (unique_exam_student)");
    }

    this.examResults.set(er.id, er);
  }
}

const db = new DatabaseSimulator();

test.beforeEach(() => {
  db.reset();
});

// =========================================================================
// TEST SPECIFICATIONS
// =========================================================================

test("Database Integrity Constraints Test Suite", async (t) => {

  await t.test("1. Unique Student ID constraint works", () => {
    // Seed profiles
    db.insertProfile({ id: "p1", role: "STUDENT", email: "s1@test.com", account_status: "ACTIVE" });
    db.insertProfile({ id: "p2", role: "STUDENT", email: "s2@test.com", account_status: "ACTIVE" });

    // Insert first student code
    db.insertStudentProfile({ id: "sp1", profile_id: "p1", student_code: "ST-2026-000001" });

    // Try insert duplicate student code
    assert.throws(() => {
      db.insertStudentProfile({ id: "sp2", profile_id: "p2", student_code: "ST-2026-000001" });
    }, /23505: Unique violation/);
  });

  await t.test("2. Unique batch code and slug constraints work", () => {
    db.insertBatch({
      id: "b1",
      name: "HSC Physics",
      code: "PHYS-01",
      slug: "hsc-physics-phys-01",
      monthly_fee: 1500,
      admission_fee: 500,
      capacity: 30,
    });

    // Duplicate code
    assert.throws(() => {
      db.insertBatch({
        id: "b2",
        name: "HSC Physics Copy",
        code: "PHYS-01",
        slug: "hsc-physics-copy-phys-01",
        monthly_fee: 1500,
        admission_fee: 500,
        capacity: 30,
      });
    }, /23505: Unique violation/);

    // Duplicate slug
    assert.throws(() => {
      db.insertBatch({
        id: "b3",
        name: "HSC Physics Two",
        code: "PHYS-02",
        slug: "hsc-physics-phys-01",
        monthly_fee: 1500,
        admission_fee: 500,
        capacity: 30,
      });
    }, /23505: Unique violation/);
  });

  await t.test("3. Unique enrollment constraint prevents multiple enrollments in same batch", () => {
    db.insertProfile({ id: "p1", role: "STUDENT", email: "s1@test.com", account_status: "ACTIVE" });
    db.insertStudentProfile({ id: "sp1", profile_id: "p1", student_code: "ST-2026-000001" });
    db.insertBatch({
      id: "b1",
      name: "HSC Physics",
      code: "PHYS-01",
      slug: "hsc-physics-phys-01",
      monthly_fee: 1500,
      admission_fee: 500,
      capacity: 30,
    });

    db.insertEnrollment({ id: "e1", student_id: "sp1", batch_id: "b1", status: "ACTIVE" });

    // Try same enrollment again
    assert.throws(() => {
      db.insertEnrollment({ id: "e2", student_id: "sp1", batch_id: "b1", status: "ACTIVE" });
    }, /23505: Unique violation/);
  });

  await t.test("4. Unique monthly payment constraint prevents duplicate billing records", () => {
    db.insertProfile({ id: "p1", role: "STUDENT", email: "s1@test.com", account_status: "ACTIVE" });
    db.insertStudentProfile({ id: "sp1", profile_id: "p1", student_code: "ST-2026-000001" });
    db.insertBatch({
      id: "b1",
      name: "HSC Physics",
      code: "PHYS-01",
      slug: "hsc-physics",
      monthly_fee: 1500,
      admission_fee: 500,
      capacity: 30,
    });
    db.insertEnrollment({ id: "e1", student_id: "sp1", batch_id: "b1", status: "ACTIVE" });

    db.insertPayment({
      id: "pay1",
      student_id: "sp1",
      enrollment_id: "e1",
      batch_id: "b1",
      billing_month: 6,
      billing_year: 2026,
      expected_amount: 1500,
      paid_amount: 1500,
      status: "PAID",
    });

    // Try duplicate payment billing record for month 6/2026
    assert.throws(() => {
      db.insertPayment({
        id: "pay2",
        student_id: "sp1",
        enrollment_id: "e1",
        batch_id: "b1",
        billing_month: 6,
        billing_year: 2026,
        expected_amount: 1500,
        paid_amount: 0,
        status: "UNPAID",
      });
    }, /23505: Unique violation/);
  });

  await t.test("5. CHECK constraints check billing month boundary and non-negativity", () => {
    db.insertProfile({ id: "p1", role: "STUDENT", email: "s1@test.com", account_status: "ACTIVE" });
    db.insertStudentProfile({ id: "sp1", profile_id: "p1", student_code: "ST-2026-000001" });
    db.insertBatch({
      id: "b1",
      name: "HSC Physics",
      code: "PHYS-01",
      slug: "hsc-physics",
      monthly_fee: 1500,
      admission_fee: 500,
      capacity: 30,
    });
    db.insertEnrollment({ id: "e1", student_id: "sp1", batch_id: "b1", status: "ACTIVE" });

    // Invalid Month 13
    assert.throws(() => {
      db.insertPayment({
        id: "pay-bad-month",
        student_id: "sp1",
        enrollment_id: "e1",
        batch_id: "b1",
        billing_month: 13,
        billing_year: 2026,
        expected_amount: 1500,
        paid_amount: 0,
        status: "UNPAID",
      });
    }, /billing_month range/);

    // Negative paid amount
    assert.throws(() => {
      db.insertPayment({
        id: "pay-neg",
        student_id: "sp1",
        enrollment_id: "e1",
        batch_id: "b1",
        billing_month: 6,
        billing_year: 2026,
        expected_amount: 1500,
        paid_amount: -50,
        status: "UNPAID",
      });
    }, /non-negative amounts/);
  });

  await t.test("6. Marks check boundaries and unique result per student", () => {
    db.insertProfile({ id: "p1", role: "STUDENT", email: "s1@test.com", account_status: "ACTIVE" });
    db.insertStudentProfile({ id: "sp1", profile_id: "p1", student_code: "ST-2026-000001" });
    db.insertBatch({
      id: "b1",
      name: "Physics",
      code: "PHYS",
      slug: "physics",
      monthly_fee: 1500,
      admission_fee: 500,
      capacity: 30,
    });
    db.insertExam({
      id: "ex1",
      batch_id: "b1",
      name: "Midterm",
      total_marks: 100,
      pass_marks: 33,
    });

    db.insertExamResult({
      id: "er1",
      exam_id: "ex1",
      student_id: "sp1",
      obtained_marks: 85,
    });

    // Obtained marks exceeding exam total (100)
    assert.throws(() => {
      db.insertExamResult({
        id: "er2",
        exam_id: "ex1",
        student_id: "sp1",
        obtained_marks: 105,
      });
    }, /obtained_marks boundary/);

    // Duplicate result record for same student
    assert.throws(() => {
      db.insertExamResult({
        id: "er-dup",
        exam_id: "ex1",
        student_id: "sp1",
        obtained_marks: 90,
      });
    }, /23505: Unique violation/);
  });

  await t.test("7. Foreign key reference integrity works", () => {
    // Try to register student for non-existent profile
    assert.throws(() => {
      db.insertStudentProfile({ id: "sp1", profile_id: "non-existent-uuid", student_code: "ST-2026-000001" });
    }, /23503: Foreign key violation/);
  });
});

test("Concurrency operations simulation", async (t) => {

  await t.test("1. Concurrent Student Registration checks prevent duplicate ID generation", async () => {
    const activeStudentCodes = new Set<string>();

    const generateAndRegisterStudent = async (desiredCode: string) => {
      // Simulate micro-delay of query-and-then-insert
      await new Promise(resolve => setTimeout(resolve, 5));
      if (activeStudentCodes.has(desiredCode)) {
        throw new Error("23505: Duplicate registration code detected.");
      }
      activeStudentCodes.add(desiredCode);
      return "SUCCESS";
    };

    // Parallel calls with the exact same student code
    const results = await Promise.allSettled([
      generateAndRegisterStudent("ST-2026-000001"),
      generateAndRegisterStudent("ST-2026-000001"),
    ]);

    const successes = results.filter(r => r.status === "fulfilled");
    const failures = results.filter(r => r.status === "rejected");

    assert.strictEqual(successes.length, 1);
    assert.strictEqual(failures.length, 1);
  });

  await t.test("2. Concurrent monthly dues generation skips already billed enrollments", async () => {
    const existingBills = new Set<string>(); // composite key: enrollment_id + billing_month + billing_year

    const generateMonthlyBill = async (enrollmentId: string, month: number, year: number) => {
      const key = `${enrollmentId}-${month}-${year}`;
      // Simulate check before insert
      await new Promise(resolve => setTimeout(resolve, 5));
      if (existingBills.has(key)) {
        return "SKIPPED";
      }
      existingBills.add(key);
      return "CREATED";
    };

    // Launch two parallel dues generations
    const results = await Promise.all([
      generateMonthlyBill("en1", 6, 2026),
      generateMonthlyBill("en1", 6, 2026),
    ]);

    // One should create the bill, the other must skip/de-duplicate cleanly
    assert.ok(results.includes("CREATED"));
    assert.ok(results.includes("SKIPPED"));
  });
});
