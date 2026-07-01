"use client";

import React, { useState } from "react";
import { Check, Loader2, Image as ImageIcon, X, Trash2, Plus, MoveUp, MoveDown } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { useSiteSettings } from "@/lib/providers/SiteSettingsProvider";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";
import { teachingMethods as defaultTeachingMethods } from "@/data/site";

export default function MeetTeacherAdmin({ initialSectionData }: { initialSectionData: any }) {
  const siteInfo = useSiteSettings();
  const content = initialSectionData?.content || {};

  const [teacherName, setTeacherName] = useState(content.teacherName || siteInfo.teacherName || "");
  const [teacherSpecialty, setTeacherSpecialty] = useState(content.teacherSpecialty || siteInfo.teacherSpecialty || "");
  const [teacherBio, setTeacherBio] = useState(content.teacherBio || siteInfo.teacherBio || "");
  const [teacherTitle, setTeacherTitle] = useState(content.teacherTitle || "Instructor & CEO");
  const [teacherSubtitle, setTeacherSubtitle] = useState(content.teacherSubtitle || "EEE, CUET");
  const [teacherImage, setTeacherImage] = useState(content.teacherImage || "/images/sir_photo_clean.png");
  
  const [teachingMethods, setTeachingMethods] = useState<any[]>(content.teachingMethods || defaultTeachingMethods);

  const [isSaving, setIsSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const handleMethodChange = (index: number, field: string, value: string) => {
    const updated = [...teachingMethods];
    updated[index] = { ...updated[index], [field]: value };
    setTeachingMethods(updated);
  };

  const addMethod = () => {
    setTeachingMethods([...teachingMethods, { title: "New Method", desc: "Description of the teaching method." }]);
  };

  const removeMethod = (index: number) => {
    setTeachingMethods(teachingMethods.filter((_, i) => i !== index));
  };

  const moveMethod = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const updated = [...teachingMethods];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      setTeachingMethods(updated);
    } else if (direction === "down" && index < teachingMethods.length - 1) {
      const updated = [...teachingMethods];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      setTeachingMethods(updated);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_TEACHER", {
        status: "PUBLISHED",
        content: {
          teacherName,
          teacherSpecialty,
          teacherBio,
          teacherTitle,
          teacherSubtitle,
          teacherImage,
          teachingMethods
        }
      });
      toast.success("Meet Teacher section saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save meet teacher section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-lg font-bold">Teacher Profile & Methodology</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the details and teaching methods shown in the Meet Teacher section.</p>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Profile Details</h3>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Teacher Name</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Specialty / Subheading</label>
              <input
                type="text"
                value={teacherSpecialty}
                onChange={(e) => setTeacherSpecialty(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Teacher Title (under photo)</label>
              <input
                type="text"
                value={teacherTitle}
                onChange={(e) => setTeacherTitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Teacher Subtitle (under photo)</label>
              <input
                type="text"
                value={teacherSubtitle}
                onChange={(e) => setTeacherSubtitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Biography</label>
              <textarea
                value={teacherBio}
                onChange={(e) => setTeacherBio(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[120px]"
              />
            </div>
          </div>

          {/* Teacher Photo */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Teacher Portrait</h3>
            
            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50">
              {teacherImage ? (
                <div className="relative w-full aspect-[4/5] max-w-[200px] mb-4 bg-white rounded-lg border border-border overflow-hidden">
                  <Image src={teacherImage} alt="Teacher Photo" fill className="object-contain object-bottom" />
                  <button 
                    onClick={() => setTeacherImage("")}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors z-10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-[4/5] max-w-[200px] mb-4 bg-gray-100 rounded-lg flex items-center justify-center border border-border">
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                </div>
              )}
              
              <button 
                onClick={() => setIsMediaModalOpen(true)}
                className="flex items-center space-x-2 text-sm text-primary font-medium hover:text-accent transition-colors bg-white px-4 py-2 border border-border rounded-lg shadow-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{teacherImage ? "Change Photo" : "Select Photo"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Teaching Methods */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">Teaching Methodology</h3>
        <p className="text-sm text-gray-500 mb-6">These appear as cards next to the teacher photo.</p>
        
        <div className="space-y-4">
          {teachingMethods.map((method, idx) => (
            <div key={idx} className="p-4 border border-border rounded-xl bg-gray-50/50 relative">
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => moveMethod(idx, "up")}
                  disabled={idx === 0}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50"
                >
                  <MoveUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveMethod(idx, "down")}
                  disabled={idx === teachingMethods.length - 1}
                  className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50"
                >
                  <MoveDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeMethod(idx)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pr-24 space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    value={method.title}
                    onChange={(e) => handleMethodChange(idx, "title", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Description</label>
                  <textarea
                    value={method.desc}
                    onChange={(e) => handleMethodChange(idx, "desc", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addMethod}
          className="flex items-center space-x-2 text-sm text-primary font-medium hover:text-accent transition-colors mt-6"
        >
          <Plus className="w-4 h-4" />
          <span>Add Method</span>
        </button>
      </div>

      {/* Media Selector Modal */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Select Teacher Photo</h3>
              <button 
                onClick={() => setIsMediaModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaSelector 
                folderKey="HERO" 
                onSelect={(id: string, url: string | undefined) => {
                  if (url) {
                    setTeacherImage(url);
                    setIsMediaModalOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
