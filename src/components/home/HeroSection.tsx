"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Play, User } from "lucide-react";
import { useSiteSettings } from "@/lib/providers/SiteSettingsProvider";

// Dynamically import the 3D scene with SSR disabled for optimal bundle performance
const HeroScene = dynamic(() => import("../three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

interface HeroSectionProps {
  heroData?: any;
  isTeacherFlying?: boolean;
  onImageClick?: (e: React.MouseEvent) => void;
}

export default function HeroSection({ heroData, isTeacherFlying = false, onImageClick }: HeroSectionProps) {
  const siteInfo = useSiteSettings();
  const content = heroData?.content || {};

  const tagline = content.tagline || siteInfo.tagline;
  const headline = content.headline || siteInfo.heroHeadline;
  const description = content.description || siteInfo.heroDescription;
  
  const features = content.features || ["Offline classes", "Weekly exams", "Personal guidance", "Lecture sheets"];
  const teacherName = content.teacherName || siteInfo.teacherName;
  const teacherTitle = content.teacherTitle || "Instructor & CEO";
  const teacherSubtitle = content.teacherSubtitle || "EEE, CUET";

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = (el as HTMLElement).offsetTop - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden bg-bg-soft"
    >
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="brand-container w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-border text-primary text-xs font-bold tracking-wide shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{tagline}</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight"
              >
                {headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-text max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                {description}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="/contact"
                className="primary-btn flex items-center justify-center space-x-2 w-full sm:w-auto text-center cursor-pointer"
              >
                <Phone className="h-4.5 w-4.5" />
                <span>Contact Sir</span>
              </a>
              <button
                onClick={() => scrollToSection("#youtube-classes")}
                className="secondary-btn flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer"
              >
                <Play className="h-4 w-4 fill-primary text-primary" />
                <span>Watch Free Class</span>
              </button>
              <a
                href="/about"
                className="secondary-btn flex items-center justify-center space-x-2 w-full sm:w-auto cursor-pointer bg-white/50 hover:bg-white"
              >
                <User className="h-4 w-4 text-primary" />
                <span>Visit Portfolio</span>
              </a>
            </motion.div>

            {/* Small Trust Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 border-t border-border/80 max-w-xl mx-auto lg:mx-0"
            >
              <p className="text-xs sm:text-sm text-muted font-bold tracking-wide flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                {features.map((feature: string, idx: number) => (
                  <React.Fragment key={idx}>
                    <span>{feature}</span>
                    {idx < features.length - 1 && <span className="text-border">•</span>}
                  </React.Fragment>
                ))}
              </p>
            </motion.div>
          </div>

          {/* Hero 3D background & Teacher Photo Column (entire block is clickable and hidable as a single unit) */}
          <div 
            id="hero-teacher-block"
            onClick={onImageClick}
            className={`lg:col-span-5 w-full flex flex-col items-center justify-center relative min-h-[450px] sm:min-h-[550px] z-10 select-none cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 pointer-events-auto ${isTeacherFlying ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            title="Click to meet Shifat Sir"
          >
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0 hidden md:block w-full h-full pointer-events-none">
              <HeroScene />
            </div>

            {/* Teacher transparent portrait (no box wrapper) */}
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[1/1.2] flex items-end justify-center z-10">
              {/* Radial shadows & ambient gold/blue glows behind photo for realistic 3D shadow integration */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-[20%] bg-primary-dark/25 rounded-full blur-xl z-0 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-accent/6 rounded-full blur-[80px] z-0 pointer-events-none" />

              {/* Gradient fade overlay to smoothly dissolve cropped bottom edge */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#FFFCF2] via-[#FFFCF2]/85 to-transparent z-10 pointer-events-none" />

              <Image
                src={content.teacherImage || "/images/sir_photo_clean.png"}
                alt={teacherName}
                fill
                sizes="(max-width: 768px) 280px, 340px"
                className="object-contain object-bottom filter drop-shadow-[0_16px_32px_rgba(1,14,98,0.22)] z-10"
                priority
              />
            </div>

            {/* Compact Designation Tag under portrait */}
            <div className="mt-6 z-20 text-center w-full max-w-[280px] sm:max-w-[340px] bg-white border border-border p-3.5 rounded-xl shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-300">
              <span className="block text-accent font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
                {teacherTitle}
              </span>
              <h4 className="font-extrabold text-base sm:text-lg text-primary mt-1">
                {teacherName}
              </h4>
              <span className="block text-xs text-muted font-bold mt-0.5">
                {teacherSubtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



