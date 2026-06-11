"use client";

import React, { useState } from "react";
import { galleryItems, GalleryItem } from "@/data/gallery";
import Image from "next/image";
import { Camera, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryFilter = "All" | "classroom" | "notes" | "events";

export default function GallerySection() {
  const [filter, setFilter] = useState<CategoryFilter>("All");

  const filteredItems = galleryItems.filter((item) => {
    if (filter === "All") return true;
    return item.category === filter;
  });

  const tabs: { label: string; value: CategoryFilter }[] = [
    { label: "Show All", value: "All" },
    { label: "Classroom Life", value: "classroom" },
    { label: "Lecture Sheets & Notes", value: "notes" },
    { label: "Events & Awards", value: "events" },
  ];

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-bold text-amber-500 tracking-widest uppercase"
          >
            Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Explore Life at Shifat's Tales
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            A visual overview of our learning facilities, handwritten summary worksheets, and celebrations of student success.
          </motion.p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-300 ${
                filter === tab.value
                  ? "bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/15"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="glass-card rounded-2xl overflow-hidden aspect-square relative group hover:border-slate-700 transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-w-768px) 100vw, 25vw"
                />

                {/* Overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 space-y-2 z-10">
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <Camera className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-normal">
                    {item.description}
                  </p>
                </div>

                {/* Tiny zoom indicator top-right */}
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <ZoomIn className="h-4 w-4 text-slate-350" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
