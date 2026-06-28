"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
  galleryItems,
  GALLERY_CATEGORIES,
  GalleryCategory,
  GalleryItem,
  getCategoryLabel,
  getFeaturedGalleryItems,
  queryGalleryItems,
} from "@/data/gallery";
import { Camera, X, ZoomIn, Search, ArrowUpDown, Sparkles, ChevronLeft, ChevronRight, ExternalLink, Megaphone, Users, FileText, Trophy } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";

import InnerPageHero from "@/components/layout/InnerPageHero";

export default function GalleryPage() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "latest" | "oldest">("default");
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Featured Spotlight Carousel State
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCarouselIdx, setHoveredCarouselIdx] = useState<number | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const isCarouselInView = useInView(carouselContainerRef, { once: true, amount: 0.25 });
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [selectedCategory, searchQuery, sortBy]);

  // Query filtered items dynamically
  const filteredItems = useMemo(() => {
    return queryGalleryItems({
      category: selectedCategory,
      search: searchQuery,
      sort: sortBy,
    });
  }, [selectedCategory, searchQuery, sortBy]);

  // Incremental pagination subset
  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Lightbox navigation index calculation
  const currentIndex = useMemo(() => {
    return visibleItems.findIndex((item) => item.id === selectedItem?.id);
  }, [visibleItems, selectedItem]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < visibleItems.length - 1;

  const handlePrevImage = () => {
    if (hasPrev) setSelectedItem(visibleItems[currentIndex - 1]);
  };

  const handleNextImage = () => {
    if (hasNext) setSelectedItem(visibleItems[currentIndex + 1]);
  };

  // Keyboard accessibility & Scroll Lock for Lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "Escape") {
        setSelectedItem(null);
      } else if (e.key === "ArrowLeft") {
        if (hasPrev) setSelectedItem(visibleItems[currentIndex - 1]);
      } else if (e.key === "ArrowRight") {
        if (hasNext) setSelectedItem(visibleItems[currentIndex + 1]);
      }
    };

    if (selectedItem) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItem, currentIndex, hasPrev, hasNext, visibleItems]);

  const getCategoryIcon = (category: GalleryCategory) => {
    switch (category) {
      case "flyers":
        return <Megaphone className="h-4 w-4 text-primary shrink-0" />;
      case "classroom":
        return <Users className="h-4 w-4 text-primary shrink-0" />;
      case "notes":
        return <FileText className="h-4 w-4 text-primary shrink-0" />;
      case "events":
        return <Trophy className="h-4 w-4 text-primary shrink-0" />;
      default:
        return <Camera className="h-4 w-4 text-primary shrink-0" />;
    }
  };

  // Featured items for Spotlight carousel (all featured items or top 5 items)
  const featuredItems = useMemo(() => {
    const items = getFeaturedGalleryItems();
    return items.length >= 3 ? items : galleryItems.slice(0, 5);
  }, []);

  // Dynamic hero cover image selection priority
  const heroCoverImage = useMemo(() => {
    return getFeaturedGalleryItems()[0]?.imageUrl || galleryItems[0]?.imageUrl || "/images/gallery-classroom.png";
  }, []);

  // Carousel navigation handlers
  const handlePrevSpotlight = () => {
    setCarouselIndex((prev) => (prev === 0 ? featuredItems.length - 1 : prev - 1));
  };

  const handleNextSpotlight = () => {
    setCarouselIndex((prev) => (prev === featuredItems.length - 1 ? 0 : prev + 1));
  };

  // Responsive stage layout geometry for the carousel
  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidth = isMobile ? 140 : isTablet ? 220 : 300;
  const cardHeight = isMobile ? 190 : isTablet ? 280 : 380;
  const stageHeight = isMobile ? cardHeight + 50 : isTablet ? cardHeight + 70 : cardHeight + 90;

  const desktopPositions = [
    { x: -340, y: 25, scale: 0.88, rotate: -6, zIndex: 10 },
    { x: -170, y: -10, scale: 0.94, rotate: -3, zIndex: 20 },
    { x: 0, y: -20, scale: 1.05, rotate: 0, zIndex: 40 },
    { x: 170, y: -10, scale: 0.94, rotate: 3, zIndex: 20 },
    { x: 340, y: 25, scale: 0.88, rotate: 6, zIndex: 10 },
  ];

  const tabletPositions = [
    { x: -200, y: 20, scale: 0.88, rotate: -5, zIndex: 10 },
    { x: -100, y: -10, scale: 0.94, rotate: -2.5, zIndex: 20 },
    { x: 0, y: -15, scale: 1.04, rotate: 0, zIndex: 40 },
    { x: 100, y: -10, scale: 0.94, rotate: 2.5, zIndex: 20 },
    { x: 200, y: 20, scale: 0.88, rotate: 5, zIndex: 10 },
  ];

  const mobilePositions = [
    { x: -110, y: 15, scale: 0.85, rotate: -4, zIndex: 10 },
    { x: -55, y: -5, scale: 0.92, rotate: -2, zIndex: 20 },
    { x: 0, y: -10, scale: 1.03, rotate: 0, zIndex: 40 },
    { x: 55, y: -5, scale: 0.92, rotate: 2, zIndex: 20 },
    { x: 110, y: 15, scale: 0.85, rotate: 4, zIndex: 10 },
  ];

  const activePositions = isMobile ? mobilePositions : isTablet ? tabletPositions : desktopPositions;

  return (
    <div className="pt-24 sm:pt-28 pb-16 sm:pb-24 overflow-x-hidden min-h-screen bg-bg-soft">
      <div className="brand-container flex flex-col items-center">
        
        {/* =========================================================================
            SECTION 1: REUSABLE VARIANT 1 INNER PAGE HERO
            ========================================================================= */}
        <InnerPageHero
          eyebrow="GALLERY & VISUAL STORIES"
          title={
            <>
              <span className="block text-white">Explore Life at</span>
              <span className="block text-accent mt-1">Shifat&apos;s Tales</span>
            </>
          }
          description="A comprehensive visual showcase of interactive classrooms, handwritten lecture notes, student achievements, and academic flyers."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Gallery" }
          ]}
          imageSrc={heroCoverImage}
          imageAlt="Shifat's Tales Gallery Cover"
        />

        {/* =========================================================================
            SECTION 4: FEATURED STORIES INTERACTIVE FANNED STAGE CAROUSEL
            ========================================================================= */}
        {featuredItems.length > 0 && selectedCategory === "All" && !searchQuery && (
          <section className="w-full mb-16 px-4 sm:px-0">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-accent" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">Featured Spotlights Carousel</h2>
              </div>
            </div>

            {/* Fanned 3D Stage Container (Transparent background matching landing page stage) */}
            <div
              ref={carouselContainerRef}
              className="relative w-full flex items-center justify-center overflow-hidden py-4"
              style={{ height: `${stageHeight}px` }}
            >
              {/* Floating Left Navigation Button */}
              <button
                onClick={handlePrevSpotlight}
                className="absolute left-2 sm:left-4 z-50 p-3 rounded-full border border-border/80 bg-white/90 text-primary hover:bg-accent hover:border-accent hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
                aria-label="Previous spotlight"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Floating Right Navigation Button */}
              <button
                onClick={handleNextSpotlight}
                className="absolute right-2 sm:right-4 z-50 p-3 rounded-full border border-border/80 bg-white/90 text-primary hover:bg-accent hover:border-accent hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-sm"
                aria-label="Next spotlight"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {featuredItems.map((item, idx) => {
                const total = featuredItems.length;
                let rawOffset = (idx - carouselIndex) % total;
                if (rawOffset > Math.floor(total / 2)) rawOffset -= total;
                if (rawOffset < -Math.floor(total / 2)) rawOffset += total;

                // Map relative position to geometry (-2, -1, 0, 1, 2)
                const clampedOffset = Math.max(-2, Math.min(2, rawOffset));
                const posIndex = clampedOffset + 2; // Maps to index 0..4 in activePositions
                const pos = activePositions[posIndex];

                const isCenter = clampedOffset === 0;
                const isHovered = hoveredCarouselIdx === idx;
                const isCollapsed = !isCarouselInView;

                let targetX = isCollapsed ? 0 : pos.x;
                let targetY = isCollapsed ? 0 : pos.y;
                let targetScale = isCollapsed ? 0.8 : isHovered ? pos.scale * 1.05 : pos.scale;
                let targetRotate = isCollapsed ? 0 : isHovered ? pos.rotate * 0.5 : pos.rotate;
                let targetZIndex = isHovered ? 60 : isCenter ? 50 : pos.zIndex;
                let targetOpacity = Math.abs(rawOffset) > 2 ? 0 : 1;

                if (shouldReduceMotion) {
                  targetRotate = 0;
                  targetScale = isCenter ? 1.02 : 0.9;
                  targetY = 0;
                }

                return (
                  <motion.div
                    key={`carousel-${item.id}`}
                    onMouseEnter={() => setHoveredCarouselIdx(idx)}
                    onMouseLeave={() => setHoveredCarouselIdx(null)}
                    onClick={() => {
                      if (isCenter) {
                        setSelectedItem(item);
                      } else {
                        setCarouselIndex(idx);
                      }
                    }}
                    style={{
                      position: "absolute",
                      width: `${cardWidth}px`,
                      height: `${cardHeight}px`,
                      zIndex: targetZIndex,
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
                      type: "spring",
                      stiffness: 120,
                      damping: 18,
                      mass: 0.8,
                    }}
                    className={`brand-card rounded-2xl overflow-hidden relative group cursor-pointer border shadow-md bg-white transition-shadow duration-300 ${
                      isCenter ? "border-accent ring-2 ring-accent/30 shadow-2xl" : "border-border"
                    }`}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.alt || item.title}
                      fill
                      sizes={`${cardWidth}px`}
                      priority={isCenter}
                      className="object-cover pointer-events-none"
                    />

                    {/* Pitch Black Gradient Overlay for Maximum Caption Readability & Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 via-40% to-transparent flex flex-col justify-end p-3.5 sm:p-4">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent mb-1 block drop-shadow-sm">
                        {getCategoryLabel(item.category)}
                      </span>
                      <h3 className="font-extrabold !text-white text-sm sm:text-base leading-tight line-clamp-1 font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                        {item.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs !text-white/90 line-clamp-2 mt-1 leading-relaxed font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        {item.description}
                      </p>

                      {isCenter && (
                        <div className="mt-3 inline-flex items-center space-x-1 text-[10px] font-extrabold text-primary bg-accent px-3 py-1 rounded-lg w-max shadow-sm">
                          <span>Zoom View</span>
                          <ZoomIn className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center items-center space-x-2 mt-4">
              {featuredItems.map((_, i) => (
                <button
                  key={`dot-${i}`}
                  onClick={() => setCarouselIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    carouselIndex === i ? "w-8 bg-accent" : "w-2.5 bg-border hover:bg-muted"
                  }`}
                  aria-label={`Go to spotlight slide ${i + 1}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 2 & 3: CATEGORY FILTERS, SEARCH INPUT, & SORTING CONTROLS
            ========================================================================= */}
        <div className="w-full bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-border mb-10 space-y-5 px-4 sm:px-6">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search stories, topics, flyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-border bg-bg-soft/50 text-text placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-primary font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Control */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
              <ArrowUpDown className="h-4 w-4 text-muted shrink-0" />
              <span className="text-xs font-bold text-muted shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort gallery records"
                className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-border bg-white text-primary font-bold focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="latest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Category Pills Filter Bar */}
          <div
            className="flex overflow-x-auto flex-nowrap sm:flex-wrap items-center justify-start gap-2 pt-2 pb-1 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {GALLERY_CATEGORIES.map((tab) => {
              const isActive = selectedCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "bg-accent border-accent text-primary shadow-sm scale-[1.02]"
                      : "bg-white border-border text-muted hover:text-primary hover:border-muted hover:bg-bg/50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION 5: COMPLETE GALLERY MASONRY GRID
            ========================================================================= */}
        {filteredItems.length === 0 ? (
          <div className="w-full text-center py-16 px-4 brand-card rounded-2xl bg-white border border-border my-6">
            <Camera className="h-10 w-10 text-muted/40 mx-auto mb-3" />
            <h3 className="text-lg font-extrabold text-primary">No gallery records match your criteria</h3>
            <p className="text-xs sm:text-sm text-muted mt-1 max-w-md mx-auto">
              Try adjusting your search query or selecting a different category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
                setSortBy("default");
              }}
              className="mt-4 primary-btn px-4 py-2 text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="w-full columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 px-4 sm:px-0">
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, idx) => {
                // Varying aspect ratios for visual masonry dynamic flow
                const aspectRatios = ["aspect-[4/3]", "aspect-[3/4]", "aspect-square", "aspect-[4/3]"];
                const aspectClass = aspectRatios[idx % aspectRatios.length];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="break-inside-avoid brand-card rounded-2xl overflow-hidden group cursor-pointer shadow-md bg-white border border-border/80 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Image Container with Masonry Flow Aspect Ratio */}
                    <div className={`relative w-full ${aspectClass} overflow-hidden bg-bg-soft`}>
                      <Image
                        src={item.imageUrl}
                        alt={item.alt || item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      
                      {/* Pitch Black Gradient Overlay for Maximum Caption Readability & Contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 via-40% to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Integrated Directly-on-Image Caption with High Contrast Pure White Text */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 pointer-events-none transition-transform duration-300 group-hover:-translate-y-0.5">
                        <h4 className="font-extrabold !text-white text-sm sm:text-base leading-snug tracking-tight line-clamp-2 font-display drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          {item.title}
                        </h4>
                        {item.description && (
                          <p className="text-xs !text-white/90 line-clamp-1 mt-1 font-medium leading-normal drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* =========================================================================
            SECTION 6: INCREMENTAL LOAD MORE BEHAVIOR
            ========================================================================= */}
        {visibleCount < filteredItems.length && (
          <div className="mt-12 flex justify-center w-full">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="primary-btn px-6 py-3 text-sm font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <span>Load More Stories ({filteredItems.length - visibleCount} remaining)</span>
            </button>
          </div>
        )}

      </div>

      {/* =========================================================================
          ACCESSIBLE LIGHTBOX ZOOM MODAL (Target Reference Option 3 Matching)
          ========================================================================= */}
      <AnimatePresence>
        {selectedItem && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedItem(null)}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Floating Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 p-3 rounded-full bg-white/90 text-primary hover:bg-accent hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Floating Previous Navigation Button */}
            {hasPrev && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white text-primary hover:bg-accent hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            {/* Floating Next Navigation Button */}
            {hasNext && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 sm:left-auto sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white text-primary hover:bg-accent hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            )}

            {/* Centered Modal Image Only */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center z-20 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 max-h-[85vh] max-w-full">
                {/* Image component for centered lightbox */}
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.alt || selectedItem.title}
                  className="max-h-[85vh] max-w-full w-auto h-auto object-contain rounded-2xl select-none"
                />
              </div>
            </motion.div>

            {/* Keyboard Navigation Hint Bar */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 text-xs font-bold text-white/90 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg pointer-events-none">
              <span>← → Use keys to navigate</span>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
