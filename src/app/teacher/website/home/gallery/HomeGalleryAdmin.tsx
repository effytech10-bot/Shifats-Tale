"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { GalleryAlbum } from "@/data/albums";

export default function HomeGalleryAdmin({ 
  allAlbums, 
  initialSectionData 
}: { 
  allAlbums: GalleryAlbum[], 
  initialSectionData: any 
}) {
  const initialSelectedIds = initialSectionData?.content?.selectedAlbumIds || [];
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [eyebrow, setEyebrow] = useState(initialSectionData?.eyebrow || "Our Gallery");
  const [title, setTitle] = useState(initialSectionData?.title || "Captured Moments");
  const [description, setDescription] = useState(initialSectionData?.description || "Explore our curated albums of events, interactive classroom sessions, and premium study materials.");
  const [isSaving, setIsSaving] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("HOME", "HOME_GALLERY", {
        status: "PUBLISHED",
        eyebrow,
        title,
        description,
        content: { selectedAlbumIds: selectedIds }
      });
      toast.success("Home page gallery updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to update home gallery");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Fields Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h2 className="text-lg font-bold mb-4">Section Header</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Eyebrow (Small Top Text)</label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. Our Gallery"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent"
              placeholder="e.g. Captured Moments"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-accent min-h-[100px]"
              placeholder="Short description under the title..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary">Select Albums for Home Page</h2>
            <p className="text-sm text-gray-500">Click on an album to toggle its visibility on the Home page. Usually 4 albums look best.</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allAlbums.map((album) => {
          const isSelected = selectedIds.includes(album.id);
          const image = album.coverImage || "/placeholder.jpg";
          
          return (
            <div 
              key={album.id}
              onClick={() => toggleSelection(album.id)}
              className={`relative rounded-xl border-2 cursor-pointer overflow-hidden transition-all duration-200
                ${isSelected ? 'border-accent shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 z-10 bg-accent text-white p-1 rounded-full shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              )}
              
              <div className="relative h-40 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img src={image} alt={album.title} className="object-cover w-full h-full" />
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-[#08132E] truncate">{album.title}</h3>
                <div className="mt-2 text-[10px] bg-gray-100 px-2 py-1 rounded-full inline-block font-semibold uppercase tracking-wider">
                  {album.category}
                </div>
                <div className="mt-1 text-xs text-gray-500 font-medium">
                  {album.images?.length || 0} photos
                </div>
              </div>
            </div>
          );
        })}
        {allAlbums.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             No albums found. Create albums in the Gallery page first.
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
