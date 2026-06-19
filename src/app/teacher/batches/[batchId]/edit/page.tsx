import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { notFound } from "next/navigation";
import { EditBatchForm } from "./edit-batch-form";

interface PageProps {
  params: Promise<{
    batchId: string;
  }>;
}

export default async function EditBatchPage({ params }: PageProps) {
  const { batchId } = await params;
  const supabase = await createClient();

  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("id", batchId)
    .single();

  if (error || !batch) {
    notFound();
  }

  // Check if enrollments exist
  const { count } = await supabase
    .from("enrollments")
    .select("id", { count: "exact", head: true })
    .eq("batch_id", batchId);

  const hasEnrollments = (count || 0) > 0;

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={`Edit Batch: ${batch.name}`}
        description="Modify schedules, fees, limits, and configurations for this program."
      />
      <div className="flex justify-center md:justify-start">
        <EditBatchForm batch={batch} hasEnrollments={hasEnrollments} />
      </div>
    </div>
  );
}
