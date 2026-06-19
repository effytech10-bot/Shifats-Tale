import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { QuickActions } from "./quick-actions";
import { 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  ArrowLeft,
  Settings,
  HelpCircle
} from "lucide-react";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function TeacherBatchDetailsPage({ params, searchParams }: PageProps) {
  const { batchId } = await params;
  const sp = await searchParams;
  const activeTab = sp.tab || "overview";

  const supabase = await createClient();

  // Fetch Batch Details
  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (error || !batch) {
    notFound();
  }

  // Fetch Enrollments Counts
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("status")
    .eq("batch_id", batchId);

  let activeCount = 0;
  let pendingCount = 0;
  let disabledCount = 0;
  let completedCount = 0;

  enrollments?.forEach((e) => {
    if (e.status === "ACTIVE") activeCount++;
    else if (e.status === "PENDING") pendingCount++;
    else if (e.status === "DISABLED") disabledCount++;
    else if (e.status === "COMPLETED") completedCount++;
  });

  // Fetch Recent Enrollments (limit 5)
  const { data: recentEnrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      created_at,
      student_id,
      student:student_profiles (
        id,
        student_code,
        profile:profiles (
          id,
          full_name,
          email
        )
      )
    `)
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false })
    .limit(5);

  const schedule = (
    batch.schedule && typeof batch.schedule === "object"
      ? batch.schedule
      : batch.schedule
      ? JSON.parse(batch.schedule as string)
      : {}
  ) as any;

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardPageHeader
        title={`Batch: ${batch.name}`}
        description={`Manage enrollments, resources, exams, and settings for batch code ${batch.code}.`}
        actions={
          <Link
            href="/teacher/batches"
            className="px-4 py-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Batches</span>
          </Link>
        }
      />

      {/* Tabs Menu */}
      <div className="flex border-b border-border/40 gap-4 overflow-x-auto text-xs font-bold text-muted">
        <Link
          href={`/teacher/batches/${batchId}?tab=overview`}
          className={`pb-3 px-1 transition-all border-b-2 hover:text-primary ${
            activeTab === "overview" ? "border-primary text-primary" : "border-transparent"
          }`}
        >
          Overview
        </Link>
        <Link
          href={`/teacher/batches/${batchId}/students`}
          className="pb-3 px-1 transition-all border-b-2 border-transparent hover:text-primary"
        >
          Students ({activeCount + pendingCount + disabledCount + completedCount})
        </Link>
        <Link
          href={`/teacher/batches/${batchId}?tab=payments`}
          className={`pb-3 px-1 transition-all border-b-2 hover:text-primary ${
            activeTab === "payments" ? "border-primary text-primary" : "border-transparent"
          }`}
        >
          Payments (Placeholder)
        </Link>
        <Link
          href={`/teacher/batches/${batchId}?tab=materials`}
          className={`pb-3 px-1 transition-all border-b-2 hover:text-primary ${
            activeTab === "materials" ? "border-primary text-primary" : "border-transparent"
          }`}
        >
          Materials (Placeholder)
        </Link>
        <Link
          href={`/teacher/batches/${batchId}?tab=exams`}
          className={`pb-3 px-1 transition-all border-b-2 hover:text-primary ${
            activeTab === "exams" ? "border-primary text-primary" : "border-transparent"
          }`}
        >
          Exams (Placeholder)
        </Link>
      </div>

      {/* Dynamic Content by Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-emerald-700 font-display block leading-none">
                  {activeCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-600/80 tracking-wide mt-2 block">
                  Active
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-amber-700 font-display block leading-none">
                  {pendingCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-amber-600/80 tracking-wide mt-2 block">
                  Pending
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-slate-600 font-display block leading-none">
                  {disabledCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wide mt-2 block">
                  Disabled
                </span>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
                <span className="text-2xl font-extrabold text-blue-700 font-display block leading-none">
                  {completedCount}
                </span>
                <span className="text-[9px] uppercase font-bold text-blue-600/80 tracking-wide mt-2 block">
                  Completed
                </span>
              </div>
            </div>

            {/* Batch Info Card */}
            <DashboardCard
              title="Batch Information"
              description="Detailed attributes of this curriculum"
              icon={<BookOpen className="h-5 w-5 text-primary" />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold pt-2 text-primary">
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Subject</span>
                  <span className="font-extrabold mt-0.5 block">{batch.subject}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Academic Level</span>
                  <span className="font-extrabold mt-0.5 block">{batch.academic_level}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Start Date</span>
                  <span className="font-extrabold mt-0.5 block">{batch.start_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">End Date</span>
                  <span className="font-extrabold mt-0.5 block">{batch.end_date || "Continuous"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Schedule</span>
                  <span className="font-extrabold mt-0.5 block">
                    {schedule.days || "Not Set"} &bull; {schedule.time || "Not Set"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Fees</span>
                  <span className="font-extrabold mt-0.5 block">
                    Monthly: {batch.monthly_fee} BDT {batch.admission_fee > 0 ? `| Admission: ${batch.admission_fee} BDT` : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Capacity Limit</span>
                  <span className="font-extrabold mt-0.5 block">{batch.capacity || "Unlimited"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Batch Code</span>
                  <span className="font-extrabold mt-0.5 block font-display uppercase">{batch.code}</span>
                </div>
              </div>

              {batch.description && (
                <div className="border-t border-border/20 pt-4.5 mt-4.5 text-xs text-muted leading-relaxed font-medium">
                  <span className="text-[10px] text-muted uppercase font-bold block mb-1">Description</span>
                  {batch.description}
                </div>
              )}
            </DashboardCard>

            {/* Recent Enrollments */}
            <DashboardCard
              title="Recent Enrollments"
              description="Latest student signups for this batch"
              icon={<Users className="h-5 w-5 text-primary" />}
            >
              {recentEnrollments && recentEnrollments.length > 0 ? (
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead>
                      <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold">
                        <th className="pb-3">Student Name</th>
                        <th className="pb-3">ID Code</th>
                        <th className="pb-3 text-center">Status</th>
                        <th className="pb-3 text-right">Registered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentEnrollments.map((enr: any) => (
                        <tr key={enr.id} className="border-b border-border/10 last:border-0">
                          <td className="py-3 font-extrabold text-primary">
                            {enr.student?.profile?.full_name}
                          </td>
                          <td className="py-3 font-display text-primary font-bold">
                            {enr.student?.student_code}
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex justify-center">
                              <StatusBadge status={enr.status} />
                            </span>
                          </td>
                          <td className="py-3 text-right text-muted text-[11px] font-bold">
                            {new Date(enr.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted font-bold">
                  No students have been enrolled in this batch yet.
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Sidebar Quick Actions and Status Cards */}
          <div className="space-y-6">
            {/* Status Panel */}
            <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4 text-xs font-bold text-primary">
              <h3 className="text-sm font-extrabold font-display border-b border-border/30 pb-2">
                Batch Status Details
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-muted">Lifecycle Status:</span>
                <StatusBadge status={batch.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted">Admission status:</span>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${
                    batch.admission_open
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {batch.admission_open ? "Open" : "Closed"}
                </span>
              </div>
            </div>

            {/* Quick Actions Component */}
            <QuickActions
              batchId={batchId}
              status={batch.status}
              admissionOpen={batch.admission_open}
            />
          </div>
        </div>
      )}

      {/* Placeholders */}
      {activeTab === "payments" && (
        <div className="p-8 bg-white border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <CreditCard className="h-10 w-10 text-muted stroke-1 mb-4" />
          <h3 className="text-sm font-extrabold text-primary">Payments Ledger Placeholder</h3>
          <p className="text-xs text-muted max-w-sm font-medium mt-1 leading-relaxed">
            The student monthly fees ledgers, invoice generations, online gateways mapping, and payment confirmations panel will be fully implemented in the next phase.
          </p>
        </div>
      )}

      {activeTab === "materials" && (
        <div className="p-8 bg-white border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <FileText className="h-10 w-10 text-muted stroke-1 mb-4" />
          <h3 className="text-sm font-extrabold text-primary">Study Materials Placeholder</h3>
          <p className="text-xs text-muted max-w-sm font-medium mt-1 leading-relaxed">
            The study material distribution system, including PDF handouts uploading, lecture video embeds, link distributions, and release-time settings will be integrated in the next phase.
          </p>
        </div>
      )}

      {activeTab === "exams" && (
        <div className="p-8 bg-white border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <GraduationCap className="h-10 w-10 text-muted stroke-1 mb-4" />
          <h3 className="text-sm font-extrabold text-primary">Examinations & Grading Placeholder</h3>
          <p className="text-xs text-muted max-w-sm font-medium mt-1 leading-relaxed">
            Class tests, weekly exams scheduling, pass marks configurations, grade sheets entry, and auto percentile rankings will be released in the upcoming phases.
          </p>
        </div>
      )}
    </div>
  );
}
