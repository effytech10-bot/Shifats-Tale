"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { trainingData as defaultData, TrainingItem, SectionHeader } from "@/data/about";
import { IconPicker } from "@/features/website-cms/components/IconPicker";
import { SectionHeaderEditor } from "@/features/website-cms/components/SectionHeaderEditor";

export default function AboutTrainingAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [header, setHeader] = useState<SectionHeader>(
    initialSectionData?.content?.header || {
      badge: "Industry Experience",
      title1: "Industrial",
      title2: "Training",
      description: "My practical experience in the telecommunications and power sector."
    }
  );
  
  const [training, setTraining] = useState<TrainingItem>(
    initialSectionData?.content?.training || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof TrainingItem, value: any) => {
    setTraining({ ...training, [field]: value });
  };

  const addFeature = () => {
    const newFeature = { label: "New Feature", iconName: "CheckCircle2" };
    setTraining({ ...training, features: [...(training.features || []), newFeature] });
  };

  const updateFeature = (index: number, field: "label" | "iconName", value: string) => {
    const newFeatures = [...(training.features || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setTraining({ ...training, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = (training.features || []).filter((_, i) => i !== index);
    setTraining({ ...training, features: newFeatures });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_TRAINING", {
        status: "PUBLISHED",
        content: { header, training },
      });
      toast.success("Industrial Training saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save industrial training");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Industrial Training Banner</h2>
          <p className="text-sm text-gray-500 mt-1">Update your industrial training experience and features.</p>
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
          badge: "Industry Experience",
          title1: "Industrial",
          title2: "Training",
          description: "My practical experience in the telecommunications and power sector."
        }} 
      />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <h3 className="text-base font-bold text-[#08132E] border-b pb-2">Training Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-gray-500">Training Title</label>
            <input
              type="text"
              value={training.title}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500">Organization Name</label>
            <input
              type="text"
              value={training.organization}
              onChange={(e) => updateField('organization', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500">Organization Type (e.g. Government)</label>
            <input
              type="text"
              value={training.organizationType}
              onChange={(e) => updateField('organizationType', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500">Duration (e.g. 10 Days)</label>
            <input
              type="text"
              value={training.duration}
              onChange={(e) => updateField('duration', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500">Status (e.g. Completed)</label>
            <input
              type="text"
              value={training.status}
              onChange={(e) => updateField('status', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-gray-500">Description</label>
            <textarea
              value={training.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold mb-1 text-gray-500">Certificate Link / URL</label>
            <input
              type="text"
              value={training.certificateUrl || ""}
              onChange={(e) => updateField('certificateUrl', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm text-blue-600"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-base font-bold text-[#08132E]">Training Features / Topics</h3>
          <button onClick={addFeature} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Topic</span>
          </button>
        </div>

        <div className="space-y-4">
          {(training.features || []).map((feature, idx) => (
            <div key={idx} className="border border-border p-4 rounded-xl flex items-start gap-4 bg-gray-50/50">
              <div className="cursor-grab active:cursor-grabbing text-gray-400 mt-2">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Topic Label</label>
                  <input
                    type="text"
                    value={feature.label}
                    onChange={(e) => updateFeature(idx, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Icon</label>
                  <IconPicker
                    value={feature.iconName}
                    onChange={(iconName) => updateFeature(idx, 'iconName', iconName)}
                  />
                </div>
              </div>

              <button 
                onClick={() => removeFeature(idx)} 
                className="text-red-400 hover:text-red-600 p-2 mt-2"
                title="Remove Feature"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {(!training.features || training.features.length === 0) && (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No features added yet. Click "+ Add Topic" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
