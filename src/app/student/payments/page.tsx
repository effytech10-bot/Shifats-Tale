import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency } from "@/lib/currency";
import { CreditCard, Filter, BookOpen, AlertCircle } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{
    batch?: string;
    year?: string;
    status?: string;
  }>;
}

export default async function StudentPaymentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  // 1. Authoritative Access Gate Check
  const { destination, profile, studentProfile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") redirect("/login");
  if (destination === "PENDING_APPROVAL") redirect("/pending-approval");
  if (destination === "ACCOUNT_DISABLED") redirect("/account-disabled");
  if (destination === "INVALID_PROFILE" || !profile || !studentProfile) {
    redirect("/login?error=invalid_profile");
  }

  const supabase = await createClient();

  // Current system month/year for current stats
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYearVal = currentDate.getFullYear();

  const filterBatch = sp.batch || "";
  const filterYear = sp.year || "";
  const filterStatus = sp.status || "";

  // 2. Fetch active enrollments for the student
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      batch_id,
      batch:batches (
        id,
        name,
        code
      )
    `)
    .eq("student_id", studentProfile.id)
    .eq("status", "ACTIVE");

  const activeBatchCount = enrollments?.length || 0;

  // 3. Fetch all payments for this student
  let query = supabase
    .from("payments")
    .select(`
      *,
      batch:batches (
        id,
        name,
        code
      )
    `)
    .eq("student_id", studentProfile.id);

  if (filterBatch) query = query.eq("batch_id", filterBatch);
  if (filterYear) query = query.eq("billing_year", parseInt(filterYear));
  if (filterStatus) query = query.eq("status", filterStatus);

  query = query.order("billing_year", { ascending: false })
               .order("billing_month", { ascending: false });

  const { data: payments } = await query;

  // 4. Calculate current month aggregates for this student
  let currentMonthExpected = 0;
  let currentMonthPaid = 0;
  let currentMonthDue = 0;
  let currentMonthHasUnpaid = false;

  // Fetch payments specifically for current billing cycle to calculate aggregates
  const { data: currentPayments } = await supabase
    .from("payments")
    .select("expected_amount, paid_amount, status")
    .eq("student_id", studentProfile.id)
    .eq("billing_month", currentMonth)
    .eq("billing_year", currentYearVal);

  currentPayments?.forEach((p) => {
    const exp = Number(p.expected_amount) || 0;
    const paid = Number(p.paid_amount) || 0;

    currentMonthExpected += exp;
    currentMonthPaid += paid;

    if (p.status === "WAIVED") {
      currentMonthDue += 0;
    } else {
      currentMonthDue += Math.max(exp - paid, 0);
    }

    if (["UNPAID", "PARTIALLY_PAID"].includes(p.status)) {
      currentMonthHasUnpaid = true;
    }
  });

  const overallPaymentStatus = currentMonthDue > 0 
    ? "Dues Pending"
    : currentMonthExpected > 0 ? "Paid" : "No Dues Generated";

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Distinct billing years for the filter
  const distinctYears = Array.from(new Set(payments?.map(p => p.billing_year) || []))
    .sort((a, b) => b - a);

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title="My Payments & Tuition Fees"
        description="View your offline billing statements, tuition slip summaries, and historical balances."
      />

      {/* Summary Aggregate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Current Month Expected"
          description={`${monthNames[currentMonth - 1]} ${currentYearVal}`}
          icon={<CreditCard className="h-5 w-5 text-indigo-600" />}
        >
          <div className="pt-2">
            <span className="text-xl font-extrabold text-slate-800 block">
              {formatCurrency(currentMonthExpected)}
            </span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Current Month Paid"
          description="Total confirmed collection"
          icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
        >
          <div className="pt-2">
            <span className="text-xl font-extrabold text-emerald-700 block">
              {formatCurrency(currentMonthPaid)}
            </span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Current Month Outstanding"
          description="Due amount"
          icon={<CreditCard className="h-5 w-5 text-rose-600" />}
        >
          <div className="pt-2">
            <span className={`text-xl font-extrabold block ${currentMonthDue > 0 ? "text-rose-700" : "text-muted"}`}>
              {formatCurrency(currentMonthDue)}
            </span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Active Classes"
          description="Overall month status"
          icon={<BookOpen className="h-5 w-5 text-sky-600" />}
        >
          <div className="pt-2 flex justify-between items-center">
            <div>
              <span className="text-xl font-extrabold text-slate-800 block">
                {activeBatchCount}
              </span>
            </div>
            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
              overallPaymentStatus === "Paid"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : overallPaymentStatus === "Dues Pending"
                ? "bg-amber-50 text-amber-700 border border-amber-100"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}>
              {overallPaymentStatus}
            </span>
          </div>
        </DashboardCard>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-1.5 border-b border-border/20 pb-3">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-extrabold font-display">Filter History</h3>
          </div>

          <form method="GET" className="space-y-4">
            {/* Batch */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Class Batch
              </label>
              <select
                name="batch"
                defaultValue={filterBatch}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">All Batches</option>
                {enrollments?.map((enr) => (
                  <option key={(enr.batch as any)?.id} value={(enr.batch as any)?.id}>
                    {(enr.batch as any)?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Year
              </label>
              <select
                name="year"
                defaultValue={filterYear}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">All Years</option>
                {distinctYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Payment Status
              </label>
              <select
                name="status"
                defaultValue={filterStatus}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="WAIVED">Waived</option>
                <option value="REFUNDED">Refunded</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-bold transition-all"
            >
              Apply Filters
            </button>
          </form>
        </div>

        {/* Payment History List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold font-display border-b border-border/20 pb-3">
              Historical Fees Ledger
            </h3>

            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-primary">
                  <thead>
                    <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold font-sans">
                      <th className="pb-3">Billing Cycle</th>
                      <th className="pb-3">Class Batch</th>
                      <th className="pb-3 text-right">Expected</th>
                      <th className="pb-3 text-right">Paid</th>
                      <th className="pb-3 text-right">Due</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3">Receipt / Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/10">
                    {payments.map((p) => {
                      const due = p.status === "WAIVED" ? 0 : Math.max(Number(p.expected_amount) - Number(p.paid_amount), 0);
                      const bName = (p.batch as any)?.name || "Batch";

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/20">
                          <td className="py-3 font-extrabold">
                            {monthNames[p.billing_month - 1]} {p.billing_year}
                          </td>
                          <td className="py-3 text-slate-700">
                            {bName}
                          </td>
                          <td className="py-3 text-right font-bold text-slate-800">
                            {formatCurrency(p.expected_amount)}
                          </td>
                          <td className="py-3 text-right font-bold text-emerald-700">
                            {formatCurrency(p.paid_amount)}
                          </td>
                          <td className={`py-3 text-right font-bold ${due > 0 ? "text-rose-700" : "text-muted"}`}>
                            {formatCurrency(due)}
                          </td>
                          <td className="py-3 text-center">
                            <span className="inline-flex">
                              <StatusBadge status={p.status} />
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 font-medium">
                            <div className="flex flex-col text-[10px] space-y-0.5">
                              {p.reference_number && (
                                <span>Ref: <span className="font-extrabold text-primary font-mono">{p.reference_number}</span></span>
                              )}
                              {p.payment_method && (
                                <span>Method: <span className="font-extrabold text-primary">{p.payment_method}</span></span>
                              )}
                              {p.confirmed_at && (
                                <span>Stamp: {new Date(p.confirmed_at).toLocaleDateString()}</span>
                              )}
                              {p.student_note && (
                                <span className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-100 italic font-semibold inline-block max-w-[150px] truncate" title={p.student_note}>
                                  Note: {p.student_note}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted">
                <CreditCard className="h-8 w-8 mx-auto mb-2 stroke-1" />
                <p>No fee logs found matching the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
