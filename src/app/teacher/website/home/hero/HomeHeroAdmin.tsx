"use client";

import React, { useState } from "react";
import { Check, Loader2, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { useSiteSettings } from "@/lib/providers/SiteSettingsProvider";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

export default function HomeHeroAdmin({ initialSectionData }: { initialSectionData: any }) {
  const siteInfo = useSiteSettings();
  const content = initialSectionData?.content || {};

  const [tagline, setTagline] = useState(content.tagline || "");
  const [headline, setHeadline] = useState(content.headline || "");
  const [description, setDescription] = useState(content.description || "");
  
  const [teacherName, setTeacherName] = useState(content.teacherName || "");
  const [teacherTitle, setTeacherTitle] = useState(content.teacherTitle || "");
  const [teacherSubtitle, setTeacherSubtitle] = useState(content.teacherSubtitle || "");
  const [teacherImage, setTeacherImage] = useState(content.teacherImage || "");

  const [isSaving, setIsSaving] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_HERO", {
        status: "PUBLISHED",
        content: {
          tagline,
          headline,
          description,
          teacherName,
          teacherTitle,
          teacherSubtitle,
          teacherImage
        }
      });
      toast.success("Home hero section saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save home hero section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h2 className="text-lg font-bold">Hero Text & Teacher Details</h2>
            <p className="text-sm text-gray-500 mt-1">Manage the hero content at the very top of the home page.</p>
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
          {/* Hero Text */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Hero Text</h3>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Admissions Open for SSC & HSC Batches"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use Global Setting: "{siteInfo.tagline}"</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Personal Guidance for Better Academic Success"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-bold"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use Global Setting: "{siteInfo.heroHeadline}"</p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Learn directly from an experienced teacher..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[120px]"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use Global Setting</p>
            </div>
          </div>

          {/* Teacher Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b pb-2">Teacher Badge & Photo</h3>
            
            <div className="mb-6 flex gap-4 items-start">
              <div className="w-24 h-24 relative rounded-lg border border-border overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center">
                {teacherImage ? (
                  <Image src={teacherImage} alt="Teacher" fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-1">Teacher Portrait</label>
                <p className="text-xs text-gray-500 mb-3">Upload a clean portrait with transparent background if possible. Leave blank for default.</p>
                <button
                  onClick={() => setIsMediaModalOpen(true)}
                  className="px-4 py-2 border border-accent text-accent rounded-lg font-bold hover:bg-accent/5 transition-colors text-sm"
                >
                  {teacherImage ? "Change Photo" : "Select Photo"}
                </button>
                {teacherImage && (
                  <button
                    onClick={() => setTeacherImage("")}
                    className="px-4 py-2 text-red-500 rounded-lg font-bold hover:bg-red-50 transition-colors text-sm ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Teacher Name</label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="e.g. Md. Zia Uddin Azad Sifat"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to use Global Setting: "{siteInfo.teacherName}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Badge Title</label>
                <input
                  type="text"
                  value={teacherTitle}
                  onChange={(e) => setTeacherTitle(e.target.value)}
                  placeholder="e.g. Instructor & CEO"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Badge Subtitle</label>
                <input
                  type="text"
                  value={teacherSubtitle}
                  onChange={(e) => setTeacherSubtitle(e.target.value)}
                  placeholder="e.g. EEE, CUET"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isMediaModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
            <div className="sticky top-0 bg-white border-b border-border/50 p-4 flex justify-between items-center z-10">
              <h3 className="font-bold text-lg">Select Image</h3>
              <button 
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <MediaSelector 
                folderKey="HOME" 
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
