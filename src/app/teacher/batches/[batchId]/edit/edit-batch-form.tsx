"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { batchSchema, type BatchFormInput } from "@/lib/validations/batch";
import { updateBatchAction } from "@/app/actions/teacher";
import { Loader2, ArrowLeft, Save, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface EditBatchFormProps {
  batch: any;
  hasEnrollments: boolean;
}

export function EditBatchForm({ batch, hasEnrollments }: EditBatchFormProps) {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schedule = batch.schedule || {};

  const isRestricted = batch.status === "COMPLETED" || batch.status === "ARCHIVED";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: batch.name,
      code: batch.code,
      subject: batch.subject,
      academicLevel: batch.academic_level,
      description: batch.description || "",
      startDate: batch.start_date,
      endDate: batch.end_date || "",
      monthlyFee: batch.monthly_fee,
      admissionFee: batch.admission_fee,
      capacity: batch.capacity ?? undefined,
      status: batch.status,
      admissionOpen: batch.admission_open,
      scheduleDays: schedule.days || "",
      scheduleTime: schedule.time || "",
      coverImageUrl: batch.cover_image_url || "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await updateBatchAction(batch.id, data);
      if (!res.success) {
        if (res.errors) {
          const firstErrKey = Object.keys(res.errors)[0];
          const firstErrMsg = (res.errors as any)[firstErrKey][0];
          setErrorMsg(`${firstErrKey}: ${firstErrMsg}`);
        } else {
          setErrorMsg(res.message || "Failed to update batch.");
        }
      } else {
        router.push(`/teacher/batches/${batch.id}`);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl bg-white p-6 sm:p-8 rounded-2xl border border-border/40 shadow-sm text-xs font-bold text-primary">
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl text-xs font-extrabold">
          {errorMsg}
        </div>
      )}

      {isRestricted && (
        <div className="p-4 bg-amber-50 border border-amber-250 text-amber-800 rounded-xl text-xs font-extrabold flex gap-2 items-start">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            This batch is currently marked as <strong>{batch.status}</strong>. Custom updates to academic information, dates, schedules, or fee structures are disabled. You may only edit the batch status.
          </span>
        </div>
      )}

      {hasEnrollments && !isRestricted && (
        <div className="p-4 bg-blue-50 border border-blue-150 text-blue-800 rounded-xl text-xs font-extrabold flex gap-2 items-start">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            This batch has active or historical enrollments. Editing the batch code is locked to preserve records integration.
          </span>
        </div>
      )}

      {/* Grid: Core Batch fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Batch Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={isRestricted}
            {...register("name")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.name && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Batch Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={hasEnrollments || isRestricted}
            {...register("code")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none font-display uppercase disabled:opacity-50"
          />
          {errors.code && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={isRestricted}
            {...register("subject")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.subject && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.subject.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Academic Level <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            disabled={isRestricted}
            {...register("academicLevel")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.academicLevel && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.academicLevel.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            disabled={isRestricted}
            {...register("startDate")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.startDate && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            End Date (Optional)
          </label>
          <input
            type="date"
            disabled={isRestricted}
            {...register("endDate")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.endDate && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.endDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Monthly Fee (BDT) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            disabled={isRestricted}
            {...register("monthlyFee")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.monthlyFee && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.monthlyFee.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Admission Fee (BDT)
          </label>
          <input
            type="number"
            step="0.01"
            disabled={isRestricted}
            {...register("admissionFee")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.admissionFee && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.admissionFee.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Capacity (Student limit)
          </label>
          <input
            type="number"
            disabled={isRestricted}
            {...register("capacity")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
          {errors.capacity && (
            <p className="mt-1.5 text-rose-600 text-[10px] font-bold">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Batch Status
          </label>
          <select
            {...register("status")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none"
          >
            <option value="DRAFT">Draft</option>
            <option value="OPEN">Open (Accepting Admission)</option>
            <option value="RUNNING">Running</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Class Schedule Days
          </label>
          <input
            type="text"
            disabled={isRestricted}
            {...register("scheduleDays")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
            Class Schedule Time
          </label>
          <input
            type="text"
            disabled={isRestricted}
            {...register("scheduleTime")}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
          Description
        </label>
        <textarea
          rows={3}
          disabled={isRestricted}
          {...register("description")}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none resize-y disabled:opacity-50"
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase font-extrabold tracking-wider text-muted mb-2">
          Cover Image URL
        </label>
        <input
          type="text"
          disabled={isRestricted}
          {...register("coverImageUrl")}
          className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none disabled:opacity-50"
        />
      </div>

      {/* Checkbox settings */}
      <div className="flex items-center gap-2 p-3 bg-bg/20 rounded-xl border border-border/30">
        <input
          type="checkbox"
          id="admissionOpen"
          disabled={isRestricted}
          {...register("admissionOpen")}
          className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary disabled:opacity-50"
        />
        <label htmlFor="admissionOpen" className="text-xs font-extrabold text-primary select-none cursor-pointer">
          Open Admissions Immediately
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-border/30">
        <Link
          href={`/teacher/batches/${batch.id}`}
          className="px-5 py-2.5 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Cancel</span>
        </Link>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 primary-btn text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.02]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
