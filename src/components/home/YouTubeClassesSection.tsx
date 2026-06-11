"use client";

import React, { useState } from "react";
import { youtubeClasses, YouTubeClass } from "@/data/youtubeClasses";
import { Play, Clock, Eye, X } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

export default function YouTubeClassesSection() {
  const [activeVideo, setActiveVideo] = useState<YouTubeClass | null>(null);

  return (
    <section id="youtube-classes" className="brand-section-wrapper bg-bg relative">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

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
            Free Classes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Concept Breakdown Lectures
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
          >
            Review Shifat Sir's pedagogy first-hand. Check out some of our most-watched math & physics conceptual explanations.
          </motion.p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {youtubeClasses.map((v, idx) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="brand-card rounded-2xl overflow-hidden flex flex-col group bg-white border border-border"
            >
              {/* YouTube Thumbnail Placeholder */}
              <div
                onClick={() => setActiveVideo(v)}
                className="relative w-full aspect-video bg-bg flex flex-col items-center justify-center cursor-pointer overflow-hidden border-b border-border p-4"
              >
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Subject Name Tag */}
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-md bg-white border border-border text-primary text-[10px] font-bold uppercase tracking-wider">
                  {v.topic}
                </span>

                {/* Big YouTube Play Button */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center transform group-hover:scale-105 group-hover:bg-accent group-hover:text-primary text-accent transition-all duration-300 shadow-md">
                  <Play className="h-6 w-6 fill-current ml-1" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-primary z-10">
                  <span className="flex items-center space-x-1 font-bold bg-white/95 px-2 py-0.5 rounded border border-border shadow-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{v.duration}</span>
                  </span>
                  {v.views && (
                    <span className="flex items-center space-x-1 font-bold bg-white/95 px-2 py-0.5 rounded border border-border shadow-sm">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{v.views}</span>
                    </span>
                  )}
                </div>

                {/* Center Title overlay */}
                <span className="absolute text-[10px] font-bold text-muted bottom-12 uppercase tracking-widest">
                  YouTube Thumbnail Placeholder
                </span>
              </div>

              {/* Video Title Details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4 bg-white">
                <h3
                  onClick={() => setActiveVideo(v)}
                  className="font-extrabold text-primary text-base sm:text-lg hover:text-accent transition-colors cursor-pointer leading-snug"
                >
                  {v.title}
                </h3>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(v)}
                    className="primary-btn px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    <span>Watch Class</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* YouTube Channel CTA */}
        <div className="mt-16 text-center">
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-btn inline-flex items-center justify-center space-x-2 w-full sm:w-auto text-center"
          >
            <YoutubeIcon className="h-5 w-5" />
            <span>Watch More on YouTube</span>
          </a>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary-dark/85 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white border border-border rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-accent font-bold uppercase tracking-wider block">
                    {activeVideo.topic}
                  </span>
                  <h4 className="font-extrabold text-primary text-sm sm:text-base line-clamp-1">
                    {activeVideo.title}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 rounded-lg text-muted hover:text-primary hover:bg-bg-soft transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* YouTube Embed container */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 bg-bg-soft border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-text font-medium">
                  Like this class? Inquire about upcoming batches to learn directly with Sir.
                </span>
                <a
                  href={`https://wa.me/8801700000000?text=Hello%20Sir%2C%20I%20just%20watched%20your%20class%20on%20${encodeURIComponent(
                    activeVideo.title
                  )}.%20Please%2520let%20me%20know%20how%20to%20register.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-btn w-full sm:w-auto text-center"
                >
                  Ask Sir about Admissions
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
