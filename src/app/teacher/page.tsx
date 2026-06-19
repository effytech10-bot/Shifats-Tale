import React from "react";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Users, ShieldAlert } from "lucide-react";

export default async function TeacherDashboardPage() {
  const { profile } = await resolveAuthenticatedDestination();
  const supabase = await createClient();

  // Query database student counts
  const { count: pendingCount } = await supabase
    .from("student_profiles")
    .select("*", { count: "exact", head: true })
    .eq("registration_status", "PENDING");

  const { count: activeCount } = await supabase
    .from("student_profiles")
    .select("*", { count: "exact", head: true })
    .eq("registration_status", "APPROVED");

  return (
    <div className="space-y-8">
      {/* Title & Portal Stats */}
      <DashboardPageHeader
        title={`Welcome, ${profile?.full_name || "Teacher"}`}
        description="Portal administration dashboard to view student registers, batch configurations, and system logs."
      />

      {/* Grid of detail summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student register summary metrics */}
        <DashboardCard
          title="Student Register Overview"
          description="Verification metrics from portal registrations"
          icon={<Users className="h-5 w-5 text-primary" />}
        >
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 text-center">
              <span className="text-[28px] font-extrabold text-primary font-display block leading-none">
                {pendingCount ?? 0}
              </span>
              <span className="text-[10px] uppercase font-bold text-muted tracking-wide mt-2 block">
                Pending Approvals
              </span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <span className="text-[28px] font-extrabold text-emerald-700 font-display block leading-none">
                {activeCount ?? 0}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600/80 tracking-wide mt-2 block">
                Active Students
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* Administrative management system indicators */}
        <DashboardCard
          title="Portal Administrative Access"
          description="Upcoming management systems activation"
          icon={<ShieldAlert className="h-5 w-5 text-primary" />}
        >
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
            <h4 className="text-sm font-bold text-primary">
              Management Modules Activating Soon
            </h4>
            <p className="text-xs text-muted font-medium mt-1 leading-relaxed">
              Student batch registers, attendance logs, monthly payments ledger, study resource distribution, announcements broadcasting, and examination grading tables will be fully enabled here as they are integrated in the upcoming development phases.
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
