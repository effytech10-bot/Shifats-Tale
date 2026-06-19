"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  updateBatchStatusAction, 
  deleteBatchAction 
} from "@/app/actions/teacher";
import { 
  Eye, 
  Edit, 
  Play, 
  CheckCircle, 
  Archive, 
  XCircle, 
  Unlock, 
  Lock, 
  Trash2,
  Loader2,
  MoreVertical
} from "lucide-react";
import Link from "next/link";

interface BatchListActionsProps {
  batchId: string;
  batchCode: string;
  batchStatus: string;
  admissionOpen: boolean;
  canDelete: boolean;
}

export function BatchListActions({
  batchId,
  batchCode,
  batchStatus,
  admissionOpen,
  canDelete
}: BatchListActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleStatusChange = async (
    status?: "DRAFT" | "OPEN" | "RUNNING" | "COMPLETED" | "ARCHIVED" | "CANCELLED",
    openAdmission?: boolean
  ) => {
    setLoading(true);
    setMenuOpen(false);
    try {
      const res = await updateBatchStatusAction(batchId, status, openAdmission);
      if (!res.success) {
        alert(res.message || "Failed to update batch");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete batch ${batchCode}? This cannot be undone.`)) {
      return;
    }
    setLoading(true);
    setMenuOpen(false);
    try {
      const res = await deleteBatchAction(batchId);
      if (!res.success) {
        alert(res.message || "Failed to delete batch");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-end gap-2">
      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}

      {/* Primary Actions (View & Edit) */}
      <Link
        href={`/teacher/batches/${batchId}`}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-primary transition-colors"
        title="View details"
      >
        <Eye className="h-4 w-4" />
      </Link>
      
      <Link
        href={`/teacher/batches/${batchId}/edit`}
        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-primary transition-colors"
        title="Edit batch"
      >
        <Edit className="h-4 w-4" />
      </Link>

      {/* Status Menu Trigger */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-primary transition-colors"
          type="button"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-1 z-20 w-48 rounded-xl border border-border bg-white p-1 shadow-lg text-xs font-bold text-text">
              {/* Toggle Admission */}
              {admissionOpen ? (
                <button
                  onClick={() => handleStatusChange(undefined, false)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-rose-50 text-rose-600 text-left"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>Close Admission</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange(undefined, true)}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-emerald-50 text-emerald-600 text-left"
                >
                  <Unlock className="h-3.5 w-3.5" />
                  <span>Open Admission</span>
                </button>
              )}

              {/* Status Transitions */}
              {batchStatus !== "RUNNING" && (
                <button
                  onClick={() => handleStatusChange("RUNNING")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-bg text-text text-left"
                >
                  <Play className="h-3.5 w-3.5 text-muted" />
                  <span>Mark as Running</span>
                </button>
              )}

              {batchStatus !== "COMPLETED" && (
                <button
                  onClick={() => handleStatusChange("COMPLETED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-bg text-text text-left"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-muted" />
                  <span>Mark as Completed</span>
                </button>
              )}

              {batchStatus !== "ARCHIVED" && (
                <button
                  onClick={() => handleStatusChange("ARCHIVED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-bg text-text text-left"
                >
                  <Archive className="h-3.5 w-3.5 text-muted" />
                  <span>Archive Batch</span>
                </button>
              )}

              {batchStatus !== "CANCELLED" && (
                <button
                  onClick={() => handleStatusChange("CANCELLED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-bg text-text text-left"
                >
                  <XCircle className="h-3.5 w-3.5 text-muted" />
                  <span>Cancel Batch</span>
                </button>
              )}

              {/* Delete Draft Batches */}
              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-red-50 text-red-600 border-t border-border/40 mt-1 text-left"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Batch</span>
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
