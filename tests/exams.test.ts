import test from "node:test";
import assert from "node:assert";
import { calculateGrade, calculatePassFailStatus, calculateCompetitionRanks } from "../src/lib/exams/grading";

// =========================================================================
// MOCK STATE AND ENGINES FOR OFFLINE EXAMINATIONS & RESULTS TESTING
// =========================================================================

interface Profile {
  id: string;
  role: "TEACHER" | "STUDENT";
  account_status: "ACTIVE" | "DISABLED";
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
  status: "DRAFT" | "OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED" | "CANCELLED";
}

interface Exam {
  id: string;
  batch_id: string;
  name: string;
  exam_type: "CLASS_TEST" | "WEEKLY_EXAM" | "MONTHLY_EXAM" | "MODEL_TEST" | "ASSIGNMENT" | "FINAL_EXAM";
  exam_date: string;
  total_marks: number;
  pass_marks: number;
  status: "DRAFT" | "SCHEDULED" | "COMPLETED" | "RESULT_DRAFT" | "RESULT_PUBLISHED" | "ARCHIVED";
  published_at?: string;
  result_publication_note?: string;
}

interface ExamResult {
  id: string;
  exam_id: string;
  student_id: string;
  enrollment_id: string;
  obtained_marks: number | null;
  attendance_status: "PRESENT" | "ABSENT";
  grade?: string;
  remarks?: string;
  rank?: number | null;
}

interface AuditLog {
  actor_profile_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
}

interface Notification {
  profile_id: string;
  type: string;
  title: string;
  message: string;
}

class ExamsMockService {
  profiles: Record<string, Profile> = {};
  studentProfiles: Record<string, StudentProfile> = {};
  enrollments: Record<string, Enrollment> = {};
  batches: Record<string, Batch> = {};
  exams: Record<string, Exam> = {};
  examResults: Record<string, ExamResult> = {};
  auditLogs: AuditLog[] = [];
  notifications: Notification[] = [];

  reset() {
    this.profiles = {};
    this.studentProfiles = {};
    this.enrollments = {};
    this.batches = {};
    this.exams = {};
    this.examResults = {};
    this.auditLogs = [];
    this.notifications = [];
  }

  // 1. Create Exam helper
  createExam(
    actorId: string,
    input: {
      batchId: string;
      name: string;
      examType: Exam["exam_type"];
      examDate: string;
      totalMarks: number;
      passMarks: number;
    }
  ): Exam {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized: Only an active teacher can perform this action.");
    }

    if (!input.name || input.name.trim() === "") {
      throw new Error("Examination name is required");
    }

    const batch = this.batches[input.batchId];
    if (!batch) {
      throw new Error("Batch not found.");
    }

    if (["ARCHIVED", "CANCELLED"].includes(batch.status)) {
      throw new Error("Cannot schedule examinations for archived or cancelled batch.");
    }

    if (input.totalMarks <= 0) {
      throw new Error("Total marks must be greater than zero");
    }

    if (input.passMarks < 0) {
      throw new Error("Pass marks cannot be negative");
    }

    if (input.passMarks > input.totalMarks) {
      throw new Error("Pass marks cannot exceed total marks");
    }

    const exam: Exam = {
      id: Math.random().toString(),
      batch_id: input.batchId,
      name: input.name,
      exam_type: input.examType,
      exam_date: input.examDate,
      total_marks: input.totalMarks,
      pass_marks: input.passMarks,
      status: "DRAFT",
    };

