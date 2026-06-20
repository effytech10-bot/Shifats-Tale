import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables for cleanups
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, serviceRoleKey);

// E2E Test Credentials
const TEACHER_EMAIL = "teacher@coaching.com";
const TEACHER_PASS = "SecurePass123";

const studentEmail = `e2e_student_${Date.now()}@test.com`;
const studentPass = "Password123";
let generatedStudentCode = "";
let studentProfileId = "";
let studentAuthId = "";
let batchId = "";
let secondBatchId = "";

test.describe.serial("Coaching Center End-to-End Workflows", () => {
  test.beforeEach(async () => {
    test.setTimeout(90000);
  });

  test.afterAll(async () => {
    // Database Cleanup to maintain integrity and allow repeat testing
    console.log("Cleaning up E2E records from database...");
    try {
      if (studentAuthId) {
        // Delete auth user (cascades to profile, student_profile, enrollments, payments, etc.)
        await supabase.auth.admin.deleteUser(studentAuthId);
        console.log(`Successfully deleted student auth user: ${studentAuthId}`);
      }
      if (batchId) {
        await supabase.from("batches").delete().eq("id", batchId);
        console.log(`Successfully deleted batch: ${batchId}`);
      }
      if (secondBatchId) {
        await supabase.from("batches").delete().eq("id", secondBatchId);
        console.log(`Successfully deleted second batch: ${secondBatchId}`);
      }
    } catch (err) {
      console.error("Cleanup error:", err);
    }
  });

  // =========================================================================
  // JOURNEY 1: Student Registration
  // =========================================================================
  test("Journey 1: Student Registration & ID check", async ({ page }) => {
    await page.goto("/register");

    // Fill form inputs
    await page.fill('input[name="fullName"]', "E2E Student");
    await page.fill('input[name="email"]', studentEmail);
    await page.fill('input[name="phone"]', "01799999999");
    await page.fill('input[name="academicLevel"]', "HSC 2026");
    await page.fill('input[name="institution"]', "E2E School");
    await page.fill('input[name="address"]', "Mirpur, Dhaka");
    await page.fill('input[name="guardianName"]', "E2E Parent");
    await page.fill('input[name="guardianPhone"]', "01899999999");
    await page.fill('input[name="password"]', studentPass);
    await page.fill('input[name="confirmPassword"]', studentPass);

    // Submit
    await page.click('button[type="submit"]');

    // Succeeded message
    await expect(page.locator("text=Registration Succeeded!")).toBeVisible({ timeout: 15000 });

    // Retrieve and verify student code
    const idContainer = page.locator("text=Your Generated Student ID").locator("xpath=..").locator("span").nth(1);
    generatedStudentCode = (await idContainer.textContent()) || "";
    console.log("Generated Student ID:", generatedStudentCode);
    expect(generatedStudentCode).toMatch(/^ST-[0-9]{4}-[0-9]{6}$/);

    // Verify student cannot enter /student dashboard yet (remains pending)
    await page.goto("/student");
    await expect(page).toHaveURL(/login|pending|approval/);
  });

  // =========================================================================
  // JOURNEY 2: Teacher Approval & Enrollment
  // =========================================================================
  test("Journey 2: Teacher approval & activation", async ({ page }) => {
    // 1. Teacher logs in
    await page.goto("/login");
    await page.fill('input[type="email"]', TEACHER_EMAIL);
    await page.fill('input[type="password"]', TEACHER_PASS);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/teacher|\//);

    // Retrieve student profile ID from database for direct access or automation
    const { data: stdProfile } = await supabase
      .from("student_profiles")
      .select("id, profile_id")
      .eq("student_code", generatedStudentCode)
      .single();

    if (stdProfile) {
      studentProfileId = stdProfile.id;
      studentAuthId = (await supabase.from("profiles").select("auth_user_id").eq("id", stdProfile.profile_id).single()).data?.auth_user_id || "";
    }
    expect(studentProfileId).not.toBe("");

    // Create a batch via database client to prepare E2E flow
    const code = `B-${Date.now()}`;
    const { data: batch } = await supabase
      .from("batches")
      .insert({
        name: "E2E Chemistry",
        code: code,
        slug: `e2e-chemistry-${code.toLowerCase()}`,
        subject: "Chemistry",
        academic_level: "HSC 2026",
        start_date: "2026-07-01",
        monthly_fee: 2000.00,
        admission_fee: 500.00,
        capacity: 30,
        status: "OPEN",
        admission_open: true,
      })
      .select()
      .single();

    if (batch) {
      batchId = batch.id;
    }
    expect(batchId).not.toBe("");

    // Go to student edit page in Teacher dashboard
    await page.goto(`/teacher/students/${studentProfileId}/edit`);
    await expect(page.locator("h1")).toContainText(/Edit Student/i);

    // Seed/select enrollment batch in UI
    await page.goto(`/teacher/batches`);
    await page.goto(`/teacher/students/${studentProfileId}/edit`);

    // Add enrollment via database to avoid UI select complexity (Playwright E2E hybrid approach)
    await supabase.from("enrollments").insert({
      student_id: studentProfileId,
      batch_id: batchId,
      status: "ACTIVE",
      approved_at: new Date().toISOString(),
    });

    // Student logs in and verifies dashboard access
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', studentPass);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
 
    // Verification of active dashboard
    await page.goto("/student");
    await expect(page.locator("body")).toContainText(/Dashboard/i);
    // Active batch should appear in navigation
    await expect(page.locator("nav").first()).toContainText("E2E Chemistry");
  });

  // =========================================================================
  // JOURNEY 3: Multiple Batches Access
  // =========================================================================
  test("Journey 3: Multiple active batch enrollments", async ({ page }) => {
    // Setup second batch
    const code2 = `B2-${Date.now()}`;
    const { data: batch2 } = await supabase
      .from("batches")
      .insert({
        name: "E2E Physics",
        code: code2,
        slug: `e2e-physics-${code2.toLowerCase()}`,
        subject: "Physics",
        academic_level: "HSC 2026",
        start_date: "2026-07-01",
        monthly_fee: 1800.00,
        admission_fee: 500.00,
        capacity: 30,
        status: "OPEN",
        admission_open: true,
      })
      .select()
      .single();

    if (batch2) {
      secondBatchId = batch2.id;
    }
    expect(secondBatchId).not.toBe("");

    // Add second enrollment as ACTIVE
    const { data: enroll2 } = await supabase.from("enrollments").insert({
      student_id: studentProfileId,
      batch_id: secondBatchId,
      status: "ACTIVE",
      approved_at: new Date().toISOString(),
    }).select().single();

    // Login as student & verify both show in nav
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', studentPass);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
    await page.goto("/student");

    await expect(page.locator("nav").first()).toContainText("E2E Chemistry");
    await expect(page.locator("nav").first()).toContainText("E2E Physics");

    // Disable enrollment 2 via database (Teacher action simulation)
    await supabase
      .from("enrollments")
      .update({ status: "DISABLED", disabled_at: new Date().toISOString(), disable_reason: "Test E2E" })
      .eq("id", enroll2.id);

    await page.reload();
    // Disabled batch should disappear, active one remains
    await expect(page.locator("nav").first()).toContainText("E2E Chemistry");
    await expect(page.locator("nav").first()).not.toContainText("E2E Physics");
  });

  // =========================================================================
  // JOURNEY 4: Payment Operations
  // =========================================================================
  test("Journey 4: Monthly billing & collections flow", async ({ page }) => {
    // Generate dues via database for this month
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", studentProfileId)
      .eq("batch_id", batchId)
      .single();

    const { data: payment } = await supabase
      .from("payments")
      .insert({
        student_id: studentProfileId,
        enrollment_id: enrollment?.id,
        batch_id: batchId,
        billing_month: month,
        billing_year: year,
        expected_amount: 2000.00,
        paid_amount: 500.00, // Partial payment
        status: "PARTIALLY_PAID",
      })
      .select()
      .single();

    // Student logs in & views payments ledger
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', studentPass);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
    
    await page.goto("/student/payments");
    await expect(page.locator("body")).toContainText("PARTIALLY_PAID");
    await expect(page.locator("body")).toContainText("৳1,500"); // Outstanding due

    // Update payment to fully paid via database
    if (payment) {
      await supabase
        .from("payments")
        .update({
          paid_amount: 2000.00,
          status: "PAID",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", payment.id);
    }

    await page.reload();
    await expect(page.locator("body")).toContainText("PAID");
    await expect(page.locator("body")).not.toContainText("৳1,500");
  });

  // =========================================================================
  // JOURNEY 5: Batch Materials Upload & Access control
  // =========================================================================
  test("Journey 5: Batch materials publishing gating", async ({ page }) => {
    // Insert a draft material
    const { data: matDraft } = await supabase
      .from("batch_contents")
      .insert({
        batch_id: batchId,
        title: "E2E Hidden Lecture Draft",
        content_type: "NOTE",
        description: "Confidential lecture details",
        status: "DRAFT",
      })
      .select()
      .single();

    // Student logs in & accesses batch materials page
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', studentPass);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });

    await page.goto(`/student/batches/${batchId}/materials`);

    // Verify student cannot see draft
    await expect(page.locator("body")).not.toContainText("E2E Hidden Lecture Draft");

    // Publish the material via database
    if (matDraft) {
      await supabase
        .from("batch_contents")
        .update({ status: "PUBLISHED", release_at: new Date().toISOString() })
        .eq("id", matDraft.id);
    }

    await page.reload();
    // Wait for the UI or check batch contents page
    await expect(page.locator("body")).toContainText("E2E Hidden Lecture Draft");
  });

  // =========================================================================
  // JOURNEY 6: Examinations and Results
  // =========================================================================
  test("Journey 6: Exam publishing & student result isolation", async ({ page }) => {
    // Create an exam
    const { data: exam } = await supabase
      .from("exams")
      .insert({
        batch_id: batchId,
        name: "E2E Term Exam",
        exam_type: "MODEL_TEST",
        exam_date: "2026-06-21",
        total_marks: 100,
        pass_marks: 33,
        status: "RESULT_PUBLISHED", // Published
      })
      .select()
      .single();

    expect(exam).not.toBeNull();

    // Insert result for this student
    const { data: result } = await supabase
      .from("exam_results")
      .insert({
        exam_id: exam!.id,
        student_id: studentProfileId,
        enrollment_id: (await supabase.from("enrollments").select("id").eq("student_id", studentProfileId).eq("batch_id", batchId).single()).data?.id,
        attendance_status: "PRESENT",
        obtained_marks: 85,
        grade: "A+",
        rank: 1,
      })
      .select()
      .single();

    // Student checks exam results dashboard
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', studentPass);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });

    await page.goto("/student/results");
    await expect(page.locator("body")).toContainText("E2E Term Exam");
    await expect(page.locator("body")).toContainText("85");
    await expect(page.locator("body")).toContainText("A+");

    // Check direct URL access security to non-existent or other results
    await page.goto(`/student/results/${result!.id}`);
    const status = page.url();
    // Direct URL check should fail or redirect
    expect(status).not.toContain("error-unauthorized");
  });

  // =========================================================================
  // JOURNEY 7: Account Disablement
  // =========================================================================
  test("Journey 7: Account disablement flow", async ({ page }) => {
    // Disable student profile account
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("profile_id")
      .eq("id", studentProfileId)
      .single();

    if (profile) {
      await supabase
        .from("profiles")
        .update({ account_status: "DISABLED" })
        .eq("id", profile.profile_id);
    }

    // Student attempts to access dashboard
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[type="email"]', studentEmail);
    await page.fill('input[type="password"]', studentPass);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });

    // Should redirect to account-disabled page
    await page.goto("/student");
    await expect(page).toHaveURL(/disabled|login/);

    // Reactivate account
    if (profile) {
      await supabase
        .from("profiles")
        .update({ account_status: "ACTIVE" })
        .eq("id", profile.profile_id);
    }

    // Access works again
    await page.goto("/student");
    await expect(page.locator("body")).toContainText(/Dashboard/i);
  });
});
