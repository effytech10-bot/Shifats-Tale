"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { galleryItems } from "@/data/gallery";
import { Camera, ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import { getCircularOffset } from "@/lib/circular";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type CategoryFilter = "All" | "classroom" | "notes" | "events" | "flyers";

export default function GalleryPage() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const shouldReduceMotion = useReducedMotion();
  const [windowWidth, setWindowWidth] = useState(1200);
  
  // Carousel Staging State
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  
  const [currentItems, setCurrentItems] = useState(galleryItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [hasAnimatedEntrance, setHasAnimatedEntrance] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  // Resize listener
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  // Responsive Layout Constants
  const cardWidth = isMobile ? 250 : isTablet ? 300 : 350;
  const cardHeight = isMobile ? 330 : isTablet ? 400 : 450;
  const spacingX = isMobile ? 75 : isTablet ? 150 : 230;
  const spacingY = isMobile ? 6 : isTablet ? 12 : 18;
  const rotationFactor = isMobile ? 1.5 : isTablet ? 2.5 : 3.5;
  const scaleFactor = 0.08;
  const maxVisibleOffset = isMobile ? 1 : isTablet ? 2 : 3;

  const N = currentItems.length;

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

  // Sync category changes with exit collapse and re-entrance animations
  const prevFilterRef = useRef(filter);
  useEffect(() => {
    if (prevFilterRef.current !== filter) {
      prevFilterRef.current = filter;
      setIsCollapsing(true);
      
      const collapseTimer = setTimeout(() => {
        const newItems = galleryItems.filter((item) => {
          if (filter === "All") return true;
          return item.category === filter;
        });
        setCurrentItems(newItems);
        setActiveIndex(0);
        setIsCollapsing(false);
        setHasAnimatedEntrance(false);
      }, 350);
      return () => clearTimeout(collapseTimer);
    }
  }, [filter]);

  // Entrance Stagger timing normalization
  const isAnimatingEntrance = isInView && !hasAnimatedEntrance && !isCollapsing;
  useEffect(() => {
    if (isInView && !hasAnimatedEntrance && !isCollapsing && currentItems.length > 0) {
      const duration = Math.min(1.6, 0.4 + currentItems.length * 0.1) * 1000;
      const timer = setTimeout(() => {
        setHasAnimatedEntrance(true);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasAnimatedEntrance, isCollapsing, currentItems]);

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

  const tabs: { label: string; value: CategoryFilter }[] = [
    { label: "Show All", value: "All" },
    { label: "Coaching Flyers", value: "flyers" },
    { label: "Classroom Life", value: "classroom" },
    { label: "Lecture Sheets & Notes", value: "notes" },
    { label: "Events & Awards", value: "events" },
  ];

  return (
    <div className="min-h-screen bg-bg-soft text-text flex flex-col selection:bg-accent selection:text-primary relative">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 overflow-x-hidden">
        <div className="brand-container flex flex-col items-center">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <p className="text-xs font-bold text-accent tracking-widest uppercase">
              GALLERY
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
              Explore Life at Shifat's Tales
            </h1>
            <p className="text-text text-sm sm:text-base">
              Explore our classrooms, events, hand-written lecture notes, and board exams success flyers.
            </p>
          </div>

          {/* Filters Panel */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all duration-205 cursor-pointer hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-accent ${
                  filter === tab.value
                    ? "bg-accent border-accent text-primary shadow-sm"
                    : "bg-white border-border text-muted hover:text-primary hover:border-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
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
                {currentItems.map((item, idx) => {
                  const offset = getCircularOffset(idx, activeIndex, N);
                  const absOffset = Math.abs(offset);
                  const isActive = offset === 0;

                  // Position calculation overrides for collapsed/intro states
                  const isCollapsed = isCollapsing || !isInView;
                  
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
                      key={`${item.id}-${filter}`}
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
                        } else {
                          setSelectedItem(item);
                        }
                      }}
                    >
                      {/* Photo Placeholder Background */}
                      <div className="absolute inset-0 bg-bg-soft flex flex-col items-center justify-center p-4">
                        <Camera className="h-7 w-7 text-primary/40 mb-1.5" />
                        <span className="text-[11px] font-extrabold text-primary uppercase tracking-wide">
                          Loading...
                        </span>
                      </div>

                      {/* Image component with visual priority preloading for adjacent elements */}
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes={`${cardWidth}px`}
                        priority={absOffset <= 1}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
                      />

                      {/* Card overlay gradient */}
                      <div 
                        className={`absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent transition-opacity duration-500 ${
                          isActive ? "opacity-75" : "opacity-35 group-hover:opacity-55"
                        }`} 
                      />

                      {/* Metadata Panel: slides up smoothly on active card */}
                      <div
                        className={`absolute inset-x-0 bottom-0 bg-white/95 border-t border-border p-4.5 transition-all duration-500 flex flex-col space-y-1.5 z-10 shadow-lg ${
                          isActive 
                            ? "translate-y-0 opacity-100" 
                            : "translate-y-full opacity-0 pointer-events-none"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-accent">
                            {item.category === "flyers" ? "Coaching Flyer" : item.category}
                          </span>
                          <Camera className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <h4 className="font-bold text-primary text-sm line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-muted leading-normal line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      {/* Active zoom indicator */}
                      {isActive && (
                        <div className="absolute top-4 right-4 p-2 rounded-lg bg-white border border-border opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm">
                          <ZoomIn className="h-4 w-4 text-primary" />
                        </div>
                      )}
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
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-xl border border-primary text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-all duration-300 cursor-pointer bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Full-Screen Lightbox Zoom Modal */}
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
