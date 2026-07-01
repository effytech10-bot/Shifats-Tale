"use client";

import React, { useState, useRef, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { ChevronDown, Search } from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  className?: string;
}

// Popular icons to show in the picker
const POPULAR_ICONS = [
  "Globe", "Activity", "PieChart", "TrendingUp", "Search", "PenTool", "Camera",
  "GraduationCap", "Users", "MapPin", "User", "Mail", "Phone", "BookOpen", "Award",
  "Play", "Monitor", "Briefcase", "Star", "Heart", "ThumbsUp", "Coffee", "Check",
  "ArrowRight", "ChevronRight", "Link", "Image", "Music", "Video", "MessageCircle",
  "Target", "Zap", "Layers", "Layout", "Code", "Database", "Server", "Cloud"
];

export function IconPicker({ value, onChange, className = "" }: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredIcons = POPULAR_ICONS.filter(iconName => 
    iconName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderIcon = (name: string, className = "w-5 h-5") => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) return <LucideIcons.HelpCircle className={className} />;
    return <IconComponent className={className} />;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-border rounded-lg bg-white focus:outline-none focus:border-accent text-sm"
      >
        <div className="flex items-center space-x-2">
          {renderIcon(value, "w-4 h-4 text-primary/70")}
          <span className="font-semibold text-gray-700">{value || "Select Icon"}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 mt-1 bg-white border border-border rounded-lg shadow-xl top-full left-0">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search icon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-border rounded-md focus:outline-none focus:border-accent"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto p-2">
            {filteredIcons.length === 0 ? (
              <div className="text-center py-4 text-sm text-gray-500">No icons found</div>
            ) : (
              <div className="grid grid-cols-5 gap-1">
                {filteredIcons.map((iconName) => (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    title={iconName}
                    className={`p-2 flex justify-center items-center rounded-md hover:bg-gray-100 transition-colors ${
                      value === iconName ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-600 border border-transparent"
                    }`}
                  >
                    {renderIcon(iconName, "w-4 h-4")}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
