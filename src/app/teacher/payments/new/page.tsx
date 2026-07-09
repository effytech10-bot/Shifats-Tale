import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PaymentEntryForm } from "./payment-entry-form";

export default async function NewPaymentPage() {
  const supabase = await createClient();

  // Fetch approved student profiles with their active/valid enrollments and batch fee details
  const { data: students } = await supabase
    .from("student_profiles")
    .select(`
      id,
      student_code,
      profile:profiles!inner (
        full_name,
        email,
        phone,
        account_status
      ),
      enrollments (
        id,
        status,
        batch_id,
        batch:batches (
          id,
          name,
          code,
          monthly_fee
        )
      )
    `)
    .eq("registration_status", "APPROVED")
    .eq("profile.account_status", "ACTIVE"); // only active student accounts

  // Formatter mapping to satisfy TypeScript Student types:
  // PostgREST types joined tables as arrays, but they represent a single relation.
  const formattedStudents = (students || []).map((s: any) => ({
    id: s.id,
    student_code: s.student_code,
    profile: Array.isArray(s.profile) ? s.profile[0] : s.profile,
    enrollments: (s.enrollments || []).map((e: any) => ({
      id: e.id,
      status: e.status,
      batch_id: e.batch_id,
      batch: Array.isArray(e.batch) ? e.batch[0] : e.batch
    }))
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-8 text-xs font-bold text-primary">
      {/* Header */}
      <DashboardPageHeader
        title="Record New Offline Payment"
        description="Verify student enrollment, enter offline tuition slip collection amounts, and save billing status."
        actions={
          <Link
            href="/teacher/payments"
            className="px-4 py-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Payments</span>
          </Link>
        }
      />

      <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm">
        <PaymentEntryForm students={formattedStudents as any} />
      </div>
    </div>
  );
}
