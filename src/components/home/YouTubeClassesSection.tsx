"use client";

import React, { useState } from "react";
import { youtubeClasses, YouTubeClass } from "@/data/youtubeClasses";
import { Play, Clock, Eye, Send, Sparkles } from "lucide-react";
import { YoutubeIcon } from "@/components/ui/Icons";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { siteInfo } from "@/data/site";
import Image from "next/image";

export default function YouTubeClassesSection() {
  const whatsappNumber = siteInfo.whatsapp;
  const shouldReduceMotion = useReducedMotion();
  const [currentVideo, setCurrentVideo] = useState<YouTubeClass>(youtubeClasses[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const handleSelectVideo = (video: YouTubeClass) => {
    setCurrentVideo(video);
    setIsPlaying(false); // Reset player to cover view when changing video
  };

  return (
    <section id="youtube-classes" className="brand-section-wrapper bg-bg relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/3 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Concept Lectures</span>
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Concept Breakdown Theater
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Experience Shifat Sir's pedagogy. Select a lecture from the playlist below to load it directly into the theater screen.
          </motion.p>
        </div>

        {/* Asymmetric Theater Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Left Side: Modern Video Player Showcase Screen (Theater Mode) */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between space-y-6">
            {/* Unified Showcase Player Screen */}
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl bg-black group/player">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  /* Live Embedded Iframe Player */
                  <motion.div
                    key="iframe-player"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${currentVideo.embedId}?autoplay=1`}
                      title={currentVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                ) : (
                  /* Custom Glowing Cover Screen with Play Button */
                  <motion.div
                    key="cover-player"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer select-none group"
                  >
                    {/* Background cover image with overlay blur */}
                    <div className="absolute inset-0 z-0">
                      <Image
                        src={currentVideo.thumbnailUrl}
                        alt={currentVideo.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-103 opacity-80"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/40 to-transparent" />
                    </div>

                    {/* Subject badge on top-left of the player screen */}
                    <span className="absolute top-6 left-6 z-10 px-3 py-1 text-[9px] font-extrabold uppercase tracking-widest bg-accent text-primary border border-accent/20 rounded-md">
                      {currentVideo.subject}
                    </span>

                    {/* Central Neon Gold Glowing Play Button */}
                    <div className="relative z-10 w-20 h-20 rounded-full bg-white/95 border border-border flex items-center justify-center shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:bg-[#FBB503] group-hover:border-[#FBB503] group-hover:text-primary-dark text-[#FBB503] group-hover:shadow-[0_0_30px_rgba(251,181,3,0.4)]">
                      <Play className="h-8 w-8 fill-current ml-1" />
                    </div>

                    {/* Click CTA Indicator */}
                    <span className="absolute bottom-6 text-[10px] font-bold text-white/80 uppercase tracking-widest group-hover:text-accent transition-colors duration-200 z-10">
                      Click Screen to Watch Lecture
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selected Lesson Metadata Panel Below Player */}
            <div className="p-6 rounded-2xl bg-white border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 flex-grow min-w-0">
                <span className="text-[10px] font-extrabold text-accent uppercase tracking-wider block">
                  {currentVideo.topic}
                </span>
                <h3 className="font-extrabold text-primary text-base sm:text-lg md:text-xl leading-tight">
                  {currentVideo.title}
                </h3>
                <div className="flex items-center space-x-4 pt-1 text-xs text-muted font-bold">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-accent shrink-0" />
                    <span>Duration: {currentVideo.duration}</span>
                  </span>
                  {currentVideo.views && (
                    <span className="flex items-center space-x-1 border-l border-border pl-4">
                      <Eye className="h-4 w-4 text-accent shrink-0" />
                      <span>{currentVideo.views}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Inquiry Action specific to the active class */}
              <div className="shrink-0 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello Sir, I watched your free YouTube class: "${currentVideo.title}". Please let me know the admission schedule for this batch.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto primary-btn flex items-center justify-center space-x-2 text-center shadow-md py-3 text-xs"
                >
                  <Send className="h-4 w-4" />
                  <span>Ask Sir about Batch</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Playlist Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between space-y-6">
            <div className="flex flex-col gap-4 flex-grow max-h-[460px] lg:max-h-none overflow-y-auto pr-1">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-muted px-1">
                Playlist Classes
              </h4>
              {youtubeClasses.map((item, idx) => {
                const isActive = item.id === currentVideo.id;
                const indexNum = String(idx + 1).padStart(2, "0");

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectVideo(item)}
                    style={{
                      backgroundColor: isActive ? "#010E62" : "#FFFFFF",
                      borderColor: isActive ? "#FBB503" : undefined,
                    }}
                    className={`w-full flex items-center justify-between gap-4 p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer text-left shadow-sm ${
                      isActive 
                        ? "shadow-md scale-[1.01]" 
                        : "border-border hover:border-accent/40 hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Index & Title Section */}
                    <div className="flex items-center space-x-4 min-w-0 flex-grow">
                      {/* Animated Equalizer Wave on Active, index number on inactive */}
                      {isActive ? (
                        <div className="flex items-end gap-[2px] h-4 w-6 shrink-0 justify-center">
                          <span className="w-[3px] bg-[#FBB503] rounded-full animate-equalizer-bar-1" />
                          <span className="w-[3px] bg-[#FBB503] rounded-full animate-equalizer-bar-2" />
                          <span className="w-[3px] bg-[#FBB503] rounded-full animate-equalizer-bar-3" />
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-[#6B7280] shrink-0 w-6 text-center">
                          {indexNum}
                        </span>
                      )}
                      <div className="min-w-0 space-y-1">
                        <h4 className={`text-xs sm:text-sm font-extrabold truncate leading-snug ${
                          isActive ? "!text-white" : "!text-primary"
                        }`}>
                          {item.title}
                        </h4>
                        <span className={`text-[10px] font-bold block ${
                          isActive ? "!text-[#FBB503]" : "!text-muted"
                        }`}>
                          {item.chapter}
                        </span>
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                      isActive 
                        ? "bg-[#FBB503]/15 text-[#FBB503] border-[#FBB503]/30" 
                        : "bg-bg-soft text-muted border-border"
                    }`}>
                      {item.duration}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom YouTube Channel Subscription banner */}
            <div className="p-5 rounded-2xl bg-bg-soft border border-border text-center space-y-4 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] font-extrabold text-muted uppercase tracking-wider block">
                More free lectures
              </span>
              <p className="text-xs text-text font-semibold leading-relaxed">
                Watch dozens of detailed concept breakdowns, board solutions, and shortcuts on Sir's official channel.
              </p>
              <a
                href={siteInfo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-btn w-full flex items-center justify-center space-x-2 text-center py-3 text-xs"
              >
                <YoutubeIcon className="h-5 w-5" />
                <span>Visit YouTube Channel</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
