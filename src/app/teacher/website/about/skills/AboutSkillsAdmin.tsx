"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { skillCategoriesData as defaultData, SkillCategory } from "@/data/about";

export default function AboutSkillsAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [categories, setCategories] = useState<SkillCategory[]>(
    initialSectionData?.content?.skills || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);

  const addCategory = () => {
    const newCategory: SkillCategory = {
      title: "New Category",
      skills: ["Skill 1", "Skill 2"],
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (index: number, field: keyof SkillCategory, value: string) => {
    const updated = [...categories];
    if (field === 'skills') {
      updated[index][field] = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else {
      updated[index][field] = value as string & string[];
    }
    setCategories(updated);
  };

  const removeCategory = (index: number) => {
    const updated = [...categories];
    updated.splice(index, 1);
    setCategories(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const savePromise = updatePageSection("ABOUT", "ABOUT_SKILLS", {
      content: { skills: categories },
      status: "PUBLISHED"
    });

    toast.promise(savePromise, {
      loading: 'Saving technical skills...',
      success: 'Technical skills saved successfully!',
      error: 'Failed to save technical skills',
    });

    try {
      await savePromise;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-accent" />
            Manage Categories
          </h2>
          <p className="text-sm text-gray-500 mt-1">Add or edit skill categories (max 4 recommended for layout)</p>
        </div>
        <button
          onClick={addCategory}
          className="flex items-center px-4 py-2 bg-accent/10 text-accent font-bold rounded-lg hover:bg-accent hover:text-primary transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border-b border-gray-100">
              <div className="flex items-center text-primary font-bold">
                <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
                Category {index + 1}
              </div>
              <button
                onClick={() => removeCategory(index)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1">
              <div>
                <label className="block text-sm font-bold text-primary mb-1">Category Title</label>
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => updateCategory(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
                  placeholder="e.g. Programming Languages"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Skills (comma separated)</label>
                <textarea
                  value={category.skills.join(", ")}
                  onChange={(e) => updateCategory(index, 'skills', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm h-24 resize-none"
                  placeholder="e.g. C, Python, JavaScript"
                />
                <p className="text-xs text-gray-500 mt-1">Separate each skill with a comma.</p>
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
    </div>
  );
}
