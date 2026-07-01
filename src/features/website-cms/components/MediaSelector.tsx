"use client";

import { useState } from "react";
import { MediaUploader } from "./MediaUploader";
import { MediaLibrary } from "./MediaLibrary";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

interface MediaSelectorProps {
  folderKey: any;
  onSelect: (mediaId: string, secureUrl?: string) => void;
}

export function MediaSelector({ folderKey, onSelect }: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");

  return (
    <div className="w-full bg-white border border-border/60 rounded-xl overflow-hidden shadow-sm">
      <div className="flex border-b border-border/40">
        <button
          type="button"
          onClick={() => setActiveTab("upload")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
            activeTab === "upload" 
              ? "bg-accent/10 text-accent border-b-2 border-accent" 
              : "text-muted hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Upload New
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("library")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
            activeTab === "library" 
              ? "bg-accent/10 text-accent border-b-2 border-accent" 
              : "text-muted hover:bg-gray-50 hover:text-primary"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Choose from Library
        </button>
      </div>

      <div className="p-4 bg-gray-50/30">
        {activeTab === "upload" ? (
          <MediaUploader 
            folderKey={folderKey} 
            onUploadSuccess={(mediaId, secureUrl) => onSelect(mediaId, secureUrl)} 
          />
        ) : (
          <MediaLibrary 
            folderKey={folderKey} 
            onSelect={onSelect} 
          />
        )}
      </div>
    </div>
  );
}
