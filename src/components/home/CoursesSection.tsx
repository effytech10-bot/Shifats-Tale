"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { courses } from "@/data/courses";
import { ChevronLeft, ChevronRight, Eye, X, Send } from "lucide-react";
import { motion, useReducedMotion, AnimatePresence, useInView } from "framer-motion";
import { siteInfo } from "@/data/site";
import { getCircularOffset } from "@/lib/circular";

export default function CoursesSection() {
  const whatsappNumber = siteInfo.whatsapp;
  const shouldReduceMotion = useReducedMotion();
  const [windowWidth, setWindowWidth] = useState(1200);

  // Carousel Staging State
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });

  const [activeIndex, setActiveIndex] = useState(1); // Default to Class 11/12 (index 1)
  const [selectedCourse, setSelectedCourse] = useState<typeof courses[0] | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasAnimatedEntrance, setHasAnimatedEntrance] = useState(false);

  // Resize listener
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Responsive Layout Constants (matching gallery layout exactly)
  const cardWidth = isMobile ? 250 : isTablet ? 300 : 350;
  const cardHeight = isMobile ? 330 : isTablet ? 400 : 450;
  const spacingX = isMobile ? 75 : isTablet ? 150 : 230;
  const spacingY = isMobile ? 6 : isTablet ? 12 : 18;
  const rotationFactor = isMobile ? 1.5 : isTablet ? 2.5 : 3.5;
  const scaleFactor = 0.08;
  const maxVisibleOffset = isMobile ? 1 : isTablet ? 2 : 3;

  const N = courses.length;

  const handleNext = () => {
    if (N <= 1) return;
    setActiveIndex((prev) => (prev + 1) % N);
  };

  const handlePrev = () => {
    if (N <= 1) return;
    setActiveIndex((prev) => (prev - 1 + N) % N);
  };

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Drag ending calculation
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  // Entrance Stagger timing normalization
  const isAnimatingEntrance = isInView && !hasAnimatedEntrance;
  useEffect(() => {
    if (isInView && !hasAnimatedEntrance && N > 0) {
      const duration = Math.min(1.6, 0.4 + N * 0.1) * 1000;
      const timer = setTimeout(() => {
        setHasAnimatedEntrance(true);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimatedEntrance, N]);

  // Autoplay Effect
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!isInView) return;
    if (isHovered || isFocused) return;

    const interval = setInterval(() => {
      if (!document.hidden) {
        handleNext();
      }
    }, 4800);

    return () => clearInterval(interval);
  }, [isInView, isHovered, isFocused, activeIndex, N, shouldReduceMotion]);

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

        {/* Cinematic Carousel Staging Area */}
        <div 
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-live="polite"
          className="relative w-full flex flex-col items-center justify-center outline-none select-none"
          style={{ height: `${cardHeight + 40}px` }}
        >
          {/* Card track container with horizontal drag detection */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing overflow-hidden"
          >
            <AnimatePresence initial={false}>
              {courses.map((course, idx) => {
                const offset = getCircularOffset(idx, activeIndex, N);
                const absOffset = Math.abs(offset);
                const isActive = offset === 0;

                // Position calculation overrides for collapsed/intro states
                const isCollapsed = !isInView;
                
                let targetX = isCollapsed ? 0 : offset * spacingX;
                let targetY = isCollapsed ? 0 : Math.pow(absOffset, 1.4) * spacingY;
                let targetScale = isCollapsed ? 0.8 : Math.max(0.72, 1 - absOffset * scaleFactor);
                let targetRotate = isCollapsed ? 0 : offset * rotationFactor;
                let targetZIndex = isCollapsed ? 1 : 100 - absOffset;

                let targetOpacity = 1;
                if (isCollapsed) {
                  targetOpacity = 0;
                } else if (absOffset > maxVisibleOffset) {
                  targetOpacity = 0;
                } else {
                  targetOpacity = 1 - absOffset * 0.15;
                }

                // Apply prefers-reduced-motion optimizations
                if (shouldReduceMotion) {
                  targetRotate = 0;
                  targetScale = isActive ? 1 : 0.92;
                  targetY = 0;
                }

                // Sequence calculation for entrance Stagger delay
                let sequence = 0;
                if (offset > 0) {
                  sequence = offset * 2 - 1;
                } else if (offset < 0) {
                  sequence = Math.abs(offset) * 2;
                }
                const currentDelay = isAnimatingEntrance && !shouldReduceMotion ? sequence * 0.09 : 0;

                return (
                  <motion.div
                    key={course.id}
                    style={{
                      position: "absolute",
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      zIndex: targetZIndex,
                      pointerEvents: targetOpacity > 0 ? "auto" : "none",
                      willChange: "transform, opacity",
                    }}
                    animate={{
                      x: targetX,
                      y: targetY,
                      scale: targetScale,
                      rotate: targetRotate,
                      opacity: targetOpacity,
                    }}
                    transition={{
                      delay: currentDelay,
                      type: "spring",
                      stiffness: shouldReduceMotion ? 200 : 150,
                      damping: shouldReduceMotion ? 25 : 20,
                      mass: 0.8,
                    }}
                    className="brand-card rounded-2xl overflow-hidden relative group bg-white border border-border shadow-md transition-shadow duration-300"
                    onClick={() => {
                      if (!isActive) {
                        setActiveIndex(idx);
                      }
                    }}
                  >
                    {/* Full banner image (visible on side cards, hidden on active center card) */}
                    <div 
                      className={`absolute inset-0 transition-opacity duration-500 z-0 ${
                        isActive ? "opacity-0 pointer-events-none" : "opacity-100"
                      }`}
                    >
                      <Image 
                        src={course.bannerImage}
                        alt={course.title}
                        fill
                        sizes={`${cardWidth}px`}
                        className="object-cover pointer-events-none"
                        priority={absOffset <= 1}
                      />
                      {/* Dark overlay for side cards */}
                      <div className="absolute inset-0 bg-primary/60 group-hover:bg-primary/50 transition-colors duration-300" />
                      
                      {/* Course target and title overlay on side cards for identification */}
                      <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col space-y-1.5 z-10 text-left bg-gradient-to-t from-primary/90 to-transparent">
                        <span className="text-[8px] font-extrabold uppercase tracking-widest text-accent">
                          {course.target}
                        </span>
                        <h4 className="font-extrabold text-white text-sm line-clamp-1">
                          {course.title}
                        </h4>
                      </div>
                    </div>

                    {/* Detail card content (visible on active card, hidden on side cards) */}
                    <div 
                      className={`absolute inset-0 transition-all duration-500 z-10 h-full w-full ${
                        isActive 
                          ? "opacity-100 scale-100 pointer-events-auto" 
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      {/* The chamfered course card content block */}
                      <div 
                        style={{
                          clipPath: "polygon(0 0, calc(100% - 32px) 0, 100% 32px, 100% 100%, 0 100%)",
                          backgroundColor: "#FBB503", // Gold border outline
                          height: "100%",
                        }}
                        className="w-full p-[1.5px]"
                      >
                        <div 
                          style={{
                            clipPath: "polygon(0 0, calc(100% - 31.5px) 0, 100% 31.5px, 100% 100%, 0 100%)",
                            backgroundColor: "#010E62", // Deep Navy background
                            height: "100%",
                          }}
                          className="w-full flex flex-col justify-between p-6 sm:p-7 space-y-4 h-full"
                        >
                          {/* Header Row: Flyer Thumbnail & Title/Info */}
                          <div className="flex items-start gap-4">
                            {/* Square Flyer Thumbnail */}
                            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-white/20">
                              <Image 
                                src={course.bannerImage}
                                alt={course.title}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>

                            {/* Text info and Target Badge */}
                            <div className="flex-grow min-w-0 space-y-1 text-left">
                              <span className="inline-block text-[8px] sm:text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border bg-accent/15 text-accent border-accent/25">
                                {course.target}
                              </span>
                              <h3 className="text-xs sm:text-sm font-extrabold tracking-tight leading-tight line-clamp-2 text-white">
                                {course.title}
                              </h3>
                              <p className="text-[9px] font-bold italic mt-0.5 text-accent truncate">
                                {course.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Course Description */}
                          <p className="text-xs leading-relaxed line-clamp-3 text-[#E7E0D2] flex-grow text-left">
                            {course.description}
                          </p>

                          {/* Schedule / Time details */}
                          <div className="grid grid-cols-2 gap-2 pt-2.5 text-[10px] font-bold border-t border-white/10 text-white/90 text-left">
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider text-muted opacity-80 mb-0.5">Schedule</span>
                              <span className="truncate block">{course.schedule}</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[8px] uppercase tracking-wider text-muted opacity-80 mb-0.5">Duration</span>
                              <span className="truncate block">{course.duration}</span>
                            </div>
                          </div>

                          {/* View Details button */}
                          <div className="pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCourse(course);
                              }}
                              className="w-full flex items-center justify-center space-x-2 text-center py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer bg-white text-primary hover:bg-[#FBB503] hover:text-primary-dark shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Details</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation Arrows Controls */}
        {N > 1 && (
          <div className="flex justify-center items-center space-x-6 mt-8">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Previous batch"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Next batch"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        )}

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
                  <div className="space-y-2.5 text-left">
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

                  <p className="text-xs sm:text-sm text-text leading-relaxed text-left">
                    {selectedCourse.description}
                  </p>

                  {/* Highlights/Features of the Batch */}
                  {selectedCourse.features && selectedCourse.features.length > 0 && (
                    <div className="space-y-2 text-left">
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
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-bg-soft border border-border text-xs font-bold text-primary text-left">
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
