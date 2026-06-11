"use client";

import React, { useState } from "react";
import { youtubeClasses, YouTubeClass } from "@/data/youtubeClasses";
import { Play, Clock, Eye, X, ChevronRight } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

export default function YouTubeClassesSection() {
  const [activeVideo, setActiveVideo] = useState<YouTubeClass | null>(null);

  return (
    <section id="youtube-classes" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-950/40">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

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
            Free Classes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Concept Breakdown Lectures
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
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
              className="glass-card rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col group"
            >
              {/* Fake Video Thumbnail Area */}
              <div
                onClick={() => setActiveVideo(v)}
                className="relative w-full aspect-video bg-slate-900 flex items-center justify-center cursor-pointer overflow-hidden border-b border-slate-900"
              >
                {/* Visual texture using gradients */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />

                {/* Subject Name Tag */}
                <span className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                  {v.topic}
                </span>

                {/* Big Red/Amber YouTube Play Button */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-slate-950/90 border border-white/10 flex items-center justify-center transform group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-500 transition-all duration-300 shadow-xl">
                  <Play className="h-6 w-6 fill-current ml-1" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-slate-400 z-10">
                  <span className="flex items-center space-x-1 font-medium bg-slate-950/50 px-2 py-0.5 rounded backdrop-blur-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{v.duration}</span>
                  </span>
                  {v.views && (
                    <span className="flex items-center space-x-1 font-medium bg-slate-950/50 px-2 py-0.5 rounded backdrop-blur-sm">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{v.views}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Video Title Details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <h3
                  onClick={() => setActiveVideo(v)}
                  className="font-bold text-white text-base sm:text-lg hover:text-amber-400 transition-colors cursor-pointer leading-snug"
                >
                  {v.title}
                </h3>
                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => setActiveVideo(v)}
                    className="text-xs font-bold text-amber-450 hover:text-amber-400 flex items-center space-x-1 text-amber-500"
                  >
                    <span>Play Lecture Now</span>
                    <ChevronRight className="h-3.5 w-3.5" />
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
            className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-red-650 hover:bg-red-750 bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-red-600/10 transition-all duration-200"
          >
            <YoutubeIcon className="h-5 w-5" />
            <span>Subscribe to YouTube Channel</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/85 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-900 flex items-center justify-between">
                <div>
                  <span className="text-xs text-amber-500 font-bold uppercase tracking-wider block">
                    {activeVideo.topic}
                  </span>
                  <h4 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                    {activeVideo.title}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* YouTube Embed container */}
              <div className="relative w-full aspect-video bg-black">
                {/* Embed YouTube video with standard iframe */}
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideo.embedId}?autoplay=1`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer CTA */}
              <div className="p-4 bg-slate-900/40 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  Like this class? Inquire about upcoming batches to learn directly with Sir.
                </span>
                <a
                  href={`https://wa.me/8801700000000?text=Hello%20Sir%2C%20I%20just%20watched%20your%20class%20on%20${encodeURIComponent(
                    activeVideo.title
                  )}.%20Please%20let%2520me%20know%20how%20to%20register.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-600 transition-colors text-center"
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
