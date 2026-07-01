"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { ecaData as defaultData, ECAItem, SectionHeader } from "@/data/about";
import { IconPicker } from "@/features/website-cms/components/IconPicker";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";
import { SectionHeaderEditor } from "@/features/website-cms/components/SectionHeaderEditor";

export default function AboutECAAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [header, setHeader] = useState<SectionHeader>(
    initialSectionData?.content?.header || {
      badge: "Beyond Academics",
      title1: "Extra Curricular",
      title2: "Activities",
      description: "Leadership roles, volunteer work, and community involvement."
    }
  );
  
  const [ecaList, setEcaList] = useState<ECAItem[]>(
    initialSectionData?.content?.ecaList || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);
  
  // State for the media selector modal
  const [editingECAImageIndex, setEditingECAImageIndex] = useState<{index: number, field: 'coverImage' | 'attachmentImage'} | null>(null);

  const addECA = () => {
    const newECA: ECAItem = {
      id: `eca-${Date.now()}`,
      role: "New Role",
      organization: "Organization Name",
      iconName: "Activity",
      tag: "NEW BATCH 2026",
      colorTheme: "blue",
      startDate: "Jan 2024",
      endDate: "Present",
      duration: "Ongoing",
      location: "Remote",
      type: "Full-time",
    };
    setEcaList([newECA, ...ecaList]);
  };

  const updateECA = (index: number, field: string, value: any) => {
    const updated = [...ecaList];
    if (field.startsWith('attachment.')) {
      const subField = field.split('.')[1];
      if (!updated[index].attachment) {
        updated[index].attachment = { imageUrl: "", caption: "", description: "" };
      }
      updated[index].attachment = {
        ...updated[index].attachment,
        [subField]: value
      } as any;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEcaList(updated);
  };

  const removeECA = (index: number) => {
    const updated = [...ecaList];
    updated.splice(index, 1);
    setEcaList(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const savePromise = updatePageSection("ABOUT", "ABOUT_ECA", {
      content: { header, ecaList },
      status: "PUBLISHED"
    });

    toast.promise(savePromise, {
      loading: 'Saving ECA details...',
      success: 'ECA details saved successfully!',
      error: 'Failed to save ECA details',
    });

    try {
      await savePromise;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Manage ECA</h2>
          <p className="text-sm text-gray-500 mt-1">Add or edit your Extra Curricular Activities</p>
        </div>
        <button
          onClick={addECA}
          className="flex items-center px-4 py-2 bg-accent/10 text-accent font-bold rounded-lg hover:bg-accent hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add ECA
        </button>
      </div>

      <SectionHeaderEditor 
        header={header} 
        onChange={setHeader} 
        defaultHeader={{
          badge: "Beyond Academics",
          title1: "Extra Curricular",
          title2: "Activities",
          description: "Leadership roles, volunteer work, and community involvement."
        }} 
      />

      <div className="space-y-6">
        {ecaList.map((eca, index) => (
          <div key={eca.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center text-primary font-bold">
                <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
                ECA Details
              </div>
              <button
                onClick={() => removeECA(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Role</label>
                  <input
                    type="text"
                    value={eca.role}
                    onChange={(e) => updateECA(index, 'role', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Organization</label>
                  <input
                    type="text"
                    value={eca.organization}
                    onChange={(e) => updateECA(index, 'organization', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Tag (e.g. BATCH 2026)</label>
                  <input
                    type="text"
                    value={eca.tag || ""}
                    onChange={(e) => updateECA(index, 'tag', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Theme Color</label>
                  <select
                    value={eca.colorTheme || "blue"}
                    onChange={(e) => updateECA(index, 'colorTheme', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  >
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Type (e.g. Full-time)</label>
                  <input
                    type="text"
                    value={eca.type}
                    onChange={(e) => updateECA(index, 'type', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Location</label>
                  <input
                    type="text"
                    value={eca.location}
                    onChange={(e) => updateECA(index, 'location', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
              </div>

              {/* Timeline Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Start Date</label>
                  <input
                    type="text"
                    value={eca.startDate}
                    onChange={(e) => updateECA(index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">End Date</label>
                  <input
                    type="text"
                    value={eca.endDate}
                    onChange={(e) => updateECA(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Duration</label>
                  <input
                    type="text"
                    value={eca.duration}
                    onChange={(e) => updateECA(index, 'duration', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6">
                
                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Cover Image (Background)</label>
                  {eca.coverImage ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={eca.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setEditingECAImageIndex({index, field: 'coverImage'})}
                          className="px-3 py-1.5 bg-white text-primary text-xs font-bold rounded-lg shadow-sm mr-2"
                        >
                          Change
                        </button>
                        <button
                          onClick={() => updateECA(index, 'coverImage', "")}
                          className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingECAImageIndex({index, field: 'coverImage'})}
                      className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-accent hover:border-accent transition-colors bg-gray-50 hover:bg-accent/5"
                    >
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-bold">Select Cover Image</span>
                    </button>
                  )}
                </div>

                {/* Attachment Image */}
                <div>
                  <label className="block text-sm font-bold text-primary mb-2">Attachment (Foreground Image)</label>
                  {eca.attachment?.imageUrl ? (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={eca.attachment.imageUrl} alt="Attachment" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setEditingECAImageIndex({index, field: 'attachmentImage'})}
                          className="px-3 py-1.5 bg-white text-primary text-xs font-bold rounded-lg shadow-sm mr-2"
                        >
                          Change
                        </button>
                        <button
                          onClick={() => updateECA(index, 'attachment.imageUrl', "")}
                          className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingECAImageIndex({index, field: 'attachmentImage'})}
                      className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:text-accent hover:border-accent transition-colors bg-gray-50 hover:bg-accent/5"
                    >
                      <ImageIcon className="w-6 h-6 mb-2" />
                      <span className="text-sm font-bold">Select Attachment Image</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Attachment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Attachment Caption</label>
                  <input
                    type="text"
                    value={eca.attachment?.caption || ""}
                    onChange={(e) => updateECA(index, 'attachment.caption', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary mb-1">Attachment Description</label>
                  <input
                    type="text"
                    value={eca.attachment?.description || ""}
                    onChange={(e) => updateECA(index, 'attachment.description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-bold text-primary mb-3">ECA Icon</label>
                <IconPicker 
                  value={eca.iconName || "Activity"} 
                  onChange={(iconName: string) => updateECA(index, 'iconName', iconName)} 
                />
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="primary-btn px-8 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Media Selector Modal */}
      {editingECAImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-primary">Select Image</h3>
              <button 
                onClick={() => setEditingECAImageIndex(null)}
                className="text-gray-500 hover:text-red-500"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaSelector
                folderKey="about"
                onSelect={(mediaId, secureUrl) => {
                  const urlToSave = secureUrl || mediaId;
                  if (editingECAImageIndex.field === 'coverImage') {
                    updateECA(editingECAImageIndex.index, 'coverImage', urlToSave);
                  } else {
                    updateECA(editingECAImageIndex.index, 'attachment.imageUrl', urlToSave);
                  }
                  setEditingECAImageIndex(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
