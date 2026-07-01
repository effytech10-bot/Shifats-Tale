import React from "react";
import { Settings } from "lucide-react";
import { SectionHeader } from "@/data/about";

interface SectionHeaderEditorProps {
  header: SectionHeader;
  onChange: (header: SectionHeader) => void;
  defaultHeader: SectionHeader;
}

export function SectionHeaderEditor({ header, onChange, defaultHeader }: SectionHeaderEditorProps) {
  const currentHeader = { ...defaultHeader, ...header };

  const handleChange = (field: keyof SectionHeader, value: string) => {
    onChange({ ...currentHeader, [field]: value });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
      <div className="flex items-center p-4 bg-gray-50/50 border-b border-gray-100 font-bold text-primary">
        <Settings className="w-4 h-4 text-accent mr-2" />
        Section Header Settings
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Badge Text</label>
          <input
            type="text"
            value={currentHeader.badge}
            onChange={(e) => handleChange("badge", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Title (Part 1 - Dark)</label>
          <input
            type="text"
            value={currentHeader.title1}
            onChange={(e) => handleChange("title1", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-primary mb-1">Title (Part 2 - Accent)</label>
          <input
            type="text"
            value={currentHeader.title2}
            onChange={(e) => handleChange("title2", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-primary mb-1">Description</label>
          <textarea
            value={currentHeader.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm resize-none h-20"
          />
        </div>
      </div>
    </div>
  );
}