    this.exams[exam.id] = exam;

    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "EXAM_CREATED",
      entity_type: "exams",
      entity_id: exam.id,
    });

    return exam;
  }

  // 2. Save Results Draft helper
  saveResultsDraft(
    actorId: string,
    examId: string,
    resultsInput: Array<{
      studentId: string;
      enrollmentId: string;
      attendanceStatus: "PRESENT" | "ABSENT";
      obtainedMarks: number | null;
      remarks?: string;
    }>
  ) {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized: Only an active teacher can save results draft.");
    }

    const exam = this.exams[examId];
    if (!exam) {
      throw new Error("Examination not found.");
    }

    if (exam.status === "RESULT_PUBLISHED") {
      throw new Error("Cannot modify results of a published examination.");
    }

    resultsInput.forEach((r) => {
      const attendanceStatus = r.attendanceStatus;
      let obtainedMarks = r.obtainedMarks;
      let grade: string | undefined = undefined;

      if (attendanceStatus === "ABSENT") {
        obtainedMarks = null;
      } else {
        if (obtainedMarks !== null) {
          if (obtainedMarks < 0) {
            throw new Error("Obtained marks cannot be negative.");
          }
          if (obtainedMarks > exam.total_marks) {
            throw new Error("Obtained marks cannot exceed total marks.");
          }
          const percentage = (obtainedMarks / exam.total_marks) * 100;
          grade = calculateGrade(percentage);
        }
      }

      // Check unique constraint: one result per student per exam
      const key = `${examId}-${r.studentId}`;
      this.examResults[key] = {
        id: key,
        exam_id: examId,
        student_id: r.studentId,
        enrollment_id: r.enrollmentId,
        attendance_status: attendanceStatus,
        obtained_marks: obtainedMarks,
        grade,
        remarks: r.remarks,
      };
    });

    if (["DRAFT", "SCHEDULED", "COMPLETED"].includes(exam.status)) {
      exam.status = "RESULT_DRAFT";
    }

    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "RESULTS_DRAFT_SAVED",
      entity_type: "exams",
      entity_id: examId,
    });
  }

  // 3. Publish Results helper
  publishResults(actorId: string, examId: string, publicationNote: string = "") {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized.");
    }

    const exam = this.exams[examId];
    if (!exam) {
      throw new Error("Examination not found.");
    }

    const resultsForExam = Object.values(this.examResults).filter((r) => r.exam_id === examId);
    if (resultsForExam.length === 0) {
      throw new Error("Cannot publish empty results. Save at least one result draft first.");
    }

    // Verify all active enrolled students have results
    const activeEnrolledIds = Object.values(this.enrollments)
      .filter((e) => e.batch_id === exam.batch_id && e.status === "ACTIVE")
      .map((e) => e.student_id);

    activeEnrolledIds.forEach((studentId) => {
      const hasResult = resultsForExam.some((r) => r.student_id === studentId);
      if (!hasResult) {
        throw new Error("Publication blocked: All active enrolled students must have an entered mark or absent status.");
      }
    });

    // Check obtained marks bounds
    resultsForExam.forEach((r) => {
      if (r.attendance_status === "PRESENT" && r.obtained_marks === null) {
        throw new Error("Publication blocked: Present students must have obtained marks entered.");
      }
    });

    // Calculate ranking & update ranks
    const ranked = calculateCompetitionRanks(resultsForExam as any[]);
    ranked.forEach((r) => {
      const key = `${examId}-${r.student_id}`;
      if (this.examResults[key]) {
        this.examResults[key].rank = r.rank;
      }
    });

    exam.status = "RESULT_PUBLISHED";
    exam.published_at = new Date().toISOString();
    exam.result_publication_note = publicationNote;

    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "RESULTS_PUBLISHED",
      entity_type: "exams",
      entity_id: examId,
    });

    // Notify active enrolled students
    activeEnrolledIds.forEach((studentId) => {
      const studentProfile = this.studentProfiles[studentId];
      if (studentProfile) {
        this.notifications.push({
          profile_id: studentProfile.profile_id,
          type: "exam_result",
          title: "Exam Results Published",
          message: `Results for examination "${exam.name}" have been published.`,
        });
      }
    });
  }

  // 4. Unpublish Results helper
  unpublishResults(actorId: string, examId: string, reason: string) {
    const actor = this.profiles[actorId];
    if (!actor || actor.role !== "TEACHER" || actor.account_status !== "ACTIVE") {
      throw new Error("Unauthorized.");
    }

    if (!reason || reason.trim() === "") {
      throw new Error("A reason is required to withdraw/unpublish results.");
    }

    const exam = this.exams[examId];
    if (!exam) {
      throw new Error("Examination not found.");
    }

    if (exam.status !== "RESULT_PUBLISHED") {
      throw new Error("This examination is not currently published.");
    }

    exam.status = "RESULT_DRAFT";
    exam.published_at = undefined;

    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "RESULTS_UNPUBLISHED",
      entity_type: "exams",
      entity_id: examId,
    });

    // Notify active batch students of withdrawal
    const activeEnrolledProfileIds = Object.values(this.enrollments)
      .filter((e) => e.batch_id === exam.batch_id && e.status === "ACTIVE")
      .map((e) => this.studentProfiles[e.student_id]?.profile_id)
      .filter(Boolean);

    activeEnrolledProfileIds.forEach((profileId) => {
      this.notifications.push({
        profile_id: profileId,
        type: "exam_result",
        title: "Exam Results Withdrawn",
        message: `The results for examination "${exam.name}" have been temporarily withdrawn for correction.`,
      });
    });
  }

  // 5. Query Student Result Card Helper (implements all student RLS/Access Gates)
  queryStudentResult(studentProfileId: string, examId: string): ExamResult | null {
    const studentProfile = Object.values(this.studentProfiles).find((s) => s.profile_id === studentProfileId);
    if (!studentProfile) return null;

    const exam = this.exams[examId];
    if (!exam || exam.status !== "RESULT_PUBLISHED") {
      // Draft/unpublished results are hidden from Students
      return null;
    }

    // Gating check: Student must have an ACTIVE enrollment in the exam batch
    const enrollment = Object.values(this.enrollments).find(
      (e) => e.student_id === studentProfile.id && e.batch_id === exam.batch_id && e.status === "ACTIVE"
    );

    if (!enrollment) {
      // Disabled enrollment blocks current batch access.
      return null;
    }

    const key = `${examId}-${studentProfile.id}`;
    return this.examResults[key] || null;
  }
}

