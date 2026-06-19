"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEnrollmentStatusAction } from "@/app/actions/teacher";
import { Loader2, Settings, Ban, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";

interface EnrollmentRowActionsProps {
  enrollmentId: string;
  currentStatus: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED";
  studentName: string;
}

export function EnrollmentRowActions({
  enrollmentId,
  currentStatus,
  studentName,
}: EnrollmentRowActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleTransition = async (
    newStatus: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED" | "REJECTED" | "CANCELLED"
  ) => {
    let reason: string | null = null;
    let explicitConfirmation = false;

    // 1. Check for disabling reason
    if (newStatus === "DISABLED") {
      const input = prompt(`Please enter a reason for disabling ${studentName}'s enrollment:`);
      if (input === null) return; // Cancelled prompt
      if (input.trim() === "") {
        alert("A reason is required to suspend enrollment.");
        return;
      }
      reason = input.trim();
    }

    // 2. Check for completed -> active explicit confirmation
    if (currentStatus === "COMPLETED" && newStatus === "ACTIVE") {
      const confirmActive = confirm(
        `Are you sure you want to reactivate this COMPLETED enrollment? This requires explicit confirmation.`
      );
      if (!confirmActive) return;
      explicitConfirmation = true;
    }

    // 3. Check for rejected -> pending explicit confirmation
    if (currentStatus === "REJECTED" && newStatus === "PENDING") {
      const confirmPending = confirm(
        `Are you sure you want to return this REJECTED enrollment to PENDING? This requires explicit confirmation.`
      );
      if (!confirmPending) return;
      explicitConfirmation = true;
    }

    setLoading(true);
    setOpen(false);
    try {
      const res = await updateEnrollmentStatusAction({
        enrollmentId,
        newStatus,
        disableReason: reason,
        explicitConfirmation,
      });

      if (!res.success) {
        alert(res.message || "Failed to update enrollment status");
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
    <div className="relative inline-flex items-center gap-1.5 text-xs font-bold text-primary">
      {loading && <Loader2 className="h-4 w-4 animate-spin text-muted" />}

      <button
        onClick={() => setOpen(!open)}
        className="px-2.5 py-1 rounded-xl border border-border/80 bg-white hover:bg-slate-50 text-slate-600 hover:text-primary transition-all flex items-center gap-1"
        type="button"
      >
        <Settings className="h-3.5 w-3.5" />
        <span>Manage</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-8 top-0 z-20 w-44 rounded-xl border border-border bg-white p-1 shadow-lg text-left">
            {/* PENDING -> ACTIVE, REJECTED, CANCELLED */}
            {currentStatus === "PENDING" && (
              <>
                <button
                  onClick={() => handleTransition("ACTIVE")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-emerald-50 text-emerald-700 text-left"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Activate</span>
                </button>
                <button
                  onClick={() => handleTransition("REJECTED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-rose-50 text-rose-700 text-left"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleTransition("CANCELLED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-slate-50 text-slate-600 text-left"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </>
            )}

            {/* ACTIVE -> DISABLED, COMPLETED, CANCELLED */}
            {currentStatus === "ACTIVE" && (
              <>
                <button
                  onClick={() => handleTransition("DISABLED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-rose-50 text-rose-700 text-left"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Disable/Suspend</span>
                </button>
                <button
                  onClick={() => handleTransition("COMPLETED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-blue-50 text-blue-700 text-left"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Complete</span>
                </button>
                <button
                  onClick={() => handleTransition("CANCELLED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-slate-50 text-slate-600 text-left"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </>
            )}

            {/* DISABLED -> ACTIVE, CANCELLED */}
            {currentStatus === "DISABLED" && (
              <>
                <button
                  onClick={() => handleTransition("ACTIVE")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-emerald-50 text-emerald-700 text-left"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reactivate</span>
                </button>
                <button
                  onClick={() => handleTransition("CANCELLED")}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-slate-50 text-slate-600 text-left"
                >
                  <Ban className="h-3.5 w-3.5" />
                  <span>Cancel</span>
                </button>
              </>
            )}

            {/* COMPLETED -> ACTIVE (requires confirmation) */}
            {currentStatus === "COMPLETED" && (
              <button
                onClick={() => handleTransition("ACTIVE")}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-emerald-50 text-emerald-700 text-left"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reactivate (Force)</span>
              </button>
            )}

            {/* REJECTED -> PENDING (requires confirmation) */}
            {currentStatus === "REJECTED" && (
              <button
                onClick={() => handleTransition("PENDING")}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 hover:bg-slate-50 text-slate-600 text-left"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Reset to Pending</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
