import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Layers,
  User,
  CreditCard,
  GraduationCap,
  Clock
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    action?: string;
    entityType?: string;
    studentId?: string;
    batchId?: string;
    paymentId?: string;
    examId?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
  }>;
}

export default async function TeacherAuditLogsPage({ searchParams }: PageProps) {
  // Authoritative server-side status and role verification
  const { profile, destination } = await resolveAuthenticatedDestination();

  if (destination !== "TEACHER_DASHBOARD" || !profile || profile.role !== "TEACHER") {
    redirect("/login");
  }

  const admin = createAdminClient();
  const sp = await searchParams;

  const filterAction = sp.action || "";
  const filterEntityType = sp.entityType || "";
  const filterStudentId = sp.studentId || "";
  const filterBatchId = sp.batchId || "";
  const filterPaymentId = sp.paymentId || "";
  const filterExamId = sp.examId || "";
  const filterStartDate = sp.startDate || "";
  const filterEndDate = sp.endDate || "";
  const currentPage = Math.max(1, parseInt(sp.page || "1"));
  const pageSize = 15;

  // 1. Fetch metadata options for filters
  // Distinct actions and entity types from audit_logs
  const { data: actionsData } = await admin.from("audit_logs").select("action");
  const actionsList = Array.from(new Set(actionsData?.map(a => a.action) || [])).sort();

  const { data: entitiesData } = await admin.from("audit_logs").select("entity_type");
  const entitiesList = Array.from(new Set(entitiesData?.map(e => e.entity_type) || [])).sort();

  // Batches
  const { data: batches } = await admin
    .from("batches")
    .select("id, name, code")
    .order("name", { ascending: true });

  // Students (APPROVED)
  const { data: students } = await admin
    .from("student_profiles")
    .select("id, student_code, profile:profiles(full_name)")
    .eq("registration_status", "APPROVED")
    .order("student_code", { ascending: true });

  // Payments (recent 50)
  const { data: payments } = await admin
    .from("payments")
    .select(`
      id,
      billing_month,
      billing_year,
      student:student_profiles(
        profile:profiles(full_name)
      )
    `)
    .order("created_at", { ascending: false })
    .limit(50);

  // Exams (recent 50)
  const { data: exams } = await admin
    .from("exams")
    .select("id, name, exam_date")
    .order("exam_date", { ascending: false })
    .limit(50);

  // 2. Query Audit Logs with filters
  let query = admin
    .from("audit_logs")
    .select(`
      *,
      actor:profiles (
        id,
        full_name,
        email,
        role
      )
    `, { count: "exact" });

  if (filterAction) query = query.eq("action", filterAction);
  if (filterEntityType) query = query.eq("entity_type", filterEntityType);
  
  // Specific entity UUID bindings
  if (filterStudentId) query = query.eq("entity_id", filterStudentId);
  if (filterBatchId) query = query.eq("entity_id", filterBatchId);
  if (filterPaymentId) query = query.eq("entity_id", filterPaymentId);
  if (filterExamId) query = query.eq("entity_id", filterExamId);

  // Dates
  if (filterStartDate) query = query.gte("created_at", filterStartDate);
  if (filterEndDate) query = query.lte("created_at", `${filterEndDate}T23:59:59.999Z`);

  // Sorting and Pagination
  query = query.order("created_at", { ascending: false });
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: auditLogs, count } = await query.range(from, to);
  const totalPages = Math.ceil((count || 0) / pageSize);

  // Helper to format values diff
  const renderDiffValues = (oldVal: any, newVal: any) => {
    if (!oldVal && !newVal) return <span className="text-slate-400 font-medium">None</span>;

    if (typeof oldVal !== "object" && typeof newVal !== "object") {
      return (
        <div className="text-[10px] font-mono font-bold">
          <span className="line-through text-rose-500">{String(oldVal || "")}</span>
          <span className="mx-1.5 text-primary">&rarr;</span>
          <span className="text-emerald-700">{String(newVal || "")}</span>
        </div>
      );
    }

    const allKeys = Array.from(new Set([...Object.keys(oldVal || {}), ...Object.keys(newVal || {})]));
    const changes = allKeys.filter(
      k => JSON.stringify(oldVal?.[k]) !== JSON.stringify(newVal?.[k])
    );

    if (changes.length === 0) {
      return <span className="text-slate-400 font-medium">No values changed</span>;
    }

    return (
      <div className="space-y-0.5 text-[9px] font-mono leading-tight bg-slate-50 p-2 rounded-xl border border-border/20 max-w-sm">
        {changes.map(k => {
          if (k === "updated_at" || k === "created_at") return null;
          const ov = oldVal?.[k];
          const nv = newVal?.[k];
          return (
            <div key={k} className="flex flex-wrap items-center gap-1">
              <span className="text-slate-500 font-bold">{k}:</span>
              <span className="line-through text-rose-600 font-bold truncate max-w-[80px]">{ov === undefined || ov === null ? "none" : JSON.stringify(ov)}</span>
              <span className="text-slate-400">&rarr;</span>
              <span className="text-emerald-700 font-black truncate max-w-[80px]">{nv === undefined || nv === null ? "none" : JSON.stringify(nv)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Helper to convert action codes into beautiful text
  const getHumanFriendlyAction = (action: string) => {
    return action.replace(/_/g, " ").toUpperCase();
  };

  return (
    <div className="space-y-8 text-xs font-bold text-primary max-w-full overflow-hidden">
      <DashboardPageHeader
        title="Administrative Security Audit Logs"
        description="Inspect append-only system audit trails, trace actor IP addresses, review configurations diffs, and ensure data integrity."
        actions={
          <div className="px-3.5 py-1.5 bg-primary/5 text-primary rounded-xl border border-primary/10 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold">Active Session Guarded</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-1.5 border-b border-border/20 pb-3">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-extrabold font-display">Log Filters</h3>
          </div>

          <form method="GET" className="space-y-3.5">
            {/* Action */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Action Event</label>
              <select
                name="action"
                defaultValue={filterAction}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">All Actions</option>
                {actionsList.map(a => (
                  <option key={a} value={a}>{getHumanFriendlyAction(a)}</option>
                ))}
              </select>
            </div>

            {/* Entity Type */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Entity Type</label>
              <select
                name="entityType"
                defaultValue={filterEntityType}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">All Entities</option>
                {entitiesList.map(e => (
                  <option key={e} value={e}>{e.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Student */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Student</label>
              <select
                name="studentId"
                defaultValue={filterStudentId}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">Choose Student</option>
                {students?.map(s => (
                  <option key={s.id} value={s.id}>{s.student_code} - {(s.profile as any)?.full_name}</option>
                ))}
              </select>
            </div>

            {/* Batch */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Batch</label>
              <select
                name="batchId"
                defaultValue={filterBatchId}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">Choose Batch</option>
                {batches?.map(b => (
                  <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                ))}
              </select>
            </div>

            {/* Payment */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Payment</label>
              <select
                name="paymentId"
                defaultValue={filterPaymentId}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">Choose Payment</option>
                {payments?.map(p => (
                  <option key={p.id} value={p.id}>
                    {(p.student as any)?.profile?.full_name} ({p.billing_month}/{p.billing_year})
                  </option>
                ))}
              </select>
            </div>

            {/* Exam */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Examination</label>
              <select
                name="examId"
                defaultValue={filterExamId}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">Choose Exam</option>
                {exams?.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.name} ({ex.exam_date})</option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Logged From</label>
              <input
                type="date"
                name="startDate"
                defaultValue={filterStartDate}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1">Logged To</label>
              <input
                type="date"
                name="endDate"
                defaultValue={filterEndDate}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-primary hover:bg-primary/95 text-white rounded-xl font-extrabold shadow-sm transition-all"
              >
                Apply Filters
              </button>
              <Link
                href="/teacher/audit-logs"
                className="px-3 py-2 border border-border bg-white hover:bg-slate-50 text-primary rounded-xl font-bold flex items-center justify-center transition-all"
                title="Reset filters"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>

        {/* Audit Logs Table Column */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-border/30 pb-3">
              <h3 className="text-sm font-extrabold font-display">Audit Trail Event Log</h3>
              <span className="text-[10px] text-muted uppercase font-bold">Total Logs: {count || 0}</span>
            </div>

            {auditLogs && auditLogs.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-primary">
                    <thead>
                      <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold">
                        <th className="pb-3">Logged Date</th>
                        <th className="pb-3">Actor / IP</th>
                        <th className="pb-3">Action Code</th>
                        <th className="pb-3">Target Entity</th>
                        <th className="pb-3">Changes Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10 font-sans">
                      {auditLogs.map((log) => {
                        const actorName = (log.actor as any)?.full_name || "System Process";
                        const actorEmail = (log.actor as any)?.email || "N/A";

                        return (
                          <tr key={log.id} className="hover:bg-slate-50/30 text-xs">
                            {/* Date */}
                            <td className="py-4 text-slate-500 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5 font-semibold text-[10px]">
                                <span className="text-primary font-bold">
                                  {new Date(log.created_at).toLocaleDateString()}
                                </span>
                                <span>
                                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </td>
                            {/* Actor & IP */}
                            <td className="py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-extrabold text-sm text-slate-800">{actorName}</span>
                                <span className="text-[9px] text-muted font-medium block">{actorEmail}</span>
                                <span className="text-[8px] text-slate-400 font-mono font-bold block mt-0.5">IP: {log.ip_address || "Internal"}</span>
                              </div>
                            </td>
                            {/* Action Code */}
                            <td className="py-4 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase bg-primary/5 text-primary border border-primary/10">
                                {log.action}
                              </span>
                            </td>
                            {/* Target Entity */}
                            <td className="py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-slate-700 uppercase text-[10px]">{log.entity_type}</span>
                                <span className="text-[8px] font-mono text-slate-400 truncate max-w-[120px]" title={log.entity_id}>
                                  ID: {log.entity_id}
                                </span>
                              </div>
                            </td>
                            {/* Diff */}
                            <td className="py-4">
                              {renderDiffValues(log.old_value, log.new_value)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-4 border-t border-border/20">
                    <span className="text-[10px] text-muted">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/teacher/audit-logs?action=${filterAction}&entityType=${filterEntityType}&studentId=${filterStudentId}&batchId=${filterBatchId}&paymentId=${filterPaymentId}&examId=${filterExamId}&startDate=${filterStartDate}&endDate=${filterEndDate}&page=${currentPage - 1}`}
                        className={`p-2 border border-border/80 rounded-xl bg-white hover:bg-slate-50 ${currentPage <= 1 ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/teacher/audit-logs?action=${filterAction}&entityType=${filterEntityType}&studentId=${filterStudentId}&batchId=${filterBatchId}&paymentId=${filterPaymentId}&examId=${filterExamId}&startDate=${filterStartDate}&endDate=${filterEndDate}&page=${currentPage + 1}`}
                        className={`p-2 border border-border/80 rounded-xl bg-white hover:bg-slate-50 ${currentPage >= totalPages ? "opacity-50 pointer-events-none" : ""}`}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted">
                <Clock className="h-10 w-10 text-muted stroke-1 mx-auto mb-3" />
                <h4 className="text-sm font-extrabold text-primary">No Audit Logs Found</h4>
                <p className="text-xs text-muted max-w-sm mt-1 mx-auto leading-relaxed font-medium">
                  No log entries match the active filters inside the audit ledger.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
