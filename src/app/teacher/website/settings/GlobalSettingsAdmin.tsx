"use client";

import React, { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

export default function GlobalSettingsAdmin({ initialSettings }: { initialSettings: any }) {
  const [formData, setFormData] = useState(initialSettings);
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
      await updatePageSection("GLOBAL", "GLOBAL_SETTINGS", {
        status: "PUBLISHED",
        content: formData
      });
      toast.success("Global settings updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update global settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Basic Info</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Coaching Center Name</label>
            <input type="text" name="coachingCenterName" value={formData.coachingCenterName || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Tagline</label>
            <input type="text" name="tagline" value={formData.tagline || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Short Description</label>
            <textarea name="shortDescription" value={formData.shortDescription || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[100px]" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Contact Details</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">WhatsApp (No plus, e.g. 88018...)</label>
            <input type="text" name="whatsapp" value={formData.whatsapp || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Office Hours</label>
            <input type="text" name="officeHours" value={formData.officeHours || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Social Links</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Facebook URL</label>
            <input type="url" name="facebookUrl" value={formData.facebookUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">YouTube URL</label>
            <input type="url" name="youtubeUrl" value={formData.youtubeUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        {/* Teacher Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Teacher Details</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Teacher Name</label>
            <input type="text" name="teacherName" value={formData.teacherName || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Designation</label>
            <input type="text" name="teacherDesignation" value={formData.teacherDesignation || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Experience</label>
            <input type="text" name="teacherExperience" value={formData.teacherExperience || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
        </div>

        {/* Location & Maps */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">Global Location Info (Footer)</h2>
          <div>
            <label className="block text-sm font-semibold mb-1">Office Address</label>
            <input type="text" name="address" value={formData.address || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Nearby Landmark</label>
            <input type="text" name="nearbyLandmark" value={formData.nearbyLandmark || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Google Map Embed URL</label>
            <input type="url" name="googleMapEmbedUrl" value={formData.googleMapEmbedUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Google Map Direction URL</label>
            <input type="url" name="googleMapDirectionUrl" value={formData.googleMapDirectionUrl || ""} onChange={handleChange} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent" />
          </div>
        </div>
      </div>

      {/* Save Footer */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">Save changes to reflect globally across the website.</p>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
}
