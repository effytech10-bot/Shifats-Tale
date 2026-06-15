"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";
import { Camera, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type CategoryFilter = "All" | "classroom" | "notes" | "events" | "flyers";

export default function GalleryPage() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  // Reset page to 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredItems = galleryItems.filter((item) => {
    if (filter === "All") return true;
    return item.category === filter;
  });

  // Pagination Constants
  const itemsPerPage = 50;
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Clean safe page tracking
  const page = Math.min(currentPage, Math.max(1, totalPages));
  const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const tabs: { label: string; value: CategoryFilter }[] = [
    { label: "Show All", value: "All" },
    { label: "Coaching Flyers", value: "flyers" },
    { label: "Classroom Life", value: "classroom" },
    { label: "Lecture Sheets & Notes", value: "notes" },
    { label: "Events & Awards", value: "events" },
  ];

  // Aspect ratio helper to create organic masonry layout
  const getAspectClass = (index: number) => {
    const aspects = [
      "aspect-[4/3]",   // Landscape
      "aspect-[3/4]",   // Portrait
      "aspect-square",  // Square
      "aspect-[3/2]",   // Wide landscape
      "aspect-[2/3]",   // Tall portrait
    ];
    return aspects[index % aspects.length];
  };

  return (
    <div className="min-h-screen bg-bg-soft text-text flex flex-col selection:bg-accent selection:text-primary relative">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-x-hidden">
        <div className="brand-container flex flex-col items-center">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-4 px-4">
            <p className="text-xs font-bold text-accent tracking-widest uppercase">
              GALLERY
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Explore Life at Shifat's Tales
            </h1>
            <p className="text-text text-xs sm:text-base">
              Explore our classrooms, events, hand-written lecture notes, and success flyers in direct masonry view.
            </p>
          </div>

          {/* Filters Panel (Horizontal scroll for mobile to keep a clean, non-wrapped row) */}
          <div 
            className="flex overflow-x-auto flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-2.5 mb-10 w-full max-w-full px-4 pb-3 scroll-smooth no-scrollbar"
            style={{ 
              scrollbarWidth: "none", 
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch"
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 focus:outline-none shrink-0 ${
                  filter === tab.value
                    ? "bg-accent border-accent text-primary shadow-sm"
                    : "bg-white border-border text-muted hover:text-primary hover:border-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Responsive CSS Columns Masonry Grid (2 columns on mobile, scaling to 5 columns on desktop) */}
          <div className="w-full columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-3 sm:gap-4 space-y-0 px-4 sm:px-0">
            <AnimatePresence mode="popLayout">
              {paginatedItems.map((item, idx) => {
                const aspectClass = getAspectClass(idx);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 15 }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                      mass: 0.9,
                    }}
                    className={`relative rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-md bg-white border border-border break-inside-avoid mb-3 sm:mb-4 ${aspectClass}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Placeholder loading indicator */}
                    <div className="absolute inset-0 bg-bg-soft flex flex-col items-center justify-center p-4 -z-10">
                      <Camera className="h-5 w-5 text-primary/30 mb-1" />
                    </div>

                    {/* Direct image render */}
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 ease-out sm:group-hover:scale-105 pointer-events-none"
                    />

                    {/* Touch & Hover Info Overlay (Always visible on mobile, reveal on hover for desktop) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4.5 pt-8">
                      <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest text-accent mb-0.5">
                        {item.category === "flyers" ? "Coaching Flyer" : item.category}
                      </span>
                      <h4 className="font-extrabold text-white text-[10px] sm:text-sm line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-white scale-90 opacity-0 sm:group-hover:opacity-100 sm:group-hover:scale-100 transition-all duration-300 hidden sm:block">
                        <ZoomIn className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Responsive Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 sm:space-x-2.5 mt-10 sm:mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-primary text-primary bg-white hover:bg-primary hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.01] sm:px-4 sm:py-2.5 sm:text-sm"
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 sm:w-11 sm:h-11 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-sm ${
                    page === p
                      ? "bg-accent text-primary border border-accent hover:scale-[1.02]"
                      : "bg-white border border-border text-muted hover:text-primary hover:border-primary hover:scale-[1.02]"
                  }`}
                >
                  {p}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-primary text-primary bg-white hover:bg-primary hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.01] sm:px-4 sm:py-2.5 sm:text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-border max-w-3xl w-full flex flex-col z-10"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white z-20 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
                aria-label="Close image details"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Image box */}
              <div className="relative w-full aspect-[4/3] sm:aspect-video bg-bg-soft shrink-0 border-b border-border">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Description box */}
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-2.5">
                  <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-accent/10 text-primary border border-accent/25">
                    {selectedItem.category === "flyers" ? "Coaching Flyer" : selectedItem.category}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-primary tracking-tight leading-tight">
                  {selectedItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-text leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
