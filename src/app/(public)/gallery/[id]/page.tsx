"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { albumsData, GalleryAlbum, AlbumImage } from "@/data/albums";
import { Calendar, X, ChevronLeft, ChevronRight, ZoomIn, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InnerPageHero from "@/components/layout/InnerPageHero";

export default function AlbumDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [selectedItem, setSelectedItem] = useState<AlbumImage | null>(null);

  useEffect(() => {
    const found = albumsData.find((a) => a.id === id);
    if (found) {
      setAlbum(found);
    }
  }, [id]);

  // Lightbox navigation
  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem || !album) return;
    const currentIndex = album.images.findIndex(i => i.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % album.images.length;
    setSelectedItem(album.images[nextIndex]);
  };

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem || !album) return;
    const currentIndex = album.images.findIndex(i => i.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;
    setSelectedItem(album.images[prevIndex]);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem || !album) return;
      if (e.key === "ArrowRight") {
        const currentIndex = album.images.findIndex(i => i.id === selectedItem.id);
        const nextIndex = (currentIndex + 1) % album.images.length;
        setSelectedItem(album.images[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        const currentIndex = album.images.findIndex(i => i.id === selectedItem.id);
        const prevIndex = (currentIndex - 1 + album.images.length) % album.images.length;
        setSelectedItem(album.images[prevIndex]);
      } else if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, album]);

  if (!album) {
    return (
      <div className="bg-[#FFFCF2] min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#010E62]">Album not found</h2>
          <Link href="/gallery" className="text-[#FBB503] font-medium mt-4 inline-block hover:underline">
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
    { label: album.title },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] pt-24 pb-20 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-full h-[400px]">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full">
           <path d="M0,200 C300,100 700,300 1000,200" fill="none" stroke="#FBB503" strokeWidth="2"/>
           <path d="M0,220 C300,120 700,320 1000,220" fill="none" stroke="#FBB503" strokeWidth="1"/>
        </svg>
      </div>

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <InnerPageHero
          eyebrow={album.category}
          title={
            <>
              <span className="block text-white">Album:</span>
              <span className="block text-accent mt-1">{album.title}</span>
            </>
          }
          description={album.description}
          breadcrumbs={breadcrumbs}
          imageSrc={album.coverImage}
        />

      <div className="mt-4 sm:mt-12">
        
        {/* Back to Albums button */}
        <div className="mb-8">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-[#4A5568] hover:text-[#010E62] transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
        </div>
        
        {/* Album Header Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 mb-10 shadow-sm border border-[#E8DDBF]/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBB503]/10 border border-[#FBB503]/20 text-[#010E62] text-xs font-bold uppercase tracking-wider mb-4">
              {album.category}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#010E62] tracking-tight mb-3">
              {album.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#4A5568] font-medium">
              <Calendar className="w-4 h-4 text-[#FBB503]" />
              {album.date}
            </div>
          </div>
          <div className="md:text-right md:max-w-md border-t md:border-t-0 md:border-l border-[#E8DDBF]/50 pt-4 md:pt-0 md:pl-6">
            <p className="text-[#4A5568] leading-relaxed text-[15px]">
              {album.description}
            </p>
            <div className="mt-4 font-bold text-[#010E62] text-sm">
              {album.images.length} Photos in this Album
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {album.images.map((img, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={img.id}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-white"
              onClick={() => setSelectedItem(img)}
            >
              <Image
                src={img.url}
                alt={img.alt}
                width={600}
                height={800}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                unoptimized
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#010E62]/90 via-[#010E62]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-extrabold text-sm leading-snug mb-1">
                    {img.alt}
                  </h3>
                </div>
                
                {/* Zoom Icon indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 border border-white/20">
                  <ZoomIn className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#010E62]/95 backdrop-blur-xl p-4 sm:p-6"
            onClick={() => setSelectedItem(null)}
          >
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
              <button
                onClick={() => setSelectedItem(null)}
                className="p-3 bg-white/10 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-md border border-white/20 shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {album.images.length > 1 && (
              <>
                <button
                  onClick={handleLightboxPrev}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-[#FBB503] hover:text-[#010E62] rounded-full text-white transition-all backdrop-blur-md border border-white/20 z-50 hidden sm:flex shadow-lg"
                >
                  <ChevronLeft className="w-8 h-8" strokeWidth={3} />
                </button>
                <button
                  onClick={handleLightboxNext}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-[#FBB503] hover:text-[#010E62] rounded-full text-white transition-all backdrop-blur-md border border-white/20 z-50 hidden sm:flex shadow-lg"
                >
                  <ChevronRight className="w-8 h-8" strokeWidth={3} />
                </button>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-black/50 shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[75vh] flex items-center justify-center">
                <Image
                  src={selectedItem.url}
                  alt={selectedItem.alt}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="w-full bg-white/10 backdrop-blur-md p-4 text-center border-t border-white/10">
                <p className="text-white font-medium">{selectedItem.alt}</p>
                <p className="text-white/60 text-sm mt-1">
                  {album.images.findIndex(i => i.id === selectedItem.id) + 1} / {album.images.length}
                </p>
              </div>
            </motion.div>
            
            {/* Mobile Navigation Controls */}
            {album.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 sm:hidden bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
                <button onClick={handleLightboxPrev} className="text-white p-2">
                  <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                </button>
                <div className="text-white text-sm font-bold">
                  {album.images.findIndex(i => i.id === selectedItem.id) + 1} / {album.images.length}
                </div>
                <button onClick={handleLightboxNext} className="text-white p-2">
                  <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}