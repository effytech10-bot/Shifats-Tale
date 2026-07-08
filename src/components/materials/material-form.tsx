"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createMaterialAction, updateMaterialAction } from "@/app/actions/materials";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

interface Batch {
  id: string;
  name: string;
}

interface Props {
  batches: Batch[];
  initialData?: {
    id: string;
    batch_id: string;
    title: string;
    description: string | null;
    content_type: "PDF" | "DOC" | "DOCX" | "IMAGE" | "LINK" | "YOUTUBE" | "NOTE" | "ANNOUNCEMENT";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    external_url: string | null;
    allow_download: boolean;
    release_at: string | null;
    expires_at: string | null;
    original_filename: string | null;
  };
}

export function MaterialForm({ batches, initialData }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEdit = !!initialData;

  // Form states
  const [batchId, setBatchId] = useState(initialData?.batch_id || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [contentType, setContentType] = useState(initialData?.content_type || "PDF");
  const [status, setStatus] = useState(initialData?.status || "DRAFT");
  const [description, setDescription] = useState(initialData?.description || "");
  const [externalUrl, setExternalUrl] = useState(initialData?.external_url || "");
  const [allowDownload, setAllowDownload] = useState(initialData?.allow_download ?? true);
  
  // Format release/expiry dates for datetime-local input (YYYY-MM-DDTHH:MM)
  const formatDateForInput = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (num: number) => String(num).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const [releaseAt, setReleaseAt] = useState(formatDateForInput(initialData?.release_at || null));
  const [expiresAt, setExpiresAt] = useState(formatDateForInput(initialData?.expires_at || null));

  // File input state
  const [file, setFile] = useState<File | null>(null);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState("");

  const isFileBased = ["PDF", "DOC", "DOCX", "IMAGE"].includes(contentType);
  const isLinkBased = ["LINK", "YOUTUBE"].includes(contentType);
  const isTextBased = ["NOTE", "ANNOUNCEMENT"].includes(contentType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    // Client-side validations
    const fieldErrors: Record<string, string[]> = {};
    if (!batchId) fieldErrors.batchId = ["Please select a batch."];
    if (!title.trim()) fieldErrors.title = ["Title is required."];
    if (isLinkBased && !externalUrl.trim()) {
      fieldErrors.externalUrl = ["External URL is required for links."];
    }
    if (isTextBased && !description.trim()) {
      fieldErrors.description = ["Description/Body text is required for Notes/Announcements."];
    }
    if (isFileBased && !isEdit && !file) {
      fieldErrors.file = ["A file upload is required."];
    }
    
    // Check file size (4MB limit for server actions)
    if (file && file.size > 4 * 1024 * 1024) {
      fieldErrors.file = ["File size must be less than 4MB."];
    }

    if (releaseAt && expiresAt && new Date(expiresAt) <= new Date(releaseAt)) {
      fieldErrors.expiresAt = ["Expiry date must be after release date."];
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("batchId", batchId);
    formData.append("title", title);
    formData.append("contentType", contentType);
    formData.append("status", status);
    formData.append("description", description);
    formData.append("externalUrl", externalUrl);
    formData.append("allowDownload", String(allowDownload));
    if (releaseAt) formData.append("releaseAt", new Date(releaseAt).toISOString());
    if (expiresAt) formData.append("expiresAt", new Date(expiresAt).toISOString());
    if (file) {
      formData.append("file", file);
    }

    startTransition(async () => {
      let result;
      if (isEdit) {
        result = await updateMaterialAction(initialData!.id, formData);
      } else {
        result = await createMaterialAction(formData);
      }

      if (result.success) {
        router.push(`/teacher/materials`);
        router.refresh();
      } else {
        if (result.errors) {
          setErrors(result.errors as any);
        } else {
          setSubmitError(result.message || "An error occurred.");
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl mx-auto space-y-6 text-xs font-bold text-slate-800">
      {submitError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl">
          {submitError}
        </div>
      )}

      {/* Title */}
      <h2 className="text-sm font-black text-slate-900 border-b border-slate-50 pb-3">
        {isEdit ? "Edit Study Material" : "Create Study Material"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Batch Select */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Target Batch</label>
          <select
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="">-- Choose Batch --</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.batchId && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.batchId[0]}</p>}
        </div>

        {/* Content Type Select */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            {["PDF", "DOC", "DOCX", "IMAGE", "LINK", "YOUTUBE", "NOTE", "ANNOUNCEMENT"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Material Title */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Material Title</label>
        <input
          type="text"
          placeholder="e.g. Physics Chapter 3 Lecture Notes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
        />
        {errors.title && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.title[0]}</p>}
      </div>

      {/* Description / Text body */}
      <div>
        <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">
          {isTextBased ? "Body Text Content *" : "Description (Optional)"}
        </label>
        <textarea
          rows={4}
          placeholder={isTextBased ? "Type your note/message here..." : "Provide brief context for this material..."}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
        />
        {errors.description && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.description[0]}</p>}
      </div>

      {/* External URL for link-based content */}
      {isLinkBased && (
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Resource URL *</label>
          <input
            type="url"
            placeholder="https://example.com/handout"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-xs font-semibold text-slate-700"
          />
          {errors.externalUrl && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.externalUrl[0]}</p>}
        </div>
      )}

      {/* File input for file-based content */}
      {isFileBased && (
        <div className="space-y-2">
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">
            {isEdit ? "Replace File (Leave empty to keep current)" : "Upload File *"}
          </label>
          {isEdit && initialData?.original_filename && (
            <p className="text-[10px] text-slate-500 font-semibold mb-2">
              Current File: <span className="text-slate-800">{initialData.original_filename}</span>
            </p>
          )}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs text-slate-700 font-semibold"
          />
          <p className="text-[9px] text-slate-400 font-semibold">
            Allowed formats: PDF, DOC, DOCX (Max 25MB) | JPG, PNG, WEBP (Max 10MB)
          </p>
          {errors.file && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.file[0]}</p>}
        </div>
      )}

      {/* Release At & Expires At scheduling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Release Date & Time (Optional)</label>
          <input
            type="datetime-local"
            value={releaseAt}
            onChange={(e) => setReleaseAt(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-semibold text-slate-700"
          />
          <p className="text-[9px] text-slate-400 font-semibold mt-1">Leave empty for immediate release.</p>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Expiration Date & Time (Optional)</label>
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-xs font-semibold text-slate-700"
          />
          {errors.expiresAt && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.expiresAt[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2 border-t border-slate-50">
        {/* Publication Status */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-1.5 uppercase">Publication Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="DRAFT">Draft (Visible to Teacher Only)</option>
            <option value="PUBLISHED">Published (Visible to Enrolled Students)</option>
            <option value="ARCHIVED">Archived (Hidden from Student dashboard)</option>
          </select>
        </div>

        {/* Allow Download checkbox */}
        {isFileBased && (
          <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:pl-4">
            <input
              type="checkbox"
              id="allowDownload"
              checked={allowDownload}
              onChange={(e) => setAllowDownload(e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
            />
            <label htmlFor="allowDownload" className="text-xs font-extrabold text-slate-700 select-none cursor-pointer">
              Allow Students to Download File
            </label>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-2.5 pt-4">
        <Link
          href="/teacher/materials"
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-bold text-xs"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white hover:bg-primary-dark rounded-xl transition-all font-bold text-xs disabled:opacity-55"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Material
            </>
          )}
        </button>
      </div>
    </form>
  );
}
