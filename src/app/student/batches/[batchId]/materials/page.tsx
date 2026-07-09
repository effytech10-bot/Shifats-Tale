import React from "react";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { FileText, Download, Eye, ExternalLink, ArrowLeft, Calendar, Info } from "lucide-react";
import { StudentMaterialList } from "@/components/materials/StudentMaterialList";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
}

export default async function StudentBatchMaterialsPage({ params }: PageProps) {
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

  const supabase = await createClient();

  // 2. Fetch Batch details
  const { data: batch, error: batchError } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (batchError || !batch) {
    notFound();
  }

  // 3. Authorization Check: Must have an ACTIVE enrollment in this batch
  if (!studentProfile) {
    redirect("/login?error=invalid_profile");
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .select("*")
    .eq("student_id", studentProfile.id)
    .eq("batch_id", batchId)
    .eq("status", "ACTIVE")
    .maybeSingle();

  if (enrollError || !enrollment) {
    redirect("/student?error=unauthorized_batch");
  }

  // 4. Fetch published, released and unexpired materials for this batch
  const nowStr = new Date().toISOString();
  
  // Use admin client or client. RLS allows select for active enrollment + published + released + unexpired.
  const { data: materials, error: materialsError } = await supabase
    .from("batch_contents")
    .select("*")
    .eq("batch_id", batchId)
    .eq("status", "PUBLISHED")
    .order("created_at", { ascending: false });

  if (materialsError) {
    console.error("Error loading batch materials:", materialsError);
  }

  // Extra application-level filtering to guarantee safety in case RLS is bypassed or misconfigured
  const activeMaterials = (materials || []).filter((m) => {
    const isReleased = !m.release_at || new Date(m.release_at) <= new Date();
    const isNotExpired = !m.expires_at || new Date(m.expires_at) > new Date();
    return isReleased && isNotExpired;
  });

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8 text-xs font-bold text-slate-800">
      {/* Back button and page header */}
      <div className="space-y-4">
        <Link
          href={`/student/batches/${batchId}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold text-xs"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Batch Details
        </Link>
        <DashboardPageHeader
          title={`${batch.name} - Study Materials`}
          description="Access handouts, lectures, PDF slides, homework sheets, and class notes."
        />
      </div>

      {activeMaterials.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-border/40 shadow-sm text-center max-w-lg mx-auto">
          <FileText className="h-12 w-12 text-slate-300 mx-auto stroke-1 mb-4" />
          <h3 className="text-sm font-extrabold text-slate-700">No materials available yet</h3>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed font-semibold">
            When the teacher uploads PDF handouts, notes, or links for this batch, they will be listed here.
          </p>
        </div>
      ) : (
        <StudentMaterialList materials={activeMaterials} batchId={batchId} />
      )}
    </div>
  );
}
