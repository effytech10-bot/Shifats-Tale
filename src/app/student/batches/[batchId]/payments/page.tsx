import React from "react";
import { redirect, notFound } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { formatCurrency } from "@/lib/currency";
import { ArrowLeft, CreditCard } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
}

export default async function StudentBatchPaymentsPage({ params }: PageProps) {
  const { batchId } = await params;

  // 1. Authoritative Auth Check
  const { destination, profile, studentProfile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") redirect("/login");
  if (destination === "PENDING_APPROVAL") redirect("/pending-approval");
  if (destination === "ACCOUNT_DISABLED") redirect("/account-disabled");
  if (destination === "INVALID_PROFILE" || !profile || !studentProfile) {
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
  // Student must have an ACTIVE enrollment in this batch
  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", studentProfile.id)
    .eq("batch_id", batchId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (enrollError || !enrollment) {
    // Guessing URL protection redirect
    redirect("/student?error=unauthorized_batch_payments");
  }

  // 4. Query payment history for this specific student in this specific batch
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentProfile.id)
    .eq("batch_id", batchId)
    .order("billing_year", { ascending: false })
    .order("billing_month", { ascending: false });

  // Calculate aggregates
  let expectedTotal = 0;
  let collectedTotal = 0;
  let dueTotal = 0;

  payments?.forEach((p) => {
    const exp = Number(p.expected_amount) || 0;
    const paid = Number(p.paid_amount) || 0;
    expectedTotal += exp;
    collectedTotal += paid;

    if (p.status === "WAIVED") {
      dueTotal += 0;
    } else {
      dueTotal += Math.max(exp - paid, 0);
    }
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title={`Tuition Fees: ${batch.name}`}
        description={`Your billing ledger details and receipts for class code ${batch.code}`}
        actions={
          <Link
            href={`/student/batches/${batchId}`}
            className="px-4 py-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Batch Detail</span>
          </Link>
        }
      />

      {/* Aggregates Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Expected Fees"
          description="Standard fees invoiced"
          icon={<CreditCard className="h-5 w-5 text-indigo-600" />}
        >
          <div className="pt-2">
            <span className="text-xl font-extrabold text-slate-800 block">
              {formatCurrency(expectedTotal)}
            </span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Total Confirmed Paid"
          description="Collections received offline"
          icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
        >
          <div className="pt-2">
            <span className="text-xl font-extrabold text-emerald-700 block">
              {formatCurrency(collectedTotal)}
            </span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Outstanding Balance Due"
          description="Pending offline slip confirmation"
          icon={<CreditCard className="h-5 w-5 text-rose-600" />}
        >
          <div className="pt-2">
            <span className={`text-xl font-extrabold block ${dueTotal > 0 ? "text-rose-700" : "text-muted"}`}>
              {formatCurrency(dueTotal)}
            </span>
          </div>
        </DashboardCard>
      </div>

      {/* Slips table */}
      <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
        <h3 className="text-sm font-extrabold font-display border-b border-border/20 pb-3">
          Billing History Log
        </h3>

        {payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-primary">
              <thead>
                <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold font-sans">
                  <th className="pb-3">Billing Cycle</th>
                  <th className="pb-3 text-right">Expected Fee</th>
                  <th className="pb-3 text-right">Paid Amount</th>
                  <th className="pb-3 text-right">Due Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-right">Method & Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {payments.map((p) => {
                  const due = p.status === "WAIVED" ? 0 : Math.max(Number(p.expected_amount) - Number(p.paid_amount), 0);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/20">
                      <td className="py-3 font-extrabold">
                        {monthNames[p.billing_month - 1]} {p.billing_year}
                      </td>
                      <td className="py-3 text-right text-slate-800 font-bold">
                        {formatCurrency(p.expected_amount)}
                      </td>
                      <td className="py-3 text-right text-emerald-700 font-bold">
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
                      <td className="py-3 text-right text-slate-500 font-medium">
                        <div className="flex flex-col text-[10px] space-y-0.5">
                          {p.payment_method && (
                            <span>Method: <span className="font-extrabold text-primary">{p.payment_method}</span></span>
                          )}
                          {p.reference_number && (
                            <span>Ref: <span className="font-extrabold text-primary font-mono">{p.reference_number}</span></span>
                          )}
                          {p.confirmed_at && (
                            <span>Stamp: {new Date(p.confirmed_at).toLocaleDateString()}</span>
                          )}
                          {p.student_note && (
                            <span className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-100 italic font-semibold inline-block max-w-[150px] truncate" title={p.student_note}>
                              {p.student_note}
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
            <p>No billing statement generated for this batch yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
