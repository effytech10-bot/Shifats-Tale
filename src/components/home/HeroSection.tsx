"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Play, User } from "lucide-react";

// Dynamically import the 3D scene with SSR disabled for optimal bundle performance
const HeroScene = dynamic(() => import("../three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  const [imgSrc, setImgSrc] = useState("/images/media__1781164765815_transparent.png");

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
              <span>Admissions Open for SSC & HSC Batches</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight"
              >
                Personal Guidance for
                <span className="block mt-1 text-primary-dark">
                  Better Academic Success
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-text max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Learn directly from an experienced teacher through structured classes, regular exams, clear explanations, and individual academic support.
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("#contact");
                }}
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
            </motion.div>

            {/* Small Trust Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-2 border-t border-border/80 max-w-xl mx-auto lg:mx-0"
            >
              <p className="text-xs sm:text-sm text-muted font-bold tracking-wide flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span>Offline classes</span>
                <span className="text-border">•</span>
                <span>Weekly exams</span>
                <span className="text-border">•</span>
                <span>Personal guidance</span>
                <span className="text-border">•</span>
                <span>Lecture sheets</span>
              </p>
            </motion.div>
          </div>

          {/* Hero 3D background & Teacher Photo Column */}
          <div className="lg:col-span-5 w-full flex items-center justify-center relative min-h-[400px] sm:min-h-[500px]">
            {/* 3D Scene Layer (only on large displays for best performance) */}
            <div className="absolute inset-0 z-0 hidden md:block w-full h-full pointer-events-none">
              <HeroScene />
            </div>

            {/* Teacher Card (glassmorphic border overlaying the 3D scene) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-[320px] sm:max-w-[360px] aspect-[4/5] relative rounded-3xl overflow-hidden border border-border shadow-lg bg-white/90 backdrop-blur-md p-5 flex flex-col justify-between z-10"
            >
              {/* Grid backdrop */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />

              <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-4 relative z-10">
                {/* Framed Image Circle */}
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-accent/40 shadow-sm bg-bg-soft flex items-center justify-center">
                  <Image
                    src={imgSrc}
                    alt="Md. Zia Uddin Azad Sifat"
                    fill
                    sizes="160px"
                    className="object-cover object-top scale-[1.15]"
                    onError={() => setImgSrc("/images/shifat_sir.png")} // Fallback to raw jpeg if png isn't generated yet
                  />
                </div>
                <div className="text-center space-y-1">
                  <span className="block font-extrabold text-primary text-base sm:text-lg leading-tight">
                    Md. Zia Uddin Azad Sifat
                  </span>
                  <span className="block text-[11px] text-muted font-extrabold uppercase tracking-widest">
                    Instructor & CEO
                  </span>
                </div>
              </div>

              {/* Specs Badge */}
              <div className="bg-bg-soft/80 border border-border p-3 rounded-2xl flex items-center justify-between relative z-10">
                <div>
                  <span className="block font-bold text-xs text-primary leading-none mb-1">Shifat Sir</span>
                  <span className="block text-[8px] text-muted font-extrabold uppercase tracking-wider">Shifat's Tales Coaching</span>
                </div>
                <span className="bg-accent text-primary text-[9px] font-extrabold px-2.5 py-1 rounded">
                  EEE, CUET
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

