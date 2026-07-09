"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { updatePageSection } from "@/features/website-cms/actions/content-actions";
import { albumsData as defaultData, GalleryAlbum, AlbumImage } from "@/data/albums";
import { MediaSelector } from "@/features/website-cms/components/MediaSelector";

export default function GalleryAlbumsAdmin({ initialSectionData }: { initialSectionData: any }) {
  const [albumsList, setAlbumsList] = useState<GalleryAlbum[]>(
    initialSectionData?.content?.albums || defaultData
  );
  const [isSaving, setIsSaving] = useState(false);
  const [editingAlbumImageIndex, setEditingAlbumImageIndex] = useState<number | null>(null);
  
  // For selecting images inside an album
  const [editingImageAlbumIndex, setEditingImageAlbumIndex] = useState<{albumIndex: number, imageIndex?: number} | null>(null);

  const addAlbum = () => {
    const newAlbum: GalleryAlbum = {
      id: `album-${Date.now()}`,
      title: "New Album",
      category: "Events",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      description: "",
      coverImage: "",
      images: [],
    };
    setAlbumsList([newAlbum, ...albumsList]);
  };

  const updateAlbum = (index: number, field: keyof GalleryAlbum, value: any) => {
    const newList = [...albumsList];
    newList[index] = { ...newList[index], [field]: value };
    setAlbumsList(newList);
  };

  const removeAlbum = (index: number) => {
    setAlbumsList(albumsList.filter((_, i) => i !== index));
  };

  const addImageToAlbum = (albumIndex: number, url: string) => {
    const album = albumsList[albumIndex];
    const newImage: AlbumImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: url,
      alt: "Gallery Image",
    };
    updateAlbum(albumIndex, "images", [...(album.images || []), newImage]);
  };

  const updateImageInAlbum = (albumIndex: number, imageIndex: number, field: keyof AlbumImage, value: string) => {
    const album = albumsList[albumIndex];
    const newImages = [...(album.images || [])];
    newImages[imageIndex] = { ...newImages[imageIndex], [field]: value };
    updateAlbum(albumIndex, "images", newImages);
  };

  const removeImageFromAlbum = (albumIndex: number, imageIndex: number) => {
    const album = albumsList[albumIndex];
    const newImages = (album.images || []).filter((_, i) => i !== imageIndex);
    updateAlbum(albumIndex, "images", newImages);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updatePageSection("GALLERY", "GALLERY_ALBUMS", {
        status: "PUBLISHED",
        content: { albums: albumsList },
      });
      toast.success("Albums saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to save albums");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary">Albums Settings</h2>
          <p className="text-sm text-gray-500">Add, edit, or remove albums and their images.</p>
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
          <h3 className="text-base font-bold text-[#08132E]">Albums List</h3>
          <button onClick={addAlbum} className="flex items-center space-x-1 text-sm text-primary font-semibold hover:text-accent">
            <Plus className="w-4 h-4" /> <span>Add Album</span>
          </button>
        </div>

        <div className="space-y-6">
          {albumsList.map((item, idx) => (
            <div key={item.id} className="border border-border p-6 rounded-xl flex flex-col sm:flex-row items-start gap-4 bg-gray-50/50">
              <div className="cursor-grab active:cursor-grabbing text-gray-400 mt-2 shrink-0 hidden sm:block">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 w-full space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex justify-between">
                     <h4 className="text-sm font-bold text-primary">Album Information</h4>
                     <button 
                        onClick={() => removeAlbum(idx)} 
                        className="text-red-400 hover:text-red-600 p-1 flex items-center space-x-1 text-xs font-bold"
                      >
                        <Trash2 className="w-4 h-4" /> <span>Delete Album</span>
                      </button>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Album Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateAlbum(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm font-bold text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Category</label>
                    <select
                      value={item.category}
                      onChange={(e) => updateAlbum(idx, 'category', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm bg-white"
                    >
                      <option value="Events">Events</option>
                      <option value="Classroom">Classroom</option>
                      <option value="Awards">Awards</option>
                      <option value="Study Material">Study Material</option>
                      <option value="Farewell">Farewell</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Date Display</label>
                    <input
                      type="text"
                      value={item.date}
                      onChange={(e) => updateAlbum(idx, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                      placeholder="e.g. June 25, 2026 or Ongoing"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-2 text-gray-500">Album Cover Image</label>
                    <div className="flex items-center gap-4">
                      {item.coverImage ? (
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                          <img src={item.coverImage} alt="Album cover" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shrink-0">
                          <ImageIcon className="w-6 h-6 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <button
                          type="button"
                          onClick={() => setEditingAlbumImageIndex(idx)}
                          className="px-4 py-1.5 text-xs font-semibold text-primary hover:text-accent border border-primary/20 bg-white rounded-md transition-colors"
                        >
                          {item.coverImage ? "Change Cover Image" : "Select Cover Image"}
                        </button>
                        <p className="text-[10px] text-gray-400">
                          This is the main image displayed on the gallery grid.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-500">Album Description</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateAlbum(idx, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:border-accent text-sm"
                    />
                  </div>
                </div>

                {/* Images inside Album */}
                <div className="bg-white p-4 rounded-xl border border-[#E7E0D2] shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-primary">Album Images ({item.images?.length || 0})</h4>
                    <button 
                      onClick={() => setEditingImageAlbumIndex({ albumIndex: idx })} 
                      className="text-xs font-bold text-accent hover:underline flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3" /> <span>Add Image</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {(item.images || []).map((img, imgIdx) => (
                      <div key={img.id} className="flex flex-col sm:flex-row items-center gap-4 p-2 border border-border rounded-lg bg-gray-50">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 shrink-0 relative group">
                           <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                           <button 
                             onClick={() => setEditingImageAlbumIndex({ albumIndex: idx, imageIndex: imgIdx })}
                             className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-xs"
                           >
                             Edit
                           </button>
                        </div>
                        <div className="flex-1 w-full">
                           <label className="block text-[10px] font-semibold mb-1 text-gray-500">Alt Text / Caption</label>
                           <input
                             type="text"
                             value={img.alt}
                             onChange={(e) => updateImageInAlbum(idx, imgIdx, "alt", e.target.value)}
                             placeholder="Image description"
                             className="w-full px-2 py-1.5 border border-border rounded-md text-xs"
                           />
                        </div>
                        <button onClick={() => removeImageFromAlbum(idx, imgIdx)} className="text-red-400 p-2 hover:bg-red-50 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {(!item.images || item.images.length === 0) && (
                      <p className="text-xs text-gray-400 py-4 text-center">No images in this album. Click "Add Image" to upload.</p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
          {albumsList.length === 0 && (
            <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              No albums added yet. Click "+ Add Album" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Album Cover Image Selector Modal */}
      {editingAlbumImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-primary">Select Album Cover</h3>
              <button 
                onClick={() => setEditingAlbumImageIndex(null)}
                className="text-gray-500 hover:text-red-500"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaSelector
                folderKey="gallery"
                onSelect={(mediaId, secureUrl) => {
                  updateAlbum(editingAlbumImageIndex, 'coverImage', secureUrl || mediaId);
                  setEditingAlbumImageIndex(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Inner Image Selector Modal */}
      {editingImageAlbumIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-primary">
                {editingImageAlbumIndex.imageIndex !== undefined ? "Change Image" : "Add New Image to Album"}
              </h3>
              <button 
                onClick={() => setEditingImageAlbumIndex(null)}
                className="text-gray-500 hover:text-red-500"
              >
                Close
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <MediaSelector
                folderKey="gallery"
                onSelect={(mediaId, secureUrl) => {
                  const url = secureUrl || mediaId;
                  if (editingImageAlbumIndex.imageIndex !== undefined) {
                    // Update existing image
                    updateImageInAlbum(editingImageAlbumIndex.albumIndex, editingImageAlbumIndex.imageIndex, "url", url);
                  } else {
                    // Add new image
                    addImageToAlbum(editingImageAlbumIndex.albumIndex, url);
                  }
                  setEditingImageAlbumIndex(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
