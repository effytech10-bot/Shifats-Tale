"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Phone, Play, ChevronRight, CheckCircle2 } from "lucide-react";

// Dynamically import HeroScene to prevent hydration mismatch since it renders R3F canvas
const HeroScene = dynamic(() => import("../three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[550px] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  ),
});

export default function HeroSection() {
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
      {/* Background gradients - very soft academic colors */}
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
              <span>Admissions open for SSC & HSC batches</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight"
              >
                Shifat's Tales
                <span className="block mt-1 text-primary-dark">
                  Academic & Admission Care
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-text max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Simplifying complex Physics & Higher Mathematics theories with visual lectures, personalized care, and structured exam routines. Run directly by Adnan Bin Wahid (Shifat Sir).
              </motion.p>
            </div>

            {/* Bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-text max-w-md mx-auto lg:mx-0"
            >
              {[
                "Personalized 1-on-1 feedback",
                "BUET-focused problem strategies",
                "Board creative paper masterclasses",
                "Capped batch size (max 30)",
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm justify-center lg:justify-start">
                  <CheckCircle2 className="h-4.5 w-4.5 text-accent shrink-0" />
                  <span className="font-medium">{text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <a
                href="tel:+8801700000000"
                className="primary-btn flex items-center justify-center space-x-2 w-full sm:w-auto text-center"
              >
                <Phone className="h-4.5 w-4.5" />
                <span>Call Shifat Sir</span>
              </a>
              <button
                onClick={() => scrollToSection("#youtube-classes")}
                className="secondary-btn flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <Play className="h-4 w-4 fill-primary text-primary" />
                <span>Watch Free Class</span>
              </button>
              <button
                onClick={() => scrollToSection("#courses")}
                className="flex items-center justify-center space-x-1 text-sm text-muted hover:text-primary font-bold group transition-colors duration-200 mt-2 sm:mt-0"
              >
                <span>View Batches</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Hero 3D Scene Column */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full relative"
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
