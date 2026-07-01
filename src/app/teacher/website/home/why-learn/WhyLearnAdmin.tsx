"use client";

import React, { useState } from "react";
import { Check, Loader2, Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { benefits as defaultBenefits } from "@/data/site";
import { availableStatsIcons, getIconComponent } from "@/components/home/stats-icons";

export default function WhyLearnAdmin({ initialSectionData }: { initialSectionData: any }) {
  const content = initialSectionData?.content || {};
  
  const [introData, setIntroData] = useState({
    eyebrow: content.eyebrow || "OUR METHODOLOGY",
    heading: content.heading || "Why Learn with",
    highlightedText: content.highlightedText || "Shifat Sir?",
    description: content.description || "We go beyond standard classroom setups. Our ecosystem focuses on core conceptual depth, solving techniques, and keeping students highly accountable."
  });

  const defaultTrustItems = [
    { label: "Concept First", iconName: "GraduationCap" },
    { label: "Accountability Always", iconName: "Target" },
    { label: "Student Success", iconName: "Users" },
    { label: "Trust & Transparency", iconName: "ShieldCheck" }
  ];

  const [trustItems, setTrustItems] = useState<any[]>(content.trustItems || defaultTrustItems);
  const [benefits, setBenefits] = useState<any[]>(content.benefits || defaultBenefits);
  const [isSaving, setIsSaving] = useState(false);

  const handleIntroChange = (field: string, value: string) => {
    setIntroData({ ...introData, [field]: value });
  };

  const handleTrustItemChange = (index: number, field: string, value: string) => {
    const updated = [...trustItems];
    updated[index] = { ...updated[index], [field]: value };
    setTrustItems(updated);
  };

  const handleBenefitChange = (index: number, field: string, value: string) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    setBenefits(updatedBenefits);
  };

  const addBenefit = () => {
    setBenefits([...benefits, { title: "New Benefit", description: "Benefit description", iconName: "Star" }]);
  };

  const removeBenefit = (index: number) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
  };

  const moveBenefit = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const updatedBenefits = [...benefits];
      const temp = updatedBenefits[index - 1];
      updatedBenefits[index - 1] = updatedBenefits[index];
      updatedBenefits[index] = temp;
      setBenefits(updatedBenefits);
    } else if (direction === "down" && index < benefits.length - 1) {
      const updatedBenefits = [...benefits];
      const temp = updatedBenefits[index + 1];
      updatedBenefits[index + 1] = updatedBenefits[index];
      updatedBenefits[index] = temp;
      setBenefits(updatedBenefits);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_WHY_CHOOSE", {
        status: "PUBLISHED",
        content: { 
          ...introData,
          trustItems,
          benefits 
        }
      });
      toast.success("Why learn section updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update why learn section");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className="text-lg font-bold">Why Learn Benefits</h2>
          <p className="text-sm text-gray-500 mt-1">Manage the benefits cards shown in the "Why Choose Us" section.</p>
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

      <div className="space-y-8">
        {/* Intro Section */}
        <div className="bg-gray-50/50 p-6 rounded-xl border border-border">
          <h3 className="font-bold text-gray-700 mb-4">Header Introduction</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Eyebrow (Small text)</label>
              <input
                type="text"
                value={introData.eyebrow}
                onChange={(e) => handleIntroChange("eyebrow", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Heading</label>
              <input
                type="text"
                value={introData.heading}
                onChange={(e) => handleIntroChange("heading", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Highlighted Text</label>
              <input
                type="text"
                value={introData.highlightedText}
                onChange={(e) => handleIntroChange("highlightedText", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                value={introData.description}
                onChange={(e) => handleIntroChange("description", e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Trust Bar Section */}
        <div className="bg-gray-50/50 p-6 rounded-xl border border-border">
          <h3 className="font-bold text-gray-700 mb-4">Methodology Trust Bar (Horizontal Bar)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustItems.map((item, idx) => (
              <div key={idx} className="p-4 border border-border rounded-lg bg-white shadow-sm">
                <div className="font-semibold text-sm text-gray-500 mb-3">Item #{idx + 1}</div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Label</label>
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleTrustItemChange(idx, "label", e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Icon</label>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 border border-border flex items-center justify-center text-primary flex-shrink-0">
                        {getIconComponent(item.iconName, "w-4 h-4")}
                      </div>
                      <select
                        value={item.iconName}
                        onChange={(e) => handleTrustItemChange(idx, "iconName", e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-border rounded-lg focus:outline-none focus:border-accent text-sm"
                      >
                        {availableStatsIcons.map((icon) => (
                          <option key={icon} value={icon}>{icon}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Cards Section */}
        <div>
          <h3 className="font-bold text-gray-700 mb-4">Methodology Cards</h3>
          <div className="space-y-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 border border-border rounded-xl bg-gray-50/50 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => moveBenefit(idx, "up")}
                disabled={idx === 0}
                className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50"
              >
                <MoveUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveBenefit(idx, "down")}
                disabled={idx === benefits.length - 1}
                className="p-2 text-gray-500 hover:text-primary hover:bg-white rounded-lg border border-transparent hover:border-border transition-colors disabled:opacity-50"
              >
                <MoveDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => removeBenefit(idx)}
                className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold text-gray-700 mb-4">Benefit #{idx + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={benefit.title}
                  onChange={(e) => handleBenefitChange(idx, "title", e.target.value)}
                  placeholder="e.g. Small Batch Environment"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent font-bold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-1">Icon</label>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-border flex items-center justify-center text-primary flex-shrink-0">
                    {getIconComponent(benefit.iconName, "w-5 h-5")}
                  </div>
                  <select
                    value={benefit.iconName}
                    onChange={(e) => handleBenefitChange(idx, "iconName", e.target.value)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
                  >
                    {availableStatsIcons.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                  value={benefit.description}
                  onChange={(e) => handleBenefitChange(idx, "description", e.target.value)}
                  placeholder="e.g. Intentionally capped intake..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent text-sm min-h-[80px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>

      <button
        onClick={addBenefit}
        className="flex items-center space-x-2 text-sm text-primary font-medium hover:text-accent transition-colors mt-6"
      >
        <Plus className="w-4 h-4" />
        <span>Add Benefit</span>
      </button>
    </div>
  );
}
