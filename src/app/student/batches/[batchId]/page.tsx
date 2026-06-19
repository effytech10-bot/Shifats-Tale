import React from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Calendar, Clock, CreditCard, FileText, Award, Layers } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
}

export default async function StudentBatchDetailsPage({ params }: PageProps) {
  const { batchId } = await params;

  // 1. Authoritative Auth Check
  const { destination, profile, studentProfile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination === "PENDING_APPROVAL") {
    redirect("/pending-approval");
  }
  if (destination === "ACCOUNT_DISABLED") {
    redirect("/account-disabled");
  }
  if (destination === "INVALID_PROFILE") {
    redirect("/login?error=invalid_profile");
  }

  // 2. Query Batch details
  const supabase = await createClient();
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError || !batch) {
    notFound();
  }

  // 3. Authorization Check:
  // Teacher can see any batch.
  // Student must have an ACTIVE enrollment in this batch.
  let enrollment = null;
  if (profile?.role === "STUDENT") {
    if (!studentProfile) {
      redirect("/login?error=invalid_profile");
    }

    const { data: enr, error: enrollError } = await supabase
      .from("enrollments")
      .select("*")
      .eq("student_id", studentProfile.id)
      .eq("batch_id", batchId)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (enrollError || !enr) {
      // Guessing URL protection redirect
      redirect("/student?error=unauthorized_batch");
    }
    enrollment = enr;
  }

  // 4. Fetch payment records for this student and batch
  let studentBatchPayments: any[] = [];
  if (profile?.role === "STUDENT" && studentProfile) {
    const { data: pay } = await supabase
      .from("payments")
      .select("*")
      .eq("student_id", studentProfile.id)
      .eq("batch_id", batchId)
      .order("billing_year", { ascending: false })
      .order("billing_month", { ascending: false });
    studentBatchPayments = pay || [];
  }

  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();

  const currentMonthPayment = studentBatchPayments.find(
    (p) => p.billing_month === currentMonthNum && p.billing_year === currentYearNum
  );

  const currentMonthStatus = currentMonthPayment ? currentMonthPayment.status : "UNPAID";

  const latestConfirmedPayment = studentBatchPayments.find((p) => p.confirmed_at !== null);
  const latestConfirmation = latestConfirmedPayment
    ? `${new Date(latestConfirmedPayment.confirmed_at).toLocaleDateString()} (${formatCurrency(latestConfirmedPayment.paid_amount)})`
    : "None";

  const outstandingDue = studentBatchPayments.reduce((sum, p) => {
    if (p.status === "WAIVED") return sum;
    return sum + Math.max(Number(p.expected_amount) - Number(p.paid_amount), 0);
  }, 0);

  const recentHistory = studentBatchPayments.slice(0, 3);

  const schedule = (
    batch.schedule && typeof batch.schedule === "object"
      ? batch.schedule
      : batch.schedule
      ? JSON.parse(batch.schedule as string)
      : {}
  ) as any;

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title={batch.name}
        description={`Learning syllabus and curriculum details for class code ${batch.code}.`}
        actions={
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted uppercase">Enrollment status:</span>
            <span className="inline-flex px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
              Active
            </span>
          </div>
        }
      />

      {/* Grid: Overview Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Schedule card */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/5 text-primary rounded-xl border border-primary/10">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase block">Weekly Schedule</span>
            <span className="text-xs font-extrabold text-primary mt-1 block">
              {schedule.days || "Schedule Not Set"}
            </span>
          </div>
        </div>

        {/* Time Card */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/5 text-primary rounded-xl border border-primary/10">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase block">Class Time Slot</span>
            <span className="text-xs font-extrabold text-primary mt-1 block">
              {schedule.time || "Time Not Set"}
            </span>
          </div>
        </div>

        {/* Subject Card */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/5 text-primary rounded-xl border border-primary/10">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] text-muted uppercase block">Subject & level</span>
            <span className="text-xs font-extrabold text-primary mt-1 block">
              {batch.subject} ({batch.academic_level})
            </span>
          </div>
        </div>
      </div>

      {/* Modules Placeholder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Study Materials */}
        <DashboardCard
          title="Class Materials & Resources"
          description="Handouts, PDF files, and lectures"
          icon={<FileText className="h-5 w-5 text-accent" />}
        >
          <div className="p-5 border border-dashed border-border/60 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center text-center py-8">
            <FileText className="h-8 w-8 text-muted/6 stroke-1 mb-2" />
            <h4 className="text-xs font-extrabold text-primary">Materials Panel Locked</h4>
            <p className="text-[10px] text-muted mt-1 leading-relaxed max-w-[250px]">
              Syllabus PDF files, homework handouts, and lecture resources will be accessible once uploaded by the teacher in the next phase.
            </p>
          </div>
        </DashboardCard>

        {/* Examinations */}
        <DashboardCard
          title="Upcoming Exams & Tests"
          description="Scheduled grading sheets"
          icon={<Award className="h-5 w-5 text-accent" />}
        >
          <div className="p-5 border border-dashed border-border/60 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center text-center py-8">
            <Award className="h-8 w-8 text-muted/6 stroke-1 mb-2" />
            <h4 className="text-xs font-extrabold text-primary">No Exams Scheduled</h4>
            <p className="text-[10px] text-muted mt-1 leading-relaxed max-w-[250px]">
              Weekly examinations, class tests schedules, and pass boundaries configurations will appear here during tests season.
            </p>
          </div>
        </DashboardCard>

        {/* Results */}
        <DashboardCard
          title="Academic Performance Results"
          description="Exam scores & percentile rankings"
          icon={<Layers className="h-5 w-5 text-accent" />}
        >
          <div className="p-5 border border-dashed border-border/60 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center text-center py-8">
            <Layers className="h-8 w-8 text-muted/6 stroke-1 mb-2" />
            <h4 className="text-xs font-extrabold text-primary">No Scores Logged</h4>
            <p className="text-[10px] text-muted mt-1 leading-relaxed max-w-[250px]">
              Exam obtained marks, pass/fail status updates, grade logs, and class rankings sheets will be published after test gradings.
            </p>
          </div>
        </DashboardCard>

        {/* Payments */}
        <DashboardCard
          title="Tuition Fees & Payments"
          description="Monthly fee ledger logs"
          icon={<CreditCard className="h-5 w-5 text-accent" />}
        >
          <div className="space-y-4 pt-2 text-xs font-bold text-primary">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase tracking-wide text-muted block">Current Month Status</span>
                <span className="mt-1 block">
                  <StatusBadge status={currentMonthStatus} />
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wide text-muted block">Outstanding Due</span>
                <span className={`text-sm font-black mt-1 block ${outstandingDue > 0 ? "text-rose-700" : "text-emerald-700"}`}>
                  {formatCurrency(outstandingDue)}
                </span>
              </div>
            </div>

            <div className="border-t border-border/20 pt-3">
              <span className="text-[9px] uppercase tracking-wide text-muted block">Latest Confirmation</span>
              <span className="font-extrabold text-slate-800 mt-1 block">{latestConfirmation}</span>
            </div>

            <div className="border-t border-border/20 pt-3 space-y-2">
              <span className="text-[9px] uppercase tracking-wide text-muted block">Recent History</span>
              {recentHistory.length > 0 ? (
                <div className="space-y-1.5 font-semibold text-slate-600">
                  {recentHistory.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-[10px]">
                      <span>{p.billing_month}/{p.billing_year}</span>
                      <span className="font-bold">{formatCurrency(p.paid_amount)} paid</span>
                      <span><StatusBadge status={p.status} /></span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-muted italic">No payment history recorded.</p>
              )}
            </div>

            <div className="pt-3 border-t border-border/20 text-center">
              <Link
                href={`/student/batches/${batchId}/payments`}
                className="text-[10px] text-primary hover:underline"
              >
                View Full Payments History &rarr;
              </Link>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
