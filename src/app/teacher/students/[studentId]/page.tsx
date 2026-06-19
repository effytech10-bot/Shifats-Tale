import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { StudentControlPanel } from "./student-control-panel";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Clock, 
  ArrowLeft,
  Calendar,
  Shield,
  BookOpen,
  Plus,
  CreditCard
} from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface PageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function TeacherStudentDetailsPage({ params }: PageProps) {
  const { studentId } = await params;
  const supabase = await createClient();

  // Fetch Student Profile details
  const { data: student, error } = await supabase
    .from("student_profiles")
    .select(`
      id,
      profile_id,
      student_code,
      academic_level,
      institution,
      guardian_name,
      guardian_phone,
      address,
      date_of_birth,
      registration_status,
      registered_at,
      profile:profiles (
        id,
        full_name,
        email,
        phone,
        account_status
      )
    `)
    .eq("id", studentId)
    .single();

  if (error || !student) {
    notFound();
  }

  // Fetch teacher note using the RPC helper since column-level privileges are restricted
  const { data: teacherNote } = await supabase.rpc("get_student_teacher_note", {
    student_uuid: studentId
  });

  const studentWithNote = {
    ...student,
    teacher_note: teacherNote
  };

  // Fetch all batches for enrollment dropdown selection
  const { data: allBatches } = await supabase
    .from("batches")
    .select("id, name, code, monthly_fee, status")
    .eq("status", "OPEN") // Show open admission batches
    .order("name", { ascending: true });

  // Fetch existing student enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      approved_at,
      disabled_at,
      disable_reason,
      completed_at,
      batch_id,
      batch:batches (
        id,
        name,
        code,
        monthly_fee
      )
    `)
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  // Fetch student payments
  const { data: studentPayments } = await supabase
    .from("payments")
    .select(`
      *,
      batch:batches (
        id,
        name,
        code
      )
    `)
    .eq("student_id", studentId)
    .order("billing_year", { ascending: false })
    .order("billing_month", { ascending: false });

  const currentMonthNum = new Date().getMonth() + 1;
  const currentYearNum = new Date().getFullYear();

  let curMonthExpected = 0;
  let curMonthPaid = 0;
  let curMonthDue = 0;

  studentPayments?.forEach((p) => {
    if (p.billing_month === currentMonthNum && p.billing_year === currentYearNum) {
      const exp = Number(p.expected_amount) || 0;
      const paid = Number(p.paid_amount) || 0;
      curMonthExpected += exp;
      curMonthPaid += paid;
      if (p.status === "WAIVED") {
        curMonthDue += 0;
      } else {
        curMonthDue += Math.max(exp - paid, 0);
      }
    }
  });

  // Fetch audit log summary for this student (combining student profile ID, profile user ID, and enrollment IDs)
  const enrollmentIds = enrollments?.map((e) => e.id) || [];
  const entityIds = [studentId, student.profile_id, ...enrollmentIds];
  
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select(`
      id,
      action,
      created_at,
      actor_user_id
    `)
    .in("entity_id", entityIds)
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch actor names mapping for audit logs
  const actorIds = Array.from(new Set(auditLogs?.map((log) => log.actor_user_id).filter(Boolean) || [])) as string[];
  const actorMap: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: actors } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", actorIds);
    actors?.forEach((a) => {
      actorMap[a.id] = a.full_name;
    });
  }

  const profile = (student.profile as any) || {};

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title={`Student Profile: ${profile.full_name}`}
        description={`Manage admission verification, batch enrollments, and check audit history logs.`}
        actions={
          <Link
            href="/teacher/students"
            className="px-4 py-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Students</span>
          </Link>
        }
      />

      {/* Grid: Demographics info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Demographics Card */}
        <DashboardCard
          title="Student Information"
          description="Demographics & Registration ID"
          icon={<User className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3 pt-2 text-primary">
            <div>
              <span className="text-[10px] text-muted uppercase block">Student ID Code</span>
              <span className="font-extrabold text-sm font-display mt-0.5 block">{student.student_code}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Full Name</span>
              <span className="font-extrabold text-sm mt-0.5 block">{profile.full_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Email Address</span>
              <span className="font-extrabold mt-0.5 block flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted" />
                <span>{profile.email}</span>
              </span>
            </div>
            {profile.phone && (
              <div>
                <span className="text-[10px] text-muted uppercase block">Phone Number</span>
                <span className="font-extrabold mt-0.5 block flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted" />
                  <span>{profile.phone}</span>
                </span>
              </div>
            )}
            <div>
              <span className="text-[10px] text-muted uppercase block">Registration Date</span>
              <span className="font-extrabold mt-0.5 block flex items-center gap-1.5 text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-muted" />
                <span>{new Date(student.registered_at).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </DashboardCard>

        {/* Guardian and Address Card */}
        <DashboardCard
          title="Parent & Guardian Info"
          description="Emergency contact details"
          icon={<Shield className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3 pt-2 text-primary">
            <div>
              <span className="text-[10px] text-muted uppercase block">Guardian Name</span>
              <span className="font-extrabold mt-0.5 block">{student.guardian_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Guardian Phone</span>
              <span className="font-extrabold mt-0.5 block flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted" />
                <span>{student.guardian_phone || "N/A"}</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Residential Address</span>
              <span className="font-extrabold mt-0.5 block flex items-center gap-1.5 text-slate-700 leading-normal">
                <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />
                <span>{student.address || "N/A"}</span>
              </span>
            </div>
            {student.date_of_birth && (
              <div>
                <span className="text-[10px] text-muted uppercase block">Date of Birth</span>
                <span className="font-extrabold mt-0.5 block">
                  {new Date(student.date_of_birth).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Academic Details Card */}
        <DashboardCard
          title="Academic Level"
          description="Institution & Grade Levels"
          icon={<GraduationCap className="h-5 w-5 text-primary" />}
        >
          <div className="space-y-3 pt-2 text-primary">
            <div>
              <span className="text-[10px] text-muted uppercase block">Class Level</span>
              <span className="font-extrabold text-sm mt-0.5 block">{student.academic_level}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Educational Institution</span>
              <span className="font-extrabold mt-0.5 block leading-normal">{student.institution}</span>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Registration status</span>
              <div className="mt-1">
                <StatusBadge status={student.registration_status} />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-muted uppercase block">Account access</span>
              <div className="mt-1">
                <span
                  className={`inline-flex px-2 py-0.5 border rounded-lg text-[10px] font-extrabold uppercase ${
                    profile.account_status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}
                >
                  {profile.account_status === "ACTIVE" ? "Active" : "Suspended"}
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Main control dashboard */}
      <StudentControlPanel
        student={studentWithNote}
        batches={allBatches || []}
        enrollments={enrollments || []}
      />

      {/* Tuition Payments Summary & History Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border/20 pb-3">
            <h3 className="text-sm font-extrabold font-display flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span>Student Payments History</span>
            </h3>
            <Link
              href="/teacher/payments/new"
              className="px-3 py-1.5 bg-primary hover:bg-primary/95 text-white text-[10px] uppercase font-black rounded-lg transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="h-3 w-3" />
              <span>Record Payment</span>
            </Link>
          </div>

          {studentPayments && studentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-primary">
                <thead>
                  <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold font-sans">
                    <th className="pb-3">Month/Year</th>
                    <th className="pb-3">Batch</th>
                    <th className="pb-3 text-right">Expected</th>
                    <th className="pb-3 text-right">Paid</th>
                    <th className="pb-3 text-right">Due</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {studentPayments.map((p) => {
                    const dueAmt = p.status === "WAIVED" ? 0 : Math.max(Number(p.expected_amount) - Number(p.paid_amount), 0);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/20">
                        <td className="py-2.5 font-extrabold">{p.billing_month}/{p.billing_year}</td>
                        <td className="py-2.5 text-slate-700">{(p.batch as any)?.name}</td>
                        <td className="py-2.5 text-right font-bold">{formatCurrency(p.expected_amount)}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-700">{formatCurrency(p.paid_amount)}</td>
                        <td className={`py-2.5 text-right font-bold ${dueAmt > 0 ? "text-rose-700" : "text-muted"}`}>{formatCurrency(dueAmt)}</td>
                        <td className="py-2.5 text-center">
                          <span className="inline-flex"><StatusBadge status={p.status} /></span>
                        </td>
                        <td className="py-2.5 text-right">
                          <Link href={`/teacher/payments/${p.id}`} className="px-2 py-1 text-[9px] border rounded hover:bg-slate-50">Manage</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-xs text-muted font-bold">No payments recorded for this student yet.</p>
          )}
        </div>

        {/* Current month stats & Batch-wise balances */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold font-display border-b border-border/20 pb-2">Current Month Summary</h3>
            <div className="space-y-2 text-xs font-bold text-primary">
              <div className="flex justify-between">
                <span className="text-muted">Expected:</span>
                <span>{formatCurrency(curMonthExpected)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Paid:</span>
                <span className="text-emerald-700">{formatCurrency(curMonthPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Outstanding Due:</span>
                <span className={curMonthDue > 0 ? "text-rose-700" : ""}>{formatCurrency(curMonthDue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold font-display border-b border-border/20 pb-2">Batch Status Details</h3>
            <div className="divide-y divide-border/10 space-y-2.5">
              {enrollments?.map((enr) => {
                // Find latest payment for this batch
                const latestPayment = studentPayments?.find(p => p.batch_id === enr.batch_id);
                return (
                  <div key={enr.id} className="pt-2 first:pt-0 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-extrabold block">{(enr.batch as any)?.name}</span>
                      <span className="text-[9px] text-muted block mt-0.5">Status: {enr.status}</span>
                    </div>
                    {latestPayment ? (
                      <span className="inline-flex"><StatusBadge status={latestPayment.status} /></span>
                    ) : (
                      <span className="text-[10px] text-muted italic">No billing</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Trail Summary logs */}
      <DashboardCard
        title="Audit Logs History"
        description="Portal administrative updates associated with this student profile"
        icon={<Clock className="h-5 w-5 text-primary" />}
      >
        {auditLogs && auditLogs.length > 0 ? (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs font-semibold text-primary">
              <thead>
                <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold">
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Actor / Teacher</th>
                  <th className="pb-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log: any) => (
                  <tr key={log.id} className="border-b border-border/10 last:border-0 hover:bg-slate-50/20">
                    <td className="py-2.5 font-extrabold text-primary font-display uppercase tracking-wider text-[11px]">
                      {log.action.replace(/_/g, " ")}
                    </td>
                    <td className="py-2.5 text-slate-700">
                      {log.actor_user_id ? actorMap[log.actor_user_id] || "System Admin" : "System Trigger"}
                    </td>
                    <td className="py-2.5 text-right text-muted text-[11px] font-bold">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-4 text-xs text-muted font-bold">
            No audit records registered for this student profile yet.
          </p>
        )}
      </DashboardCard>
    </div>
  );
}
