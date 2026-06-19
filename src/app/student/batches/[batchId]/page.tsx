import React from "react";
import { redirect, notFound } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Calendar, Clock, CreditCard, FileText, Award, Layers } from "lucide-react";

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
          <div className="p-5 border border-dashed border-border/60 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center text-center py-8">
            <CreditCard className="h-8 w-8 text-muted/6 stroke-1 mb-2" />
            <h4 className="text-xs font-extrabold text-primary">Fees Record Closed</h4>
            <p className="text-[10px] text-muted mt-1 leading-relaxed max-w-[250px]">
              Monthly billing lists, expected tuition fees, payment confirmation receipts, and offline invoice slip uploads will be integrated soon.
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