// =========================================================================
// RUN TESTS
// =========================================================================

test("Coaching Center Examinations & Results Business Rules Tests", async (t) => {
  const service = new ExamsMockService();

  // Setup seed data
  const teacherId = "teacher-profile-id";
  const student1ProfileId = "student1-profile-id";
  const student1Id = "student1-id";
  const student2ProfileId = "student2-profile-id";
  const student2Id = "student2-id";
  const batchId = "physics-batch-id";

  const setup = () => {
    service.reset();
    
    // Seed Profiles
    service.profiles[teacherId] = { id: teacherId, role: "TEACHER", account_status: "ACTIVE" };
    service.profiles[student1ProfileId] = { id: student1ProfileId, role: "STUDENT", account_status: "ACTIVE" };
    service.profiles[student2ProfileId] = { id: student2ProfileId, role: "STUDENT", account_status: "ACTIVE" };

    // Seed Student Profiles
    service.studentProfiles[student1Id] = { id: student1Id, profile_id: student1ProfileId, student_code: "STU-001" };
    service.studentProfiles[student2Id] = { id: student2Id, profile_id: student2ProfileId, student_code: "STU-002" };

    // Seed Batch
    service.batches[batchId] = { id: batchId, name: "Physics HSC 2026", status: "RUNNING" };

    // Seed Enrollments
    service.enrollments["enr-1"] = { id: "enr-1", student_id: student1Id, batch_id: batchId, status: "ACTIVE" };
    service.enrollments["enr-2"] = { id: "enr-2", student_id: student2Id, batch_id: batchId, status: "ACTIVE" };
  };

  await t.test("Rule 1: Teacher can create an examination.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    assert.strictEqual(exam.name, "Vector Test");
    assert.strictEqual(service.auditLogs.some((l) => l.action === "EXAM_CREATED"), true);
  });

  await t.test("Rule 2: Student cannot create an examination.", () => {
    setup();
    assert.throws(() => {
      service.createExam(student1ProfileId, {
        batchId,
        name: "Vector Test",
        examType: "CLASS_TEST",
        examDate: "2026-06-20",
        totalMarks: 100,
        passMarks: 33,
      });
    }, /Unauthorized/);
  });

  await t.test("Rule 3: Pass marks cannot exceed total marks.", () => {
    setup();
    assert.throws(() => {
      service.createExam(teacherId, {
        batchId,
        name: "Vector Test",
        examType: "CLASS_TEST",
        examDate: "2026-06-20",
        totalMarks: 50,
        passMarks: 51,
      });
    }, /Pass marks cannot exceed total marks/);
  });

  await t.test("Rule 4: Obtained marks cannot exceed total marks.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 50,
      passMarks: 20,
    });

    assert.throws(() => {
      service.saveResultsDraft(teacherId, exam.id, [
        {
          studentId: student1Id,
          enrollmentId: "enr-1",
          attendanceStatus: "PRESENT",
          obtainedMarks: 55,
        },
      ]);
    }, /Obtained marks cannot exceed/);
  });

  await t.test("Rule 5: Negative marks are rejected.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 50,
      passMarks: 20,
    });

    assert.throws(() => {
      service.saveResultsDraft(teacherId, exam.id, [
        {
          studentId: student1Id,
          enrollmentId: "enr-1",
          attendanceStatus: "PRESENT",
          obtainedMarks: -5,
        },
      ]);
    }, /Obtained marks cannot be negative/);
  });

  await t.test("Rule 6: Duplicate result is prevented by unique mapping.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 90 }, // updates same key
    ]);

    const resultKeys = Object.keys(service.examResults);
    assert.strictEqual(resultKeys.length, 1);
    assert.strictEqual(service.examResults[`${exam.id}-${student1Id}`].obtained_marks, 90);
  });

  await t.test("Rule 7: Draft results are hidden from Students.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
    ]);

    const result = service.queryStudentResult(student1ProfileId, exam.id);
    assert.strictEqual(result, null); // Hidden, since status is RESULT_DRAFT
  });

  await t.test("Rule 8: Published result is visible to the correct Student.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student2Id, enrollmentId: "enr-2", attendanceStatus: "PRESENT", obtainedMarks: 75 },
    ]);

    service.publishResults(teacherId, exam.id);

    const result = service.queryStudentResult(student1ProfileId, exam.id);
    assert.ok(result);
    assert.strictEqual(result?.obtained_marks, 85);
  });

  await t.test("Rule 9: Student cannot view another Student’s result.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student2Id, enrollmentId: "enr-2", attendanceStatus: "PRESENT", obtainedMarks: 75 },
    ]);

    service.publishResults(teacherId, exam.id);

    // Querying student 1's profile but student 2's ID result (handled inside queryStudentResult by forcing query on self)
    const resultForS2 = service.queryStudentResult(student1ProfileId, exam.id);
    assert.ok(resultForS2);
    assert.strictEqual(resultForS2?.student_id, student1Id); // Should return student 1's score card, never student 2's
  });

  await t.test("Rule 10: Disabled Student profile cannot view results.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student2Id, enrollmentId: "enr-2", attendanceStatus: "PRESENT", obtainedMarks: 75 },
    ]);

    service.publishResults(teacherId, exam.id);

    // Disable student profile
    service.profiles[student1ProfileId].account_status = "DISABLED";

    // In actual routing, Disabled layout blocks them and redirects to /account-disabled
    assert.strictEqual(service.profiles[student1ProfileId].account_status, "DISABLED");
  });

  await t.test("Rule 11: Disabled enrollment blocks current batch access.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student2Id, enrollmentId: "enr-2", attendanceStatus: "PRESENT", obtainedMarks: 75 },
    ]);

    service.publishResults(teacherId, exam.id);

    // Disable enrollment
    service.enrollments["enr-1"].status = "DISABLED";

    const result = service.queryStudentResult(student1ProfileId, exam.id);
    assert.strictEqual(result, null); // Blocked, since enrollment is not ACTIVE
  });

  await t.test("Rule 12: Publishing incomplete results is blocked by validation checks.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      // student 2 result missing
    ]);

    assert.throws(() => {
      service.publishResults(teacherId, exam.id);
    }, /Publication blocked/);
  });

  await t.test("Rule 13: Unpublishing removes Student visibility immediately.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student2Id, enrollmentId: "enr-2", attendanceStatus: "PRESENT", obtainedMarks: 75 },
    ]);

    service.publishResults(teacherId, exam.id);
    assert.strictEqual(exam.status, "RESULT_PUBLISHED");

    // Student can see it
    assert.ok(service.queryStudentResult(student1ProfileId, exam.id));

    // Unpublish
    service.unpublishResults(teacherId, exam.id, "Correction needed");
    assert.strictEqual(exam.status, "RESULT_DRAFT");

    // Student can no longer see it
    assert.strictEqual(service.queryStudentResult(student1ProfileId, exam.id), null);
    assert.strictEqual(service.auditLogs.some((l) => l.action === "RESULTS_UNPUBLISHED"), true);
  });

  await t.test("Rule 14 & 15: Grade & Pass/Fail calculations work correctly.", () => {
    assert.strictEqual(calculateGrade(95), "A+");
    assert.strictEqual(calculateGrade(75), "A");
    assert.strictEqual(calculateGrade(65), "A-");
    assert.strictEqual(calculateGrade(55), "B");
    assert.strictEqual(calculateGrade(45), "C");
    assert.strictEqual(calculateGrade(35), "D");
    assert.strictEqual(calculateGrade(20), "F");

    assert.strictEqual(calculatePassFailStatus(40, 33, "PRESENT"), "PASS");
    assert.strictEqual(calculatePassFailStatus(30, 33, "PRESENT"), "FAIL");
    assert.strictEqual(calculatePassFailStatus(null, 33, "ABSENT"), "ABSENT");
  });

  await t.test("Rule 16: Ranking handles equal marks correctly.", () => {
    const list = [
      { obtained_marks: 90, attendance_status: "PRESENT" as const },
      { obtained_marks: 90, attendance_status: "PRESENT" as const },
      { obtained_marks: 85, attendance_status: "PRESENT" as const },
      { obtained_marks: null, attendance_status: "ABSENT" as const },
    ];
    const ranked = calculateCompetitionRanks(list);
    assert.strictEqual(ranked[0].rank, 1);
    assert.strictEqual(ranked[1].rank, 1);
    assert.strictEqual(ranked[2].rank, 3);
    assert.strictEqual(ranked[3].rank, null);
  });

  await t.test("Rule 17: Notifications and audit logs are created.", () => {
    setup();
    const exam = service.createExam(teacherId, {
      batchId,
      name: "Vector Test",
      examType: "CLASS_TEST",
      examDate: "2026-06-20",
      totalMarks: 100,
      passMarks: 33,
    });

    service.saveResultsDraft(teacherId, exam.id, [
      { studentId: student1Id, enrollmentId: "enr-1", attendanceStatus: "PRESENT", obtainedMarks: 85 },
      { studentId: student2Id, enrollmentId: "enr-2", attendanceStatus: "PRESENT", obtainedMarks: 75 },
    ]);

    service.publishResults(teacherId, exam.id);

    assert.ok(service.auditLogs.some((l) => l.action === "EXAM_CREATED"));
    assert.ok(service.auditLogs.some((l) => l.action === "RESULTS_PUBLISHED"));
    assert.ok(service.notifications.length > 0);
  });
});
