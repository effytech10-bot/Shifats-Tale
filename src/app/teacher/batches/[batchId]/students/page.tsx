import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { EnrollmentRowActions } from "@/components/dashboard/enrollment-row-actions";
import { ArrowLeft, Users, Mail, Phone, Calendar } from "lucide-react";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
}

export default async function BatchStudentsPage({ params }: PageProps) {
  const { batchId } = await params;
  const supabase = await createClient();

  // Fetch Batch Details
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError || !batch) {
    notFound();
  }

  // Fetch Enrollments for Batch
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      approved_at,
      disabled_at,
      disable_reason,
      completed_at,
      student:student_profiles (
        id,
        student_code,
        profile:profiles (
          id,
          full_name,
          email,
          phone
        )
      )
    `)
    .eq("batch_id", batchId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* Header */}
      <DashboardPageHeader
        title={`Students: ${batch.name}`}
        description={`Manage enrollments and review active/suspended memberships for batch ${batch.code}.`}
        actions={
          <div className="flex gap-2">
            <Link
              href={`/teacher/batches/${batchId}`}
              className="px-4 py-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Batch</span>
            </Link>
          </div>
        }
      />

      {/* Tabs Menu */}
      <div className="flex border-b border-border/40 gap-4 overflow-x-auto text-xs font-bold text-muted">
        <Link
          href={`/teacher/batches/${batchId}?tab=overview`}
          className="pb-3 px-1 transition-all border-b-2 border-transparent hover:text-primary"
        >
          Overview
        </Link>
        <Link
          href={`/teacher/batches/${batchId}/students`}
          className="pb-3 px-1 transition-all border-b-2 border-primary text-primary font-bold"
        >
          Students ({enrollments?.length || 0})
        </Link>
        <Link
          href={`/teacher/batches/${batchId}?tab=payments`}
          className="pb-3 px-1 transition-all border-b-2 border-transparent hover:text-primary"
        >
          Payments (Placeholder)
        </Link>
        <Link
          href={`/teacher/batches/${batchId}?tab=materials`}
          className="pb-3 px-1 transition-all border-b-2 border-transparent hover:text-primary"
        >
          Materials (Placeholder)
        </Link>
        <Link
          href={`/teacher/batches/${batchId}/exams`}
          className="pb-3 px-1 transition-all border-b-2 border-transparent hover:text-primary"
        >
          Exams
        </Link>
      </div>

      {/* Students Table */}
      <div className="bg-white border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        {enrollments && enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50/50 border-b border-border/30 text-muted uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="py-4 px-6">Student Code & Name</th>
                  <th className="py-4 px-6">Contact Information</th>
                  <th className="py-4 px-6">Enrollment Status</th>
                  <th className="py-4 px-6">Timestamps</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-primary">
                {enrollments.map((enr: any) => {
                  const student = enr.student;
                  const profile = student?.profile;
                  
                  return (
                    <tr key={enr.id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Name & Code */}
                      <td className="py-4 px-6">
                        <Link
                          href={`/teacher/students/${student?.id}`}
                          className="font-extrabold text-primary hover:text-accent font-display block text-sm"
                        >
                          {profile?.full_name || "Unnamed Student"}
                        </Link>
                        <span className="text-[10px] font-bold text-muted/70 block mt-0.5">
                          ID: <span className="font-display font-bold">{student?.student_code || "N/A"}</span>
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="h-3.5 w-3.5 text-muted" />
                          <span>{profile?.email}</span>
                        </div>
                        {profile?.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                            <Phone className="h-3 w-3 text-muted" />
                            <span>{profile?.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start gap-1">
                          <StatusBadge status={enr.status} />
                          {enr.status === "DISABLED" && enr.disable_reason && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 max-w-[200px] truncate" title={enr.disable_reason}>
                              Reason: {enr.disable_reason}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-6 text-muted text-[11px] font-bold space-y-1">
                        {enr.approved_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-emerald-600" />
                            <span>Approved: {new Date(enr.approved_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        {enr.status === "DISABLED" && enr.disabled_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-rose-600" />
                            <span>Suspended: {new Date(enr.disabled_at).toLocaleDateString()}</span>
                          </div>
                        )}
                        {enr.status === "COMPLETED" && enr.completed_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-blue-600" />
                            <span>Completed: {new Date(enr.completed_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <EnrollmentRowActions
                          enrollmentId={enr.id}
                          currentStatus={enr.status}
                          studentName={profile?.full_name || "Student"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Users className="h-10 w-10 text-muted/50 stroke-1 mb-3" />
            <h4 className="text-sm font-bold text-primary">No enrollments in this batch</h4>
            <p className="text-xs text-muted font-medium mt-1 max-w-xs leading-relaxed">
              No students are currently linked to this batch. You can add them from the student details page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
