import React from "react";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Calendar, Bell, BookOpen, Clock, AlertCircle } from "lucide-react";

export default async function StudentDashboardPage() {
  const { profile, studentProfile } = await resolveAuthenticatedDestination();

  const supabase = await createClient();

  // Fetch active batch enrollments
  let enrollments: any[] = [];
  if (studentProfile) {
    const { data } = await supabase
      .from("enrollments")
      .select("*, batches(*)")
      .eq("student_id", studentProfile.id)
      .eq("status", "ACTIVE");
    enrollments = data || [];
  }

  const activeBatchCount = enrollments.length;

  return (
    <div className="space-y-8">
      {/* Page Title & Student ID */}
      <DashboardPageHeader
        title={`Welcome, ${profile?.full_name || "Student"}`}
        description="Track your learning batches and view notifications from your portal dashboard."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted uppercase">Student ID:</span>
            <span className="text-sm font-extrabold text-primary font-display bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
              {studentProfile?.student_code || "N/A"}
            </span>
          </div>
        }
      />

      {/* Grid of Details Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Batches */}
        <DashboardCard
          title="Active Batches"
          description={`Approved Class Enrollments (${activeBatchCount})`}
          icon={<BookOpen className="h-5 w-5 text-accent" />}
        >
          {activeBatchCount === 0 ? (
            <div className="text-center py-8 text-sm font-medium text-muted">
              You are not currently enrolled in any active batches.
            </div>
          ) : (
            <div className="space-y-3.5 pt-1">
              {enrollments.map((enrollment) => {
                const batch = enrollment.batches;
                const schedule = (
                  batch?.schedule && typeof batch.schedule === "object"
                    ? (batch.schedule as any)
                    : batch?.schedule
                    ? JSON.parse(batch.schedule as string)
                    : null
                ) as any;
                return (
                  <div
                    key={enrollment.id}
                    className="flex items-center justify-between p-3.5 bg-bg/40 border border-border/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-primary shadow-sm border border-border/40">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-primary">
                          {batch?.name || "Unnamed Batch"}
                        </h4>
                        <p className="text-[11px] font-semibold text-muted mt-0.5">
                          {schedule?.days || "Schedule Not Set"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted font-bold">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{schedule?.time || "Time Not Set"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>

        {/* Informational Gated State Announcement */}
        <DashboardCard
          title="Announcements & Notices"
          description="Portal status and upcoming features"
          icon={<Bell className="h-5 w-5 text-accent" />}
        >
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
            <div className="flex gap-2.5 text-primary">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold leading-normal">
                  Portal Modules Activating Soon
                </h4>
                <p className="text-xs text-muted font-medium mt-1 leading-relaxed">
                  Your online study resources, payments ledger, notice board, and class exam results will be enabled here as they are released.
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
