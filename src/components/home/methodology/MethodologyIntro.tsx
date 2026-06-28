"use client";

import React from "react";
import { motion } from "framer-motion";

interface MethodologyIntroProps {
  eyebrow?: string;
  heading?: string;
  highlightedText?: string;
  description?: string;
}

export const MethodologyIntro: React.FC<MethodologyIntroProps> = ({
  eyebrow = "OUR METHODOLOGY",
  heading = "Why Learn with",
  highlightedText = "Shifat Sir?",
  description = "We go beyond standard classroom setups. Our ecosystem focuses on core conceptual depth, solving techniques, and keeping students highly accountable.",
}) => {
  return (
    <div className="flex flex-col justify-center space-y-5 pr-2 lg:pr-6 text-left relative z-10 h-full">
      {/* Decorative Eyebrow Pill */}
      <div className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#010E62]">
        <span className="flex items-center space-x-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#010E62] shrink-0" />
          <span className="w-8 h-[1.5px] bg-[#010E62]/30 shrink-0" />
        </span>
        <span>{eyebrow}</span>
        <span className="flex items-center space-x-1 shrink-0">
          <span className="w-8 h-[1.5px] bg-[#010E62]/30 shrink-0" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#010E62] shrink-0" />
        </span>
      </div>

      {/* Main Heading with Accent Bar */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight leading-[1.15]">
        {heading} <br className="hidden sm:inline" />
        <span className="relative inline-block pb-3.5 mt-1.5">
          {highlightedText}
          <span className="absolute bottom-0 left-0 w-24 h-[5px] bg-[#FBB503] rounded-full" />
        </span>
      </h2>

      {/* Intro Description */}
      <p className="text-text/85 text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
        {description}
      </p>

      {/* Subtle Decorative Dashed Journey Line motif */}
      <div className="pt-2 hidden sm:block pointer-events-none opacity-80">
        <svg className="w-32 h-8 text-[#FBB503]" viewBox="0 0 120 30" fill="none">
          <path d="M 5 20 Q 40 5 80 20 T 115 15" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="115" cy="15" r="3.5" fill="#FBB503" />
        </svg>
      </div>
    </div>
  );
};
