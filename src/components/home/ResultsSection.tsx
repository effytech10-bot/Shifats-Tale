"use client";

import React, { useState, useEffect } from "react";
import { studentResults } from "@/data/results";
import { GraduationCap, School, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type CategoryFilter = "All" | "Engineering" | "University" | "Medical" | "Board";

const StudentSuccessCard = ({ result, isActive }: { result: any; isActive: boolean }) => {
  const initials = result.name 
    ? result.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) 
    : "ST";
  
  return (
    <div className={`w-full h-full rounded-3xl p-6 flex flex-col justify-between bg-[#FFFDF9] border border-[#E7E0D2] transition-all duration-300 shadow-md relative group/card select-none text-left ${
      isActive 
        ? "hover:shadow-[0_15px_35px_rgba(251,181,3,0.18)] hover:border-accent/60" 
        : "opacity-80 border-transparent bg-white/70"
    }`}>
      {/* Background card corner ambient glow */}
      {isActive && (
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#FBB503]/8 rounded-full blur-xl pointer-events-none group-hover/card:bg-[#FBB503]/15 transition-all duration-500" />
      )}
      
      {/* Decorative dot pattern */}
      <svg className="absolute bottom-4 left-4 text-accent/5 w-16 h-12 pointer-events-none" fill="currentColor">
        <pattern id={`card-dots-${result.id}`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" />
        </pattern>
        <rect width="100%" height="100%" fill={`url(#card-dots-${result.id})`} />
      </svg>

      <div className="space-y-4 relative z-10">
        {/* Category Badge & Class Year */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#010E62]/5 text-[#010E62] border border-[#010E62]/10 group-hover/card:bg-primary group-hover/card:text-white group-hover/card:border-primary transition-all duration-300">
            {result.examType}
          </span>
          <span className="text-[10px] font-bold text-muted bg-[#FFF9EA] px-2 py-0.5 rounded border border-[#E7E0D2]">
            Class of {result.year}
          </span>
        </div>

        {/* Student Profile Block */}
        <div className="flex items-center space-x-3.5 pt-3">
          {/* Avatar circle containing initials */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFF9EA] to-[#FFF1D0] border border-[#E7E0D2] flex items-center justify-center text-primary font-extrabold text-lg shadow-sm group-hover/card:scale-105 transition-transform duration-300">
            {initials}
          </div>
          <div className="text-left min-w-0">
            <h4 className="font-extrabold text-primary text-lg leading-snug truncate group-hover/card:text-primary-dark transition-colors">
              {result.name}
            </h4>
            <p className="text-xs text-[#4B5563] flex items-center space-x-1.5 font-bold mt-1">
              <School className="h-3.5 w-3.5 text-accent shrink-0" />
              <span className="truncate">{result.college}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Achieved Result highlight box at bottom */}
      <div className="bg-[#FFFDF9] border border-[#E7E0D2] p-4 rounded-2xl flex items-center space-x-3.5 relative z-10 transition-colors duration-300 group-hover/card:border-accent/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] mt-4">
        {/* Glowing circle for cap icon */}
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover/card:scale-110 transition-transform">
          <GraduationCap className="h-5 w-5 text-primary" />
        </div>
        <div className="text-left min-w-0">
          <span className="block text-[8px] text-muted font-extrabold uppercase tracking-widest leading-none">
            Secured Result
          </span>
          <span className="text-xs sm:text-[13px] font-extrabold text-primary mt-1.5 block leading-tight truncate">
            {result.achievement}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function ResultsSection() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect screen size on mount and resize (hydration-safe)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredResults = studentResults.filter((result) => {
    if (filter === "All") return true;
    return result.examType === filter;
  });

  // Autoplay functionality: shifts index every 3.5 seconds
  useEffect(() => {
    if (isHovered || filteredResults.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [activeIndex, isHovered, filteredResults.length]);

  const handleFilterChange = (val: CategoryFilter) => {
    setFilter(val);
    setActiveIndex(0);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (filteredResults.length === 0 ? 0 : (prev + 1) % filteredResults.length));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (filteredResults.length === 0 ? 0 : (prev - 1 + filteredResults.length) % filteredResults.length));
  };

  const getRelativeIndex = (idx: number, active: number, length: number) => {
    let diff = idx - active;
    if (length <= 2) return diff;
    while (diff < -length / 2) diff += length;
    while (diff > length / 2) diff -= length;
    return diff;
  };

  const filterTabs: { label: string; value: CategoryFilter }[] = [
    { label: "All Success", value: "All" },
    { label: "Engineering", value: "Engineering" },
    { label: "Varsity A Unit", value: "University" },
    { label: "Medical", value: "Medical" },
    { label: "Board GPA 5.00", value: "Board" },
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="results" className="brand-section-wrapper bg-[#FFF9EA] relative overflow-hidden">
      {/* Dotted abstract grid background */}
      <svg className="absolute inset-0 text-[#010E62]/4 w-full h-full pointer-events-none z-0" fill="currentColor">
        <pattern id="results-dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#results-dot-grid)" />
      </svg>

      {/* Radial soft golden glow behind center carousel */}
      <div className="absolute inset-0 m-auto w-96 h-96 bg-[#FBB503]/8 rounded-full blur-[130px] pointer-events-none z-0" />

      <div className="brand-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Hall of Fame
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Our Student Success Stories
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Real results ND/Holy Cross and leading college candidates secured in BUET, medical colleges, and Dhaka University batches.
          </motion.p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange(tab.value)}
              className={`px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                filter === tab.value
                  ? "bg-accent border-accent text-primary shadow-sm"
                  : "bg-white border-[#E7E0D2] text-[#6B7280] hover:text-[#010E62] hover:border-[#010E62]/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3D Coverflow Carousel Container */}
        {filteredResults.length > 0 ? (
          <div className="flex flex-col items-center select-none">
            
            {/* Carousel Track with drag swipe capability */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                const threshold = 55;
                if (info.offset.x < -threshold) {
                  handleNext();
                } else if (info.offset.x > threshold) {
                  handlePrev();
                }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full h-[430px] sm:h-[460px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
              style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
            >
              <AnimatePresence initial={false}>
                {filteredResults.map((result, idx) => {
                  const relativeIndex = getRelativeIndex(idx, activeIndex, filteredResults.length);
                  const absOffset = Math.abs(relativeIndex);

                  // Keep only current, side 1, and side 2 cards visible in the DOM
                  if (absOffset > 2 && filteredResults.length > 4) return null;

                  // 3D positioning parameters based on screen layout
                  let xTranslate = 0;
                  let scale = 1;
                  let rotateY = 0;
                  let zIndex = 10;
                  let opacity = 1;
                  let blur = "blur(0px)";

                  if (relativeIndex === 0) {
                    xTranslate = 0;
                    scale = 1;
                    rotateY = 0;
                    zIndex = 50;
                    opacity = 1;
                    blur = "blur(0px)";
                  } else if (relativeIndex === -1) {
                    xTranslate = isMobile ? -145 : -260;
                    scale = isMobile ? 0.84 : 0.86;
                    rotateY = isMobile ? 22 : 35;
                    zIndex = 40;
                    opacity = 0.75;
                    blur = isMobile ? "blur(0px)" : "blur(1px)";
                  } else if (relativeIndex === 1) {
                    xTranslate = isMobile ? 145 : 260;
                    scale = isMobile ? 0.84 : 0.86;
                    rotateY = isMobile ? -22 : -35;
                    zIndex = 40;
                    opacity = 0.75;
                    blur = isMobile ? "blur(0px)" : "blur(1px)";
                  } else if (relativeIndex === -2) {
                    xTranslate = isMobile ? -245 : -440;
                    scale = isMobile ? 0.7 : 0.72;
                    rotateY = isMobile ? 32 : 45;
                    zIndex = 30;
                    opacity = 0.35;
                    blur = isMobile ? "blur(1px)" : "blur(2.5px)";
                  } else if (relativeIndex === 2) {
                    xTranslate = isMobile ? 245 : 440;
                    scale = isMobile ? 0.7 : 0.72;
                    rotateY = isMobile ? -32 : -45;
                    zIndex = 30;
                    opacity = 0.35;
                    blur = isMobile ? "blur(1px)" : "blur(2.5px)";
                  } else {
                    opacity = 0;
                    zIndex = 0;
                  }

                  return (
                    <motion.div
                      key={result.id}
                      style={{
                        position: "absolute",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        transformOrigin: "center center"
                      }}
                      initial={{ opacity: 0, scale: 0.8, x: 0 }}
                      animate={{ 
                        x: xTranslate,
                        scale: scale,
                        rotateY: rotateY,
                        zIndex: zIndex,
                        opacity: opacity,
                        filter: blur
                      }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 26
                      }}
                      className="w-[280px] sm:w-[320px] h-[370px] sm:h-[410px] shrink-0"
                      onClick={() => {
                        if (relativeIndex !== 0) {
                          setActiveIndex(idx);
                        }
                      }}
                    >
                      <StudentSuccessCard result={result} isActive={relativeIndex === 0} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Navigation Controls Center Panel */}
            <div className="flex flex-col items-center gap-6 mt-6 w-full max-w-xs relative z-20">
              
              {/* Previous / Next Arrow buttons */}
              <div className="flex items-center space-x-6">
                <button
                  onClick={handlePrev}
                  aria-label="Previous Student Success Story"
                  className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white cursor-pointer active:scale-90 hover:scale-105 shadow-sm"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Dots indicator array */}
                <div className="flex items-center space-x-2">
                  {filteredResults.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Select student result story ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIndex === idx 
                          ? "bg-accent w-6" 
                          : "bg-[#E7E0D2] w-2 hover:bg-primary/30"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  aria-label="Next Student Success Story"
                  className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] text-primary flex items-center justify-center transition-all hover:bg-primary hover:text-white cursor-pointer active:scale-90 hover:scale-105 shadow-sm"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Swipe Drag Help CTA */}
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest block select-none">
                Drag cards or click dots to slide
              </span>
            </div>

          </div>
        ) : (
          <div className="text-center p-12 bg-white border border-border rounded-2xl max-w-md mx-auto shadow-sm">
            <GraduationCap className="h-10 w-10 text-muted mx-auto mb-4" />
            <h4 className="font-extrabold text-primary text-base">No achievements found</h4>
            <p className="text-xs text-text mt-2">Try choosing another category tab to view achievements.</p>
          </div>
        )}

      </div>
    </section>
  );
}
