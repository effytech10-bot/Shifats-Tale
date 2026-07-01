"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";

export default function GlobalFooterAdmin({ initialSettings }: { initialSettings: any }) {
  const [footerDescription, setFooterDescription] = useState(initialSettings?.footerDescription || "");
  const [footerNotice, setFooterNotice] = useState(initialSettings?.footerNotice || "");
  const [footerCopyright, setFooterCopyright] = useState(initialSettings?.footerCopyright || "");
  const [quickLinks, setQuickLinks] = useState<{label: string, href: string, isPortal?: boolean}[]>(
    initialSettings?.quickLinks || []
  );
  
  const [isSaving, setIsSaving] = useState(false);

  const handleAddLink = () => {
    setQuickLinks([...quickLinks, { label: "", href: "", isPortal: false }]);
  };

  const handleUpdateLink = (index: number, field: string, value: string | boolean) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [field]: value };
    setQuickLinks(updated);
  };

  const handleRemoveLink = (index: number) => {
    const updated = [...quickLinks];
    updated.splice(index, 1);
    setQuickLinks(updated);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Merge with initial settings so we don't clobber the rest of GLOBAL_SETTINGS
      await updatePageSection("GLOBAL", "GLOBAL_SETTINGS", {
        status: "PUBLISHED",
        content: {
          ...initialSettings,
          footerDescription,
          footerNotice,
          footerCopyright,
          quickLinks
        }
      });
      toast.success("Global footer updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update global footer");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-primary">Footer Texts</h2>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="primary-btn flex items-center space-x-2 text-sm px-6 py-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Footer Description (Under Logo)</label>
            <textarea
              value={footerDescription}
              onChange={(e) => setFooterDescription(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
              placeholder="A premium personal coaching ecosystem..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Footer Notice (Above WhatsApp Button)</label>
            <textarea
              value={footerNotice}
              onChange={(e) => setFooterNotice(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
              placeholder="We do not offer automatic online enrollment..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Copyright Text</label>
            <input
              type="text"
              value={footerCopyright}
              onChange={(e) => setFooterCopyright(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="© 2026 Shifat's Tales..."
            />
          </div>
        </div>
      </div>

      {/* Quick Links Manager */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary">Quick Links</h2>
            <p className="text-sm text-gray-500">Manage the links shown in the Footer's Quick Links section.</p>
          </div>
          <button 
            onClick={handleAddLink}
            className="flex items-center space-x-2 text-sm px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Link</span>
          </button>
        </div>

        <div className="space-y-4">
          {quickLinks.map((link, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 items-start sm:items-center">
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleUpdateLink(idx, "label", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent bg-white text-sm"
                  placeholder="e.g. Home"
                />
              </div>
              <div className="flex-1 w-full space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL / Href</label>
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleUpdateLink(idx, "href", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-accent bg-white text-sm"
                  placeholder="e.g. #home or /about"
                />
              </div>
              <div className="flex items-center space-x-2 pt-0 sm:pt-6">
                <input
                  type="checkbox"
                  id={`portal-${idx}`}
                  checked={link.isPortal || false}
                  onChange={(e) => handleUpdateLink(idx, "isPortal", e.target.checked)}
                  className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                />
                <label htmlFor={`portal-${idx}`} className="text-sm text-gray-700 font-medium cursor-pointer">
                  New Page?
                </label>
              </div>
              <div className="pt-0 sm:pt-6">
                <button
                  onClick={() => handleRemoveLink(idx)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {quickLinks.length === 0 && (
            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-xl">
              No quick links added. Click 'Add Link' to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
