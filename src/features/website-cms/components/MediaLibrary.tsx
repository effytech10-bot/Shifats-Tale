"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getMediaAssets } from "../actions/media-actions";
import { Loader2, CheckCircle2 } from "lucide-react";

interface MediaLibraryProps {
  folderKey: any; // AllowedFolder
  onSelect: (mediaId: string, secureUrl: string) => void;
}

export function MediaLibrary({ folderKey, onSelect }: MediaLibraryProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadAssets() {
      try {
        setIsLoading(true);
        // Fetch all media assets globally so users can reuse images across different sections
        const data = await getMediaAssets();
        if (mounted) {
          setAssets(data || []);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || "Failed to load library");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadAssets();

    return () => {
      mounted = false;
    };
  }, [folderKey]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
        <p className="text-sm">Loading media library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 text-center">
        {error}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="p-12 text-center text-muted border-2 border-dashed border-border/60 rounded-xl bg-gray-50/50">
        <p className="text-sm">No uploaded images found in the library.</p>
        <p className="text-xs mt-1">Switch to the Upload tab to add new images.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
        {assets.map((asset) => (
          <div 
            key={asset.id}
            onClick={() => setSelectedId(asset.id)}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
              selectedId === asset.id ? "border-accent ring-4 ring-accent/20" : "border-transparent hover:border-border"
            }`}
          >
            <Image 
              src={asset.secure_url} 
              alt={asset.alt_text || asset.original_filename || "Media asset"} 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {selectedId === asset.id && (
              <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-md z-10">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-border/40">
        <button
          type="button"
          disabled={!selectedId}
          onClick={() => {
            if (selectedId) {
              const selectedAsset = assets.find(a => a.id === selectedId);
              if (selectedAsset) onSelect(selectedAsset.id, selectedAsset.secure_url);
            }
          }}
          className="primary-btn px-6 py-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}
