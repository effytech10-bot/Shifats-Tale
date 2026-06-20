import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAuditLog } from "@/lib/audit";
import { requireTeacher } from "@/lib/auth-guards";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function escapeCSV(val: any): string {
  if (val === null || val === undefined) return "";
  let str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting by Client IP
    const ip = await getClientIp();
    try {
      await rateLimit(`csv-export-${ip}`, 5, 600); // 5 exports max per 10 mins
    } catch {
      return new NextResponse("Too many requests. Please try again later.", { status: 429 });
    }

    // 2. Authenticate and authorize Teacher
    let profile;
    try {
      const auth = await requireTeacher();
      profile = auth.profile;
    } catch {
      return new NextResponse("Forbidden: Teacher access required.", { status: 403 });
    }

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "enrollment";
    
    let csvContent = "\uFEFF"; // UTF-8 BOM
    let filename = `report-${tab}.csv`;
    const auditFilters: Record<string, any> = {};

    if (tab === "enrollment") {
      const batchId = searchParams.get("batchId") || "";
      const status = searchParams.get("status") || "";
      const accountStatus = searchParams.get("accountStatus") || "";
      const startDate = searchParams.get("startDate") || "";
      const endDate = searchParams.get("endDate") || "";

      auditFilters.batchId = batchId;
      auditFilters.status = status;
      auditFilters.accountStatus = accountStatus;
      auditFilters.startDate = startDate;
      auditFilters.endDate = endDate;

      let query = supabase
        .from("enrollments")
        .select(`
          status,
          approved_at,
          disabled_at,
          disable_reason,
          batch:batches (name, code),
          student:student_profiles (
            student_code,
            profile:profiles (full_name, account_status)
          )
        `);

      if (batchId) query = query.eq("batch_id", batchId);
      if (status) query = query.eq("status", status);
      if (accountStatus) query = query.eq("student.profile.account_status", accountStatus);
      if (startDate) query = query.gte("created_at", startDate);
      if (endDate) query = query.lte("created_at", endDate);

      const { data: enrollments, error } = await query;
      if (error) throw error;

      // Header row
      csvContent += "Student ID,Student Name,Batch,Enrollment Status,Account Status,Approval Date,Disabled Date,Disable Reason\n";

      enrollments?.forEach((e: any) => {
        const stud = e.student || {};
        const prof = stud.profile || {};
        const b = e.batch || {};

        csvContent += `${escapeCSV(stud.student_code)},`;
        csvContent += `${escapeCSV(prof.full_name)},`;
        csvContent += `${escapeCSV(`${b.name} (${b.code})`)},`;
        csvContent += `${escapeCSV(e.status)},`;
        csvContent += `${escapeCSV(prof.account_status)},`;
        csvContent += `${escapeCSV(e.approved_at ? new Date(e.approved_at).toLocaleDateString() : "")},`;
        csvContent += `${escapeCSV(e.disabled_at ? new Date(e.disabled_at).toLocaleDateString() : "")},`;
        csvContent += `${escapeCSV(e.disable_reason || "")}\n`;
      });

      filename = `batch-enrollments-${new Date().toISOString().split("T")[0]}.csv`;
    } 
    else if (tab === "payment") {
      const billingMonth = searchParams.get("month") || "";
      const billingYear = searchParams.get("year") || "";
      const batchId = searchParams.get("batchId") || "";
      const status = searchParams.get("status") || "";
      const paymentMethod = searchParams.get("paymentMethod") || "";

      auditFilters.billingMonth = billingMonth;
      auditFilters.billingYear = billingYear;
      auditFilters.batchId = batchId;
      auditFilters.status = status;
      auditFilters.paymentMethod = paymentMethod;

      let query = supabase
        .from("payments")
        .select(`
          billing_month,
          billing_year,
          expected_amount,
          paid_amount,
          status,
          payment_date,
          reference_number,
          payment_method,
          batch:batches (name, code),
          student:student_profiles (
            student_code,
            profile:profiles (full_name)
          )
        `);

      if (billingMonth) query = query.eq("billing_month", parseInt(billingMonth));
      if (billingYear) query = query.eq("billing_year", parseInt(billingYear));
      if (batchId) query = query.eq("batch_id", batchId);
      if (status) query = query.eq("status", status);
      if (paymentMethod) query = query.eq("payment_method", paymentMethod);

      const { data: payments, error } = await query;
      if (error) throw error;

      csvContent += "Student ID,Student Name,Batch,Billing Month,Billing Year,Expected Amount,Paid Amount,Due Amount,Status,Payment Date,Payment Method,Reference Number\n";

      payments?.forEach((p: any) => {
        const stud = p.student || {};
        const prof = stud.profile || {};
        const b = p.batch || {};
        const exp = Number(p.expected_amount) || 0;
        const paid = Number(p.paid_amount) || 0;
        const due = p.status === "WAIVED" ? 0 : Math.max(exp - paid, 0);

        csvContent += `${escapeCSV(stud.student_code)},`;
        csvContent += `${escapeCSV(prof.full_name)},`;
        csvContent += `${escapeCSV(`${b.name} (${b.code})`)},`;
        csvContent += `${escapeCSV(p.billing_month)},`;
        csvContent += `${escapeCSV(p.billing_year)},`;
        csvContent += `${escapeCSV(exp)},`;
        csvContent += `${escapeCSV(paid)},`;
        csvContent += `${escapeCSV(due)},`;
        csvContent += `${escapeCSV(p.status)},`;
        csvContent += `${escapeCSV(p.payment_date ? new Date(p.payment_date).toLocaleDateString() : "")},`;
        csvContent += `${escapeCSV(p.payment_method || "")},`;
        csvContent += `${escapeCSV(p.reference_number || "")}\n`;
      });

      filename = `payments-${billingYear || new Date().getFullYear()}-${billingMonth || new Date().getMonth() + 1}.csv`;
    } 
    else if (tab === "examination") {
      const batchId = searchParams.get("batchId") || "";
      const examType = searchParams.get("examType") || "";
      const pubStatus = searchParams.get("pubStatus") || "";
      const startDate = searchParams.get("startDate") || "";
      const endDate = searchParams.get("endDate") || "";

      auditFilters.batchId = batchId;
      auditFilters.examType = examType;
      auditFilters.pubStatus = pubStatus;
      auditFilters.startDate = startDate;
      auditFilters.endDate = endDate;

      let query = supabase
        .from("exams")
        .select(`
          id,
          name,
          exam_type,
          exam_date,
          total_marks,
          pass_marks,
          status,
          batch:batches (name, code)
        `);

      if (batchId) query = query.eq("batch_id", batchId);
      if (examType) query = query.eq("exam_type", examType);
      if (pubStatus) query = query.eq("status", pubStatus);
      if (startDate) query = query.gte("exam_date", startDate);
      if (endDate) query = query.lte("exam_date", endDate);

      const { data: exams, error } = await query;
      if (error) throw error;

      csvContent += "Exam Name,Batch,Date,Exam Type,Total Marks,Pass Marks,Status,Total Students,Present,Absent,Passed,Failed,Pass Percentage\n";

      for (const exam of exams) {
        // For each exam, query statistics from exam_results
        const { data: results } = await supabase
          .from("exam_results")
          .select("attendance_status, obtained_marks")
          .eq("exam_id", exam.id);

        const totalStudents = results?.length || 0;
        const present = results?.filter(r => r.attendance_status === "PRESENT").length || 0;
        const absent = results?.filter(r => r.attendance_status === "ABSENT").length || 0;
        
        let passed = 0;
        let failed = 0;

        results?.forEach(r => {
          if (r.attendance_status === "PRESENT") {
            if (Number(r.obtained_marks) >= Number(exam.pass_marks)) {
              passed++;
            } else {
              failed++;
            }
          }
        });

        const passPct = present > 0 ? ((passed / present) * 100).toFixed(0) + "%" : "0%";
        const b = (exam.batch as any) || {};

        csvContent += `${escapeCSV(exam.name)},`;
        csvContent += `${escapeCSV(`${b.name || ""} (${b.code || ""})`)},`;
        csvContent += `${escapeCSV(exam.exam_date)},`;
        csvContent += `${escapeCSV(exam.exam_type)},`;
        csvContent += `${escapeCSV(Number(exam.total_marks))},`;
        csvContent += `${escapeCSV(Number(exam.pass_marks))},`;
        csvContent += `${escapeCSV(exam.status)},`;
        csvContent += `${escapeCSV(totalStudents)},`;
        csvContent += `${escapeCSV(present)},`;
        csvContent += `${escapeCSV(absent)},`;
        csvContent += `${escapeCSV(passed)},`;
        csvContent += `${escapeCSV(failed)},`;
        csvContent += `${escapeCSV(passPct)}\n`;
      }

      filename = `exam-reports-${new Date().toISOString().split("T")[0]}.csv`;
    }

    // 3. Create Audit Log for CSV Export
    await createAuditLog({
      actorProfileId: profile.id,
      action: "REPORT_CSV_EXPORTED",
      entityType: "reports",
      entityId: "00000000-0000-0000-0000-000000000000",
      newValue: { tab, filters: auditFilters },
    });

    return new Response(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename=${filename}`,
      },
    });

  } catch (err: any) {
    console.error("CSV Export failure:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
