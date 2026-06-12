"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { courses } from "@/data/courses";
import { Calendar, Clock, Send, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { siteInfo } from "@/data/site";

export default function CoursesSection() {
  const whatsappNumber = siteInfo.whatsapp;
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(1); // Default to Class 11/12 Academic Batch
  const [windowWidth, setWindowWidth] = useState(1024);
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % courses.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + courses.length) % courses.length);
  };

  const getCardPositionProps = (index: number) => {
    let diff = index - activeIndex;
    
    // Handle wrap-around circular math
    if (diff < -courses.length / 2) {
      diff += courses.length;
    } else if (diff > courses.length / 2) {
      diff -= courses.length;
    }
    return diff;
  };

  // Determine offsets based on screen width
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const getCardStyles = (diff: number) => {
    if (isMobile) {
      if (diff === 0) {
        return {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      }
      if (diff === 1) {
        return {
          x: 12,
          y: 8,
          rotate: 2.5,
          scale: 0.94,
          opacity: 0.4,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      }
      if (diff === -1) {
        return {
          x: -12,
          y: 8,
          rotate: -2.5,
          scale: 0.94,
          opacity: 0.4,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      }
      return {
        x: 0,
        y: 16,
        rotate: 0,
        scale: 0.85,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }

    if (isTablet) {
      if (diff === 0) {
        return {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1.02,
          opacity: 1,
          zIndex: 30,
          pointerEvents: "auto" as const,
        };
      }
      if (diff === 1) {
        return {
          x: 220,
          y: 12,
          rotate: 4,
          scale: 0.92,
          opacity: 0.75,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      }
      if (diff === -1) {
        return {
          x: -220,
          y: 12,
          rotate: -4,
          scale: 0.92,
          opacity: 0.75,
          zIndex: 20,
          pointerEvents: "auto" as const,
        };
      }
      return {
        x: 0,
        y: 24,
        rotate: 0,
        scale: 0.8,
        opacity: 0,
        zIndex: 0,
        pointerEvents: "none" as const,
      };
    }

    // Desktop
    if (diff === 0) {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1.03,
        opacity: 1,
        zIndex: 30,
        pointerEvents: "auto" as const,
      };
    }
    if (diff === 1) {
      return {
        x: 320,
        y: 16,
        rotate: 5,
        scale: 0.92,
        opacity: 0.7,
        zIndex: 20,
        pointerEvents: "auto" as const,
      };
    }
    if (diff === -1) {
      return {
        x: -320,
        y: 16,
        rotate: -5,
        scale: 0.92,
        opacity: 0.7,
        zIndex: 20,
        pointerEvents: "auto" as const,
      };
    }
    if (diff === 2) {
      return {
        x: 600,
        y: 32,
        rotate: 9,
        scale: 0.82,
        opacity: 0.25,
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    }
    if (diff === -2) {
      return {
        x: -600,
        y: 32,
        rotate: -9,
        scale: 0.82,
        opacity: 0.25,
        zIndex: 10,
        pointerEvents: "auto" as const,
      };
    }
    return {
      x: 0,
      y: 40,
      rotate: 0,
      scale: 0.75,
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    };
  };

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="courses" className="brand-section-wrapper bg-bg relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Batches & Programs
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Offered Batches
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.
          </motion.p>
        </div>

        {/* 3D Fanning Deck Stack Carousel Track */}
        <div className="relative w-full min-h-[550px] sm:min-h-[510px] flex items-center justify-center select-none overflow-visible py-4">
          {courses.map((course, index) => {
            const diff = getCardPositionProps(index);
            const style = getCardStyles(diff);
            const isActive = diff === 0;

            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hello Sir, I want to inquire about the batch: ${course.title}. Please provide timing and seat availability.`
            )}`;

            return (
              <motion.div
                key={course.id}
                initial={false}
                animate={{
                  x: style.x,
                  y: style.y,
                  rotate: style.rotate,
                  scale: style.scale,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                  mass: 0.8
                }}
                style={{
                  pointerEvents: style.pointerEvents,
                  position: "absolute",
                  width: "100%",
                  maxWidth: "390px",
                }}
                className="origin-bottom cursor-pointer animate-none"
                onClick={!isActive ? () => setActiveIndex(index) : undefined}
              >
                {/* Chamfered Card Border Wrapper */}
                <div 
                  style={{
                    clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)",
                    backgroundColor: isActive ? "#FBB503" : "#E2E8F0",
                  }}
                  className={`w-full transition-all duration-300 p-[1.5px] ${
                    isActive 
                      ? "shadow-2xl scale-[1.03]" 
                      : "shadow-md opacity-85 hover:opacity-100"
                  }`}
                >
                  {/* Chamfered Card Content */}
                  <div 
                    style={{
                      clipPath: "polygon(0 0, calc(100% - 31.5px) 0, 100% 31.5px, 100% 100%, 0 100%)",
                      backgroundColor: isActive ? "#010E62" : "#FFFFFF",
                    }}
                    className="w-full flex flex-col justify-between p-6 sm:p-7 space-y-5 rounded-none"
                  >
                    {/* Header Row: Flyer Thumbnail & Title/Info */}
                    <div className="flex items-start gap-4">
                      {/* Square Flyer Thumbnail */}
                      <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border-2 ${
                        isActive ? "border-[#FBB503]/40" : "border-border"
                      }`}>
                        <Image 
                          src={course.bannerImage}
                          alt={course.title}
                          fill
                          sizes="96px"
                          className="object-cover"
                          priority={isActive}
                        />
                      </div>

                      {/* Text info and Target Badge */}
                      <div className="flex-grow min-w-0 space-y-1.5">
                        <span className={`inline-block text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
                          isActive 
                            ? 'bg-[#FBB503]/15 text-[#FBB503] border-[#FBB503]/25' 
                            : 'bg-bg-soft text-primary border-border'
                        }`}>
                          {course.target}
                        </span>
                        <div>
                          <h3 className={`text-sm sm:text-base font-extrabold tracking-tight leading-tight line-clamp-2 ${
                            isActive ? '!text-white' : '!text-primary'
                          }`}>
                            {course.title}
                          </h3>
                          <p className={`text-[10px] font-bold italic mt-0.5 truncate ${
                            isActive ? '!text-[#FBB503]' : '!text-muted'
                          }`}>
                            {course.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Course Description */}
                    <p className={`text-xs sm:text-sm leading-relaxed line-clamp-3 ${
                      isActive ? '!text-[#E7E0D2]' : '!text-text'
                    }`}>
                      {course.description}
                    </p>

                    {/* Schedule / Time details */}
                    <div className={`grid grid-cols-2 gap-2 pt-3 text-[11px] font-bold border-t ${
                      isActive ? 'border-white/10 !text-white/90' : 'border-border !text-primary-dark'
                    }`}>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-muted opacity-80 mb-0.5">Schedule</span>
                        <span className="truncate">{course.schedule}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[9px] uppercase tracking-wider text-muted opacity-80 mb-0.5">Duration</span>
                        <span className="truncate">{course.duration}</span>
                      </div>
                    </div>

                    {/* View Details Modal Trigger */}
                    <div className="pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCourse(course);
                        }}
                        className={`w-full flex items-center justify-center space-x-2 text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? "bg-white !text-primary hover:bg-[#FBB503] hover:text-primary-dark shadow-md pointer-events-auto" 
                            : "bg-bg-soft border border-border !text-primary hover:bg-border pointer-events-none"
                        }`}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Outline Square Controls Center-Bottom */}
        <div className="flex justify-center space-x-4 mt-8">
          <button 
            onClick={handlePrev} 
            className="w-12 h-12 border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer rounded-xl bg-white shadow-sm"
            aria-label="Previous batch"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button 
            onClick={handleNext} 
            className="w-12 h-12 border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors cursor-pointer rounded-xl bg-white shadow-sm"
            aria-label="Next batch"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

      </div>

      {/* Flyer Lightbox Popup Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-border max-w-4xl w-full flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white z-20 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Large Flyer Image */}
              <div className="relative w-full h-64 md:w-1/2 md:h-auto min-h-[260px] sm:min-h-[340px] bg-bg-soft shrink-0 border-b md:border-b-0 md:border-r border-border">
                <Image
                  src={selectedCourse.bannerImage}
                  alt={selectedCourse.title}
                  fill
                  className="object-contain md:object-cover"
                  priority
                />
              </div>

              {/* Right Side: Course Details & Action */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow overflow-y-auto space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2.5">
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#FBB503]/10 text-primary border border-[#FBB503]/25">
                      {selectedCourse.target}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight leading-tight">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold italic text-muted mt-0.5">
                      {selectedCourse.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-text leading-relaxed">
                    {selectedCourse.description}
                  </p>

                  {/* Highlights/Features of the Batch */}
                  {selectedCourse.features && selectedCourse.features.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Key Features</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text font-medium">
                        {selectedCourse.features.map((feature: string, fIdx: number) => (
                          <li key={fIdx} className="flex items-center space-x-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#FBB503] shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Schedule Details Box */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-bg-soft border border-border text-xs font-bold text-primary">
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-muted opacity-80 mb-0.5">Weekly Schedule</span>
                      <span>{selectedCourse.schedule}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase tracking-wider text-muted opacity-80 mb-0.5">Duration</span>
                      <span>{selectedCourse.duration}</span>
                    </div>
                  </div>
                </div>

                {/* Send Message to WhatsApp inside the modal */}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `Hello Sir, I want to inquire about the batch: ${selectedCourse.title}. Please provide details and class timings.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full primary-btn flex items-center justify-center space-x-2 text-center py-3.5 text-xs font-bold shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200"
                  >
                    <Send className="h-4 w-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
