"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { MediaUploader } from "@/features/website-cms/components/MediaUploader";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export function CoursesHeroForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  
  const [eyebrow, setEyebrow] = useState(initialData?.eyebrow || "");
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(initialData?.status || "PUBLISHED");
  
  const [mediaId, setMediaId] = useState<string | null>(initialData?.content?.mediaId || null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(initialData?.mediaUrl || null);
  
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when initialData changes after a router.refresh()
  useEffect(() => {
    if (initialData) {
      setEyebrow(initialData.eyebrow || "");
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "PUBLISHED");
      setMediaId(initialData.content?.mediaId || null);
      setMediaUrl(initialData.mediaUrl || null);
    }
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updatePageSection("COURSES", "COURSES_HERO", {
        eyebrow,
        title,
        subtitle,
        description,
        status,
        content: { mediaId }
      });
      toast.success("Changes saved successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaSuccess = (newMediaId: string) => {
    setMediaId(newMediaId);
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
      <div className="space-y-4 border-b border-border/40 pb-6">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-accent" />
          Background Image
        </h3>
        <p className="text-sm text-muted">Upload a banner or cover image for the Courses Hero section.</p>
        
        {/* If we already have a mediaUrl from the DB, show it */}
        {mediaUrl && mediaId === initialData?.content?.mediaId && (
          <div className="relative w-full aspect-video max-h-64 rounded-xl overflow-hidden bg-bg border border-border/50 mb-4">
            <Image src={mediaUrl} alt="Current Background" fill className="object-contain" />
          </div>
        )}

        <MediaUploader 
          folderKey="COURSES"
          onUploadSuccess={handleMediaSuccess}
        />
        {mediaId && mediaId !== initialData?.content?.mediaId && (
          <p className="text-xs text-green-600 font-medium mt-2">New image uploaded and ready to save!</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-primary block">Eyebrow Text</label>
          <input 
            type="text" 
            value={eyebrow}
            onChange={e => setEyebrow(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm"
            placeholder="e.g. BATCHES & PROGRAMS"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-primary block">Status</label>
          <select 
            value={status}
            onChange={e => setStatus(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm font-medium"
          >
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-primary block">Title (First Line)</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm"
            placeholder="e.g. Explore Our Batches at"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-primary block">Title (Accent Line)</label>
          <input 
            type="text" 
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm"
            placeholder="e.g. Shifat's Tales"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-primary block">Description</label>
        <textarea 
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border/60 bg-bg text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/50 transition-all text-sm resize-none"
          placeholder="e.g. Explore our curriculum programs designed to guide students..."
        />
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="primary-btn px-6 py-2.5 text-sm font-bold flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </form>
  );
}
