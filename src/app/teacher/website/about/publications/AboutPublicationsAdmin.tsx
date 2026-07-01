"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { publicationsData as defaultData, PublicationItem, SectionHeader } from "@/data/about";
import { SectionHeaderEditor } from "@/features/website-cms/components/SectionHeaderEditor";

export default function AboutPublicationsAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [header, setHeader] = useState<SectionHeader>(
    initialSectionData?.content?.header || {
      badge: "Publications",
      title1: "Research",
      title2: "Publications",
      description: "My published research work, conference papers, and journal articles."
    }
  );
  
  const [publicationsList, setPublicationsList] = useState<PublicationItem[]>(
    initialSectionData?.content?.publications || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);

  const addPublication = () => {
    const newItem: PublicationItem = {
      id: `pub-${Date.now()}`,
      title: "New Publication",
      type: "Journal Article",
      venue: "Journal Name",
      year: "2024",
      summary: "",
      status: "",
      location: "",
      link: "",
      doiLink: "",
      certificateLink: "",
    };
    setPublicationsList([newItem, ...publicationsList]);
  };

  const updatePublication = (index: number, field: keyof PublicationItem, value: any) => {
    const newList = [...publicationsList];
    newList[index] = { ...newList[index], [field]: value };
    setPublicationsList(newList);
  };

  const removePublication = (index: number) => {
    setPublicationsList(publicationsList.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_PUBLICATIONS", {
        status: "PUBLISHED",
        content: { header, publications: publicationsList },
      });
      toast.success("Research Publications saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save publications");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Research Publications</h2>
          <p className="text-sm text-gray-500">Manage your journal articles and conference papers.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <SectionHeaderEditor 
        header={header} 
        onChange={setHeader} 
        defaultHeader={{
          badge: "Publications",
          title1: "Research",
          title2: "Publications",
          description: "My published research work, conference papers, and journal articles."
        }} 
      />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-base font-bold text-[#08132E]">Publications List</h3>
          <button onClick={addPublication} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Publication</span>
          </button>
        </div>

        <div className="space-y-8">
          {publicationsList.map((item, idx) => (
            <div key={item.id} className="border border-border p-6 rounded-xl flex items-start gap-4 bg-gray-50/50">
              <div className="cursor-grab active:cursor-grabbing text-gray-400 mt-2">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Publication Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updatePublication(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Type</label>
                    <select
                      value={item.type}
                      onChange={(e) => updatePublication(idx, 'type', e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm bg-white"
                    >
                      <option value="Journal Article">Journal Article</option>
                      <option value="Conference Paper">Conference Paper</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Venue (Journal / Conference Name)</label>
                    <input
                      type="text"
                      value={item.venue}
                      onChange={(e) => updatePublication(idx, 'venue', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updatePublication(idx, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Status (e.g. Under Review, Published)</label>
                    <input
                      type="text"
                      value={item.status || ""}
                      onChange={(e) => updatePublication(idx, 'status', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Summary</label>
                  <textarea
                    value={item.summary}
                    onChange={(e) => updatePublication(idx, 'summary', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Location (Optional)</label>
                    <input
                      type="text"
                      value={item.location || ""}
                      onChange={(e) => updatePublication(idx, 'location', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Paper Link (Optional)</label>
                    <input
                      type="text"
                      value={item.link || ""}
                      onChange={(e) => updatePublication(idx, 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">DOI Link (Optional)</label>
                    <input
                      type="text"
                      value={item.doiLink || ""}
                      onChange={(e) => updatePublication(idx, 'doiLink', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Certificate Link (Optional)</label>
                    <input
                      type="text"
                      value={item.certificateLink || ""}
                      onChange={(e) => updatePublication(idx, 'certificateLink', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => removePublication(idx)} 
                className="text-red-400 hover:text-red-600 p-2 mt-2"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {publicationsList.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No publications added yet. Click "+ Add Publication" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
