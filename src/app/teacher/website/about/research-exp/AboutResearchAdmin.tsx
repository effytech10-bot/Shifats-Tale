"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { researchExperienceData as defaultData, ResearchExperienceItem } from "@/data/about";
import { IconPicker } from "@/features/website-cms/components/IconPicker";

export default function AboutResearchAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [researchList, setResearchList] = useState<ResearchExperienceItem[]>(
    initialSectionData?.content?.researchData || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);

  const addResearch = () => {
    const newItem: ResearchExperienceItem = {
      id: `res-${Date.now()}`,
      title: "New Research Project",
      type: "Research Project",
      year: "2024",
      supervisor: "",
      coSupervisors: "",
      summary: "",
      focusArea: "",
      techniques: "",
      outcome: "",
      iconName: "FlaskConical",
    };
    setResearchList([...researchList, newItem]);
  };

  const updateResearch = (index: number, field: keyof ResearchExperienceItem, value: any) => {
    const newList = [...researchList];
    newList[index] = { ...newList[index], [field]: value };
    setResearchList(newList);
  };

  const removeResearch = (index: number) => {
    setResearchList(researchList.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_RESEARCH_EXP", {
        status: "PUBLISHED",
        content: { researchData: researchList },
      });
      toast.success("Research Experience saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save Research Experience");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Research Experience</h2>
          <p className="text-sm text-gray-500">Manage your research projects and experiences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-accent text-primary font-bold rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-base font-bold text-[#08132E]">Research Projects</h3>
          <button onClick={addResearch} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Research</span>
          </button>
        </div>

        <div className="space-y-8">
          {researchList.map((item, idx) => (
            <div key={item.id} className="border border-border p-6 rounded-xl flex items-start gap-4 bg-gray-50/50">
              <div className="cursor-grab active:cursor-grabbing text-gray-400 mt-2">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Research Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateResearch(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Type (e.g. Undergraduate Thesis)</label>
                    <input
                      type="text"
                      value={item.type}
                      onChange={(e) => updateResearch(idx, 'type', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateResearch(idx, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Supervisor (Optional)</label>
                    <input
                      type="text"
                      value={item.supervisor || ""}
                      onChange={(e) => updateResearch(idx, 'supervisor', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Co-Supervisors (Optional)</label>
                    <input
                      type="text"
                      value={item.coSupervisors || ""}
                      onChange={(e) => updateResearch(idx, 'coSupervisors', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Summary</label>
                  <textarea
                    value={item.summary}
                    onChange={(e) => updateResearch(idx, 'summary', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Focus Area</label>
                    <input
                      type="text"
                      value={item.focusArea}
                      onChange={(e) => updateResearch(idx, 'focusArea', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Techniques</label>
                    <input
                      type="text"
                      value={item.techniques}
                      onChange={(e) => updateResearch(idx, 'techniques', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Outcome</label>
                    <input
                      type="text"
                      value={item.outcome}
                      onChange={(e) => updateResearch(idx, 'outcome', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                </div>
                
                <div className="w-full sm:w-64 pt-2">
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Icon</label>
                  <IconPicker
                    value={item.iconName}
                    onChange={(iconName) => updateResearch(idx, 'iconName', iconName)}
                  />
                </div>
              </div>

              <button 
                onClick={() => removeResearch(idx)} 
                className="text-red-400 hover:text-red-600 p-2 mt-2"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {researchList.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No research experience added yet. Click "+ Add Research" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
