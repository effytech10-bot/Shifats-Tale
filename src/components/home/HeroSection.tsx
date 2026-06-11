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
      <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
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
      className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Admissions open for SSC & HSC batches</span>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
              >
                Shifat's Tales
                <span className="block mt-1 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Academic & Admission Care
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Simplifying complex Physics & Higher Mathematics theories with visual lectures, personalized care, and structured exam routines. Run directly by Adnan Bin Wahid (Shifat Sir).
              </motion.p>
            </div>

            {/* Bullets */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 max-w-md mx-auto lg:mx-0"
            >
              {[
                "Personalized 1-on-1 feedback",
                "BUET-focused problem strategies",
                "Board creative paper masterclasses",
                "Capped batch size (max 30)",
              ].map((text, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm justify-center lg:justify-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{text}</span>
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
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-102"
              >
                <Phone className="h-5 w-5" />
                <span>Call Shifat Sir</span>
              </a>
              <button
                onClick={() => scrollToSection("#youtube-classes")}
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-white font-semibold hover:bg-slate-800 transition-all duration-300 hover:scale-102"
              >
                <Play className="h-4 w-4 fill-white text-white" />
                <span>Watch Free Class</span>
              </button>
              <button
                onClick={() => scrollToSection("#courses")}
                className="flex items-center justify-center space-x-1 text-sm text-slate-400 hover:text-amber-400 font-semibold group transition-colors duration-200 mt-2 sm:mt-0"
              >
                <span>View Batches</span>
                <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Hero 3D Scene Column */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
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
