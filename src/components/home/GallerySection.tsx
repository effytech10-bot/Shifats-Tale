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
  const spacingX = isMobile ? 65 : isTablet ? 130 : 180;
  const spacingY = isMobile ? 6 : isTablet ? 12 : 18;
  const rotationFactor = isMobile ? 1.5 : isTablet ? 2.5 : 3.5;
  const scaleFactor = 0.08;

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
            Welcome to My Stories
          </h2>
        </div>

        {/* Static 5-Card Circular Fanned Stage */}
        <div 
          ref={containerRef}
          className="relative w-full flex items-center justify-center overflow-hidden py-4"
          style={{ height: `${cardHeight + 40}px` }}
        >
          {displayItems.map((item, idx) => {
            // Static offsets relative to activeIndex (2)
            const offset = idx - activeIndex; // -2, -1, 0, 1, 2
            const absOffset = Math.abs(offset);
            const isActive = offset === 0;

            const isCollapsed = !isInView;
            
            let targetX = isCollapsed ? 0 : offset * spacingX;
            let targetY = isCollapsed ? 0 : Math.pow(absOffset, 1.4) * spacingY;
            let targetScale = isCollapsed ? 0.8 : Math.max(0.72, 1 - absOffset * scaleFactor);
            let targetRotate = isCollapsed ? 0 : offset * rotationFactor;
            let targetZIndex = 100 - absOffset;
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
