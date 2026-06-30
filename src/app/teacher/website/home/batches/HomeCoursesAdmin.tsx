"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, GripVertical, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

export default function HomeCoursesAdmin({ 
  allCourses, 
  initialSectionData, 
  sectionId 
}: { 
  allCourses: any[], 
  initialSectionData: any,
  sectionId: string 
}) {
  const initialSelectedIds = initialSectionData?.content?.selectedCourseIds || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [eyebrow, setEyebrow] = useState(initialSectionData?.eyebrow || "BATCHES & PROGRAMS");
  const [title, setTitle] = useState(initialSectionData?.title || "Offered Batches");
  const [description, setDescription] = useState(initialSectionData?.description || "Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.");
  const [isSaving, setIsSaving] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_FEATURED_COURSES", {
        status: "PUBLISHED",
        eyebrow,
        title,
        description,
        content: { selectedCourseIds: selectedIds }
      });
      toast.success("Home page courses updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update home courses");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Fields Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-lg font-bold mb-4">Section Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Eyebrow (Small Top Text)</label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. BATCHES & PROGRAMS"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. Offered Batches"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[100px]"
              placeholder="Short description under the title..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold">Select Courses</h2>
            <p className="text-sm text-gray-500">Click on a course to toggle its visibility on the Home page.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCourses.map((course) => {
          const isSelected = selectedIds.includes(course.id);
          const meta = course.metadata || {};
          const image = course.mediaUrl || meta.fallbackImageUrl || "/placeholder.jpg";
          
          return (
            <div 
              key={course.id} 
              onClick={() => toggleSelection(course.id)}
              className={`relative cursor-pointer border rounded-xl overflow-hidden transition-all duration-200 ${
                isSelected 
                  ? "border-[#010E62] shadow-[0_0_0_2px_#010E62]" 
                  : "border-border hover:border-gray-400 hover:shadow-sm grayscale-[30%] opacity-70"
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-[#010E62] text-white p-1 rounded-full z-10 shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              <div className="relative h-40 w-full bg-gray-100">
                <Image src={image} alt={course.title} fill className="object-cover" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-[#08132E] truncate">{course.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{meta.targetClass}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
