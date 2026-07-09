"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Loader2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { upsertSectionItem } from "@/features/website-cms/actions/content-actions";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

interface CourseCardModalProps {
  item: any | null;
  onClose: () => void;
  onSave: (savedItem: any, isNew: boolean) => void;
}

export default function CourseCardModal({ item, onClose, onSave }: CourseCardModalProps) {
  const meta = item?.metadata || {};
  
  const [isSaving, setIsSaving] = useState(false);
  
  const [title, setTitle] = useState(item?.title || "");
  const [subtitle, setSubtitle] = useState(item?.subtitle || "");
  const [body, setBody] = useState(item?.body || "");
  
  const [target, setTarget] = useState(meta.target || "");
  const [examType, setExamType] = useState(meta.examType || "Engineering");
  const [schedule, setSchedule] = useState(meta.schedule || "");
  const [duration, setDuration] = useState(meta.duration || "");
  const [features, setFeatures] = useState<string[]>(meta.features || [""]);
  
  const [mediaId, setMediaId] = useState<string | null>(item?.media_id || null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(item?.mediaUrl || null);
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleRemoveFeature = (idx: number) => {
    const newFeatures = [...features];
    newFeatures.splice(idx, 1);
    setFeatures(newFeatures);
  };
  const handleFeatureChange = (idx: number, val: string) => {
    const newFeatures = [...features];
    newFeatures[idx] = val;
    setFeatures(newFeatures);
  };

  const handleSave = async () => {
    if (!title || !examType) {
      toast.error("Title and Exam Type are required.");
      return;
    }

    // Clean features (remove empty ones)
    const cleanedFeatures = features.filter(f => f.trim() !== "");

    const payload = {
      id: item?.id,
      title,
      subtitle,
      body,
      media_id: mediaId,
      status: "PUBLISHED" as const,
      metadata: {
        target,
        examType,
        schedule,
        duration,
        features: cleanedFeatures,
        fallbackImageUrl: meta.fallbackImageUrl // preserve if no mediaId is selected
      }
    };

    try {
      setIsSaving(true);
      const res = await upsertSectionItem("COURSES_CARDS", payload);
      
      // Construct the saved item format to update UI without refetching immediately
      const savedItem = {
        ...item,
        id: res?.id || item?.id || Math.random().toString(36).substr(2, 9), // Use real ID if available
        title,
        subtitle,
        body,
        media_id: mediaId,
        mediaUrl: mediaUrl || meta.fallbackImageUrl,
        metadata: payload.metadata
      };
      
      toast.success(item ? "Course updated successfully" : "Course created successfully");
      onSave(savedItem, !item);
    } catch (err: any) {
      toast.error(err.message || "Failed to save course");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col my-8">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-[#08132E]">{item ? "Edit Course Card" : "Add New Course Card"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Core Details */}
            <div className="space-y-5">
              <h3 className="font-bold text-gray-700 border-b pb-2">Core Details</h3>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Course Title *</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                  placeholder="e.g. BUET Admission 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={subtitle} 
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                  placeholder="e.g. Intensive Admission Care"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  value={body} 
                  onChange={(e) => setBody(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent resize-none"
                  placeholder="Short description about the course..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Target Audience</label>
                  <input 
                    type="text" 
                    value={target} 
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                    placeholder="e.g. HSC 26 & 27"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Exam Type Filter *</label>
                  <select 
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="University">University</option>
                    <option value="Medical">Medical</option>
                    <option value="Board">Board Exams</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Schedule</label>
                  <input 
                    type="text" 
                    value={schedule} 
                    onChange={(e) => setSchedule(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                    placeholder="e.g. 3 days/week"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                    placeholder="e.g. 6 Months"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Media & Features */}
            <div className="space-y-5">
              <h3 className="font-bold text-gray-700 border-b pb-2">Banner & Features</h3>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Card Banner Image</label>
                {mediaUrl ? (
                  <div className="relative w-full h-40 bg-[#FFF9F2] rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden mb-3">
                    <img src={mediaUrl} alt="Banner Preview" className="h-full object-contain p-2" />
                    <button 
                      onClick={() => { setMediaId(null); setMediaUrl(null); }}
                      className="absolute top-2 right-2 bg-red-100 text-red-600 p-1.5 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gray-50 rounded-xl border-2 border-dashed border-border flex items-center justify-center mb-3">
                    <span className="text-sm text-gray-500">No image selected</span>
                  </div>
                )}
                
                <button 
                  onClick={() => setIsMediaSelectorOpen(true)}
                  className="w-full py-2 border border-accent text-accent rounded-lg font-bold hover:bg-accent/5 transition-colors"
                >
                  {mediaUrl ? "Change Image" : "Select Image"}
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex justify-between items-center">
                  <span>Key Features</span>
                  <button onClick={handleAddFeature} className="text-xs text-accent flex items-center space-x-1 hover:underline">
                    <Plus className="w-3 h-3" />
                    <span>Add Feature</span>
                  </button>
                </label>
                <div className="space-y-2">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />
                      <input 
                        type="text" 
                        value={feature}
                        onChange={(e) => handleFeatureChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-border rounded-lg focus:outline-none focus:border-accent"
                        placeholder="e.g. Daily model tests"
                      />
                      <button onClick={() => handleRemoveFeature(idx)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {features.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No features added. Click "Add Feature" above.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end space-x-3 bg-gray-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="primary-btn px-8 py-2 font-bold disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{isSaving ? "Saving..." : "Save Course"}</span>
          </button>
        </div>
      </div>

      {isMediaSelectorOpen && (
        <MediaSelector 
          folderKey="COURSES" 
          onSelect={(id: string, url: string | undefined) => {
            setMediaId(id);
            setMediaUrl(url || null);
            setIsMediaSelectorOpen(false);
          }}
        />
      )}
    </div>
  );
}
