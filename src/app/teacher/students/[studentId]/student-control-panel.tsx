"use client";

import React, { useState } from "react";
import { 
  updateStudentNoteAction, 
  updateStudentRegistrationAction, 
  updateStudentAccountStatusAction,
  enrollStudentAction
} from "@/app/actions/teacher";
import { EnrollmentRowActions } from "@/components/dashboard/enrollment-row-actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { useRouter as useNextRouter } from "next/navigation";
import { Loader2, Plus, Edit, Save, UserX, UserCheck, AlertTriangle } from "lucide-react";

interface StudentControlPanelProps {
  student: any;
  batches: any[]; // List of all batches
  enrollments: any[]; // Existing enrollments
}

export function StudentControlPanel({
  student,
  batches,
  enrollments,
}: StudentControlPanelProps) {
  const router = useNextRouter();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState(student.teacher_note || "");
  const [savingNote, setSavingNote] = useState(false);

  // Enrollment form state
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [enrollStatus, setEnrollStatus] = useState<"PENDING" | "ACTIVE">("PENDING");

  // Filtering out batches already enrolled in
  const enrolledBatchIds = new Set(enrollments.map((e) => e.batch_id));
  const availableBatches = batches.filter((b) => !enrolledBatchIds.has(b.id));

  const handleSaveNote = async () => {
    setSavingNote(true);
    try {
      const res = await updateStudentNoteAction(student.id, note);
      if (!res.success) {
        alert(res.message || "Failed to update note");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleRegistration = async (status: "APPROVED" | "REJECTED") => {
    setLoading(true);
    try {
      const res = await updateStudentRegistrationAction(student.id, status);
      if (!res.success) {
        alert(res.message || "Failed to update registration status");
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

  const handleAccountStatus = async (status: "ACTIVE" | "DISABLED") => {
    let reason: string | null = null;
    if (status === "DISABLED") {
      const input = prompt("Please enter a reason for disabling this student's account:");
      if (input === null) return;
      if (input.trim() === "") {
        alert("A reason is required to suspend an account.");
        return;
      }
      reason = input.trim();
    }

    setLoading(true);
    try {
      const res = await updateStudentAccountStatusAction({
        profileId: student.profile_id,
        newStatus: status,
        reason,
      });

      if (!res.success) {
        alert(res.message || "Failed to update account status");
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

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchId) {
      alert("Please select a batch to enroll.");
      return;
    }

    setLoading(true);
    try {
      const res = await enrollStudentAction(student.id, selectedBatchId, enrollStatus);
      if (!res.success) {
        alert(res.message || "Enrollment failed.");
      } else {
        setSelectedBatchId("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert("Error during enrollment");
    } finally {
      setLoading(false);
    }
  };

  const profile = student.profile || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs font-bold text-primary">
      {/* Main console content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Enrollments List */}
        <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-border/30 pb-3">
            <h3 className="text-sm font-extrabold font-display">Batch Enrollments</h3>
            <span className="text-[10px] text-muted uppercase">Linked to {enrollments.length} classes</span>
          </div>

          {enrollments.length > 0 ? (
            <div className="divide-y divide-border/20">
              {enrollments.map((enr) => (
                <div key={enr.id} className="py-4.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <h4 className="font-extrabold text-sm">{enr.batch?.name}</h4>
                    <div className="flex gap-2 text-[10px] text-muted font-bold mt-1">
                      <span className="uppercase">{enr.batch?.code}</span>
                      <span>&bull;</span>
                      <span>Monthly Fee: {enr.batch?.monthly_fee} BDT</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={enr.status} />
                      {enr.status === "DISABLED" && enr.disable_reason && (
                        <span className="text-[9px] text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 max-w-[150px] truncate" title={enr.disable_reason}>
                          Reason: {enr.disable_reason}
                        </span>
                      )}
                    </div>
                    <EnrollmentRowActions
                      enrollmentId={enr.id}
                      currentStatus={enr.status}
                      studentName={profile.full_name || "Student"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted font-bold">
              This student has no enrollments. Use the panel on the right to enroll them in a batch.
            </div>
          )}
        </div>

        {/* Notes Form */}
        <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold font-display border-b border-border/30 pb-3">
            Teacher Private Notes
          </h3>
          <p className="text-[11px] text-muted font-medium leading-relaxed">
            Write down confidential student performance observations, schedules conflicts, parent request comments, or feedback histories. Only teachers can see this information.
          </p>
          <div className="space-y-3.5">
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter notes about the student..."
              className="w-full p-4 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none resize-y"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNote}
                disabled={savingNote}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                {savingNote ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save Note</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Column */}
      <div className="space-y-6">
        {/* Enroll in new batch form */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold font-display border-b border-border/30 pb-2 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-primary" />
            <span>Add to Batch</span>
          </h3>

          {availableBatches.length > 0 ? (
            <form onSubmit={handleEnroll} className="space-y-3.5">
              <div>
                <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                  Select Class Batch
                </label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border/60 bg-bg/20 focus:border-primary focus:outline-none"
                  disabled={loading}
                >
                  <option value="">Choose a Batch...</option>
                  {availableBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                  Enrollment Status
                </label>
                <select
                  value={enrollStatus}
                  onChange={(e) => setEnrollStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-border/60 bg-bg/20 focus:border-primary focus:outline-none"
                  disabled={loading}
                >
                  <option value="PENDING">Pending (Awaiting Offline Payment)</option>
                  <option value="ACTIVE">Active (Enroll Immediately)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !selectedBatchId}
                className="w-full py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>Enroll in Batch</span>
              </button>
            </form>
          ) : (
            <p className="text-xs text-muted font-semibold text-center py-2">
              This student is already registered in all available active batches.
            </p>
          )}
        </div>

        {/* Profile State actions */}
        <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold font-display border-b border-border/30 pb-2">
            Verification Controls
          </h3>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-muted animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Processing action...</span>
            </div>
          )}

          {/* Registration Status options */}
          {student.registration_status === "PENDING" && (
            <div className="space-y-2">
              <span className="text-[10px] text-muted uppercase tracking-wider block">Registration Processing</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleRegistration("APPROVED")}
                  disabled={loading}
                  className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100/50 text-emerald-700 rounded-xl border border-emerald-250 transition-all text-center"
                >
                  Approve Registration
                </button>
                <button
                  onClick={() => handleRegistration("REJECTED")}
                  disabled={loading}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100/50 text-rose-700 rounded-xl border border-rose-250 transition-all text-center"
                >
                  Reject Registration
                </button>
              </div>
            </div>
          )}

          {/* Suspend or Reactivate Account */}
          <div className="space-y-2">
            <span className="text-[10px] text-muted uppercase tracking-wider block">Account Suspension</span>
            {profile.account_status === "ACTIVE" ? (
              <button
                onClick={() => handleAccountStatus("DISABLED")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-rose-250 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl transition-all"
              >
                <UserX className="h-4 w-4" />
                <span>Suspend Profile Account</span>
              </button>
            ) : (
              <button
                onClick={() => handleAccountStatus("ACTIVE")}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 border border-emerald-250 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-all"
              >
                <UserCheck className="h-4 w-4" />
                <span>Reactivate Profile Account</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
