"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { educationData as defaultEducationData, EducationItem, SectionHeader } from "@/data/about";
import { SectionHeaderEditor } from "@/features/website-cms/components/SectionHeaderEditor";

export default function AboutEducationAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [header, setHeader] = useState<SectionHeader>(
    initialSectionData?.content?.header || {
      badge: "Academic Journey",
      title1: "Education &",
      title2: "Qualifications",
      description: "My academic background and formal education that shaped my engineering foundation."
    }
  );
  
  const [educationList, setEducationList] = useState<EducationItem[]>(
    initialSectionData?.content?.education || defaultEducationData
  );
  const [isSaving, setIsSaving] = useState(false);

  const addEducation = () => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "New Degree",
      institution: "Institution Name",
      year: "2024",
      gpa: "",
      displayOrder: educationList.length + 1,
    };
    setEducationList([...educationList, newEdu]);
  };

  const updateEducation = (index: number, field: keyof EducationItem, value: any) => {
    const newList = [...educationList];
    newList[index] = { ...newList[index], [field]: value };
    setEducationList(newList);
  };

  const removeEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("ABOUT", "ABOUT_EDUCATION", {
        status: "PUBLISHED",
        content: { header, education: educationList },
      });
      toast.success("Education Timeline saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save Education Timeline");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Education Timeline</h2>
          <p className="text-sm text-gray-500">Manage your academic journey.</p>
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
          badge: "Academic Journey",
          title1: "Education &",
          title2: "Qualifications",
          description: "My academic background and formal education that shaped my engineering foundation."
        }} 
      />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-base font-bold text-[#08132E]">Education List</h3>
          <button onClick={addEducation} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Education</span>
          </button>
        </div>

        <div className="space-y-4">
          {educationList.sort((a, b) => a.displayOrder - b.displayOrder).map((item, idx) => (
            <div key={item.id} className="border border-border p-4 rounded-xl flex items-start gap-4 bg-gray-50/50">
              <div className="cursor-grab active:cursor-grabbing text-gray-400 mt-8">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Degree / Certificate</label>
                  <input
                    type="text"
                    value={item.degree}
                    onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 text-gray-500">Institution</label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => updateEducation(idx, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">GPA (Optional)</label>
                    <input
                      type="text"
                      value={item.gpa || ""}
                      onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => removeEducation(idx)} 
                className="text-red-400 hover:text-red-600 p-2 mt-6"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {educationList.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No education history added yet. Click "+ Add Education" to create one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
