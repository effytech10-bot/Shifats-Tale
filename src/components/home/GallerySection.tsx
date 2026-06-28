"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getHomepageGalleryPreview, getCategoryLabel } from "@/data/gallery";
import { Camera, ArrowRight, ExternalLink } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";

export default function GallerySection() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });
  const [windowWidth, setWindowWidth] = useState(1200);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Resize listener for responsive spacings
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Display configured preview subset (first 5 records) from shared data adapter
  const displayItems = getHomepageGalleryPreview(5);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidth = isMobile ? 130 : isTablet ? 200 : 280;
  const cardHeight = isMobile ? 180 : isTablet ? 270 : 370;

  const desktopStyles = [
    { x: -340, y: 25,  scale: 0.90, rotate: 6, zIndex: 30 },
    { x: -170, y: -10, scale: 0.85, rotate: 4, zIndex: 10 },
    { x: 0,    y: -20, scale: 1.0,  rotate: 2, zIndex: 40 },
    { x: 170,  y: -8,  scale: 0.88, rotate: 3, zIndex: 20 },
    { x: 340,  y: 35,  scale: 0.82, rotate: 6, zIndex: 10 },
  ];

  const tabletStyles = [
    { x: -200, y: 20,  scale: 0.90, rotate: 5, zIndex: 30 },
    { x: -100, y: -10, scale: 0.85, rotate: 3, zIndex: 10 },
    { x: 0,    y: -15, scale: 1.0,  rotate: 1.5, zIndex: 40 },
    { x: 100,  y: -5,  scale: 0.88, rotate: 2.5, zIndex: 20 },
    { x: 200,  y: 30,  scale: 0.82, rotate: 5, zIndex: 10 },
  ];

  const mobileStyles = [
    { x: -110, y: 15,  scale: 0.85, rotate: 4, zIndex: 30 },
    { x: -55,  y: -5,  scale: 0.80, rotate: 2.5, zIndex: 10 },
    { x: 0,    y: -10, scale: 1.0,  rotate: 1, zIndex: 40 },
    { x: 55,   y: -4,  scale: 0.82, rotate: 2, zIndex: 20 },
    { x: 110,  y: 20,  scale: 0.78, rotate: 4, zIndex: 10 },
  ];

  const activeStyles = isMobile ? mobileStyles : isTablet ? tabletStyles : desktopStyles;
  const containerHeight = isMobile ? cardHeight + 60 : isTablet ? cardHeight + 80 : cardHeight + 100;
  const activeIndex = 2;

  return (
    <section id="gallery" className="brand-section-wrapper bg-bg relative">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container flex flex-col items-center">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <p className="text-xs font-bold text-accent tracking-widest uppercase">
            A JOURNEY THROUGH VISUAL STORIES
          </p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-tight">
            Explore Life at Shifat&apos;s Tales
          </h2>
        </div>

        {/* Static 5-Card Circular Fanned Stage */}
        <div 
          ref={containerRef}
          className="relative w-full flex items-center justify-center overflow-hidden py-4"
          style={{ height: `${containerHeight}px` }}
        >
          {displayItems.map((item, idx) => {
            const style = activeStyles[idx];
            const offset = idx - activeIndex;
            const isActive = offset === 0;
            const isHovered = hoveredIndex === idx;

            const isCollapsed = !isInView;
            
            let targetX = isCollapsed ? 0 : style.x;
            let targetY = isCollapsed ? 0 : style.y;
            let targetScale = isCollapsed ? 0.8 : (isHovered ? style.scale * 1.05 : style.scale);
            let targetRotate = isCollapsed ? 0 : (isHovered ? style.rotate * 0.5 : style.rotate);
            let targetZIndex = isHovered ? 50 : style.zIndex;
            let targetOpacity = isCollapsed ? 0 : 1;

            if (shouldReduceMotion) {
              targetRotate = 0;
              targetScale = isActive ? 1 : 0.92;
              targetY = 0;
            }

            let sequence = 0;
            if (offset > 0) {
              sequence = offset * 2 - 1;
            } else if (offset < 0) {
              sequence = Math.abs(offset) * 2;
            }
            const currentDelay = !shouldReduceMotion ? sequence * 0.1 : 0;

            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: "absolute",
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  zIndex: targetZIndex,
                  willChange: "transform, opacity",
                  transition: "none",
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
                  stiffness: 120,
                  damping: 18,
                  mass: 0.8,
                }}
                className="brand-card rounded-2xl overflow-hidden relative group bg-white border border-border shadow-md"
              >
                {/* Photo Placeholder Glow */}
                <div className="absolute inset-0 bg-bg-soft flex flex-col items-center justify-center p-4">
                  <Camera className="h-7 w-7 text-primary/40 mb-1.5" />
                </div>

                <Image
                  src={item.imageUrl}
                  alt={item.alt || item.title}
                  fill
                  sizes={`${cardWidth}px`}
                  priority={isActive}
                  className="object-cover pointer-events-none"
                />

                {/* Card-Level View Details Action & Overlay (Touch and Hover accessible) */}
                <Link
                  href={`/gallery?category=${item.category}`}
                  className="absolute inset-0 z-20 flex flex-col justify-end p-3 sm:p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
                  aria-label={`View details for ${item.title}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                    <span className="text-[9px] font-extrabold text-accent uppercase tracking-wider block mb-1 line-clamp-1">
                      {item.title}
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[10px] sm:text-xs font-extrabold text-primary bg-accent px-2.5 py-1 rounded-lg w-max shadow-sm hover:scale-105 transition-transform">
                      <span>View Details</span>
                      <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Section-Level CTA: View Full Gallery */}
        <div className="mt-8">
          <Link
            href="/gallery"
            className="primary-btn flex items-center justify-center space-x-2 text-center cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
