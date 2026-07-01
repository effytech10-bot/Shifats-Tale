"use client";

import React, { useState } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

export default function HomeHeroAdmin({ initialSectionData }: { initialSectionData: any }) {
  const content = initialSectionData?.content || {};
  const [formData, setFormData] = useState({
    tagline: content.tagline || "",
    heroHeadline: content.heroHeadline || "",
    heroDescription: content.heroDescription || "",
    studentCount: content.studentCount || "10,000+",
    boardSuccess: content.boardSuccess || "100%",
    universitySuccess: content.universitySuccess || "5,000+",
    experience: content.experience || "10+",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_HERO", {
        status: "PUBLISHED",
        content: formData
      });
      toast.success("Hero section updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update hero section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Texts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Hero Texts</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Tagline</label>
            <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} placeholder="e.g. Admissions Open for SSC & HSC" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
            <p className="text-xs text-gray-500 mt-1">If left blank, it will fall back to Global Settings.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Main Headline</label>
            <input type="text" name="heroHeadline" value={formData.heroHeadline} onChange={handleChange} placeholder="e.g. Personal Guidance for Better Academic Success" className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
            <p className="text-xs text-gray-500 mt-1">If left blank, it will fall back to Global Settings.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea name="heroDescription" value={formData.heroDescription} onChange={handleChange} placeholder="Learn directly from an experienced teacher..." className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[100px]" />
            <p className="text-xs text-gray-500 mt-1">If left blank, it will fall back to Global Settings.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Hero Stats (Floating Cards)</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Total Students Taught</label>
            <input type="text" name="studentCount" value={formData.studentCount} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Board Success Rate</label>
            <input type="text" name="boardSuccess" value={formData.boardSuccess} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">University Admits</label>
            <input type="text" name="universitySuccess" value={formData.universitySuccess} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Years of Experience</label>
            <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
        </div>
      </div>

      {/* Save Footer */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">Save changes to publish the hero section.</p>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
