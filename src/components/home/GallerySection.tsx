"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { galleryItems } from "@/data/gallery";
import { Camera } from "lucide-react";
import { motion, useReducedMotion, useInView } from "framer-motion";

export default function GallerySection() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.25 });
  const [windowWidth, setWindowWidth] = useState(1200);

  // Resize listener for responsive spacings
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Display exactly the first 5 images for the landing page static preview
  const displayItems = galleryItems.slice(0, 5);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidth = isMobile ? 220 : isTablet ? 280 : 320;
  const cardHeight = isMobile ? 290 : isTablet ? 370 : 420;

  // Scattered arrangements matching the mockup screenshot
  // zIndex logic: 
  // - Card 1 (wedding) is on top of Card 2 (lake)
  // - Card 3 (middle/guy) is on top of Card 2 and Card 4
  // - Card 4 (couple) is on top of Card 5 (peacock)
  // All cards are tilted clockwise (positive rotation)
  const desktopStyles = [
    { x: -350, y: 30,  scale: 0.90, rotate: 6, zIndex: 30 },
    { x: -190, y: -15, scale: 0.85, rotate: 4, zIndex: 10 },
    { x: 0,    y: -30, scale: 1.0,  rotate: 2, zIndex: 40 },
    { x: 180,  y: -10, scale: 0.88, rotate: 3, zIndex: 20 },
    { x: 340,  y: 50,  scale: 0.82, rotate: 6, zIndex: 10 },
  ];

  const tabletStyles = [
    { x: -270, y: 20,  scale: 0.90, rotate: 5, zIndex: 30 },
    { x: -140, y: -10, scale: 0.85, rotate: 3, zIndex: 10 },
    { x: 0,    y: -20, scale: 1.0,  rotate: 1.5, zIndex: 40 },
    { x: 140,  y: -8,  scale: 0.88, rotate: 2.5, zIndex: 20 },
    { x: 270,  y: 40,  scale: 0.82, rotate: 5, zIndex: 10 },
  ];

  const mobileStyles = [
    { x: -150, y: 15,  scale: 0.85, rotate: 4, zIndex: 30 },
    { x: -75,  y: -5,  scale: 0.80, rotate: 2.5, zIndex: 10 },
    { x: 0,    y: -10, scale: 1.0,  rotate: 1, zIndex: 40 },
    { x: 75,   y: -4,  scale: 0.82, rotate: 2, zIndex: 20 },
    { x: 150,  y: 25,  scale: 0.78, rotate: 4, zIndex: 10 },
  ];

  const activeStyles = isMobile ? mobileStyles : isTablet ? tabletStyles : desktopStyles;
  const containerHeight = isMobile ? cardHeight + 60 : isTablet ? cardHeight + 80 : cardHeight + 100;

  // Active index is fixed at 2 (the middle image)
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
            Explore Life at Shifat's Tales
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
            const offset = idx - activeIndex; // -2, -1, 0, 1, 2
            const isActive = offset === 0;

            const isCollapsed = !isInView;
            
            let targetX = isCollapsed ? 0 : style.x;
            let targetY = isCollapsed ? 0 : style.y;
            let targetScale = isCollapsed ? 0.8 : style.scale;
            let targetRotate = isCollapsed ? 0 : style.rotate;
            let targetZIndex = style.zIndex;
            let targetOpacity = isCollapsed ? 0 : 1;

            if (shouldReduceMotion) {
              targetRotate = 0;
              targetScale = isActive ? 1 : 0.92;
              targetY = 0;
            }

            // Sequence for entrance Stagger delay (fans outward from center)
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
                  alt={item.title}
                  fill
                  sizes={`${cardWidth}px`}
                  priority={isActive}
                  className="object-cover pointer-events-none"
                />

                {/* Subtle dark overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-40" />
              </motion.div>
            );
          })}
        </div>

        {/* View All Stories Button */}
        <div className="mt-8">
          <Link
            href="/gallery"
            className="primary-btn flex items-center justify-center space-x-2 text-center cursor-pointer shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200"
          >
            <span>View All Stories</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
