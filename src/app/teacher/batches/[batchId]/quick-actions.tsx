"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateBatchStatusAction } from "@/app/actions/teacher";
import { Play, CheckCircle, Archive, XCircle, Unlock, Lock, Edit, Loader2 } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  batchId: string;
  status: string;
  admissionOpen: boolean;
}

export function QuickActions({ batchId, status, admissionOpen }: QuickActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = async (newStatus?: any, openAdm?: boolean) => {
    setLoading(true);
    try {
      const res = await updateBatchStatusAction(batchId, newStatus, openAdm);
      if (!res.success) {
        alert(res.message || "Failed to update batch");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4 text-xs font-bold text-primary">
      <h3 className="text-sm font-extrabold font-display border-b border-border/30 pb-2">
        Quick Administrative Controls
      </h3>

      {loading && (
        <div className="flex items-center gap-2 text-muted animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Processing action...</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {/* Toggle Admission */}
        {admissionOpen ? (
          <button
            onClick={() => handleAction(undefined, false)}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-rose-250 bg-rose-50 hover:bg-rose-100/50 text-rose-700 rounded-xl transition-all"
          >
            <Lock className="h-4 w-4" />
            <span>Close Admission</span>
          </button>
        ) : (
          <button
            onClick={() => handleAction(undefined, true)}
            disabled={loading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 border border-emerald-250 bg-emerald-50 hover:bg-emerald-100/50 text-emerald-700 rounded-xl transition-all"
          >
            <Unlock className="h-4 w-4" />
            <span>Open Admission</span>
          </button>
        )}

        {/* Edit */}
        <Link
          href={`/teacher/batches/${batchId}/edit`}
          className="flex items-center justify-center gap-2 py-2.5 px-3 border border-border/80 bg-white hover:bg-slate-50 text-muted rounded-xl transition-all text-center"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Details</span>
        </Link>
      </div>

      <div className="border-t border-border/30 pt-3 space-y-2">
        <span className="text-[10px] text-muted uppercase tracking-wider block">Transition Status</span>
        <div className="grid grid-cols-2 gap-2">
          {status !== "RUNNING" && (
            <button
              onClick={() => handleAction("RUNNING")}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-border/60 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Mark Running</span>
            </button>
          )}

          {status !== "COMPLETED" && (
            <button
              onClick={() => handleAction("COMPLETED")}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-border/60 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Complete Batch</span>
            </button>
          )}

          {status !== "ARCHIVED" && (
            <button
              onClick={() => handleAction("ARCHIVED")}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-border/60 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all"
            >
              <Archive className="h-3.5 w-3.5" />
              <span>Archive</span>
            </button>
          )}

          {status !== "CANCELLED" && (
            <button
              onClick={() => handleAction("CANCELLED")}
              disabled={loading}
              className="flex items-center justify-center gap-2 py-2 px-3 border border-border/60 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-all"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Cancel Batch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
