"use client";

import React, { useState } from "react";
import { youtubeClasses, YouTubeClass } from "@/data/youtubeClasses";
import { Play, Clock, Eye, X } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { siteInfo } from "@/data/site";

export default function YouTubeClassesSection() {
  const [activeVideo, setActiveVideo] = useState<YouTubeClass | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 25 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section id="youtube-classes" className="brand-section-wrapper bg-bg relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Free Classes
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Concept Breakdown Lectures
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Review Shifat Sir's pedagogy first-hand. Check out some of our most-watched math & physics conceptual explanations.
          </motion.p>
        </div>

        {/* Video Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {youtubeClasses.map((v) => (
            <motion.div
              key={v.id}
              variants={cardVariants}
              className="brand-card rounded-2xl overflow-hidden flex flex-col group bg-white border border-border hover:-translate-y-1 hover:shadow-lg hover:border-accent/40 transition-all duration-300"
            >
              {/* YouTube Thumbnail Placeholder */}
              <div
                onClick={() => setActiveVideo(v)}
                className="relative w-full aspect-video bg-bg flex flex-col items-center justify-center cursor-pointer overflow-hidden border-b border-border p-4"
              >
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Subject Name Tag */}
                <span className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-md bg-white border border-border text-primary text-[10px] font-bold uppercase tracking-wider">
                  {v.topic}
                </span>

                {/* Dark premium overlay that fades in on hover */}
                <div className="absolute inset-0 bg-primary-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center" />

                {/* Big YouTube Play Button with hover scale */}
                <div className="relative z-20 w-16 h-16 rounded-full bg-white border border-border flex items-center justify-center transform group-hover:scale-110 group-hover:bg-accent group-hover:text-primary group-hover:border-accent text-accent transition-all duration-300 shadow-md">
                  <Play className="h-6 w-6 fill-current ml-1" />
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-primary z-20">
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
                <span className="absolute text-[10px] font-bold text-muted bottom-12 uppercase tracking-widest group-hover:text-slate-100 transition-colors z-20">
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
                    className="primary-btn px-4 py-2 rounded-xl text-xs font-bold hover:scale-[1.01] transition-transform"
                  >
                    <span>Watch Class</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* YouTube Channel CTA */}
        <div className="mt-16 text-center">
          <a
            href={siteInfo.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-btn inline-flex items-center justify-center space-x-2 w-full sm:w-auto text-center hover:bg-primary hover:text-white transition-all duration-300"
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
                  className="p-1 rounded-lg text-muted hover:text-primary hover:bg-bg-soft transition-colors cursor-pointer"
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
                <span className="text-text font-medium text-center sm:text-left">
                  Like this class? Inquire about upcoming batches to learn directly with Sir.
                </span>
                <a
                  href={`https://wa.me/${siteInfo.whatsapp}?text=Hello%20Sir%2C%20I%20just%20watched%20your%20class%20on%20${encodeURIComponent(
                    activeVideo.title
                  )}.%20Please%20let%20me%20know%20how%20to%20register.`}
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
