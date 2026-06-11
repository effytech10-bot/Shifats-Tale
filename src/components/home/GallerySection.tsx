"use client";

import React, { useState } from "react";
import { galleryItems } from "@/data/gallery";
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
    <section id="gallery" className="brand-section-wrapper bg-bg relative">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Gallery
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Explore Life at Shifat's Tales
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
          >
            A visual overview of our learning facilities, handwritten summary worksheets, and celebrations of student success.
          </motion.p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all duration-300 cursor-pointer ${
                filter === tab.value
                  ? "bg-accent border-accent text-primary shadow-sm"
                  : "bg-white border-border text-muted hover:text-primary hover:border-muted"
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
                className="brand-card rounded-2xl overflow-hidden aspect-square relative group bg-white border border-border transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                  sizes="(max-w-768px) 100vw, 25vw"
                />

                {/* Overlay details - light theme premium look */}
                <div className="absolute inset-x-0 bottom-0 bg-white/95 border-t border-border p-4 translate-y-[calc(100%-46px)] group-hover:translate-y-0 transition-transform duration-300 flex flex-col space-y-1.5 z-10 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent">
                      {item.category}
                    </span>
                    <Camera className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h4 className="font-bold text-primary text-sm line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-muted leading-normal opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75">
                    {item.description}
                  </p>
                </div>

                {/* Tiny zoom indicator top-right */}
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-white/95 border border-border opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                  <ZoomIn className="h-4 w-4 text-primary" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
