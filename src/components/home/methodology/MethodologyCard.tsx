"use client";

import React from "react";
import { motion } from "framer-motion";
import { BenefitItem, getMethodologyIcon, MethodologyWatermark } from "./methodologyIcons";

interface MethodologyCardProps {
  item: BenefitItem;
  index: number;
  size?: "large" | "standard";
}

export const MethodologyCard: React.FC<MethodologyCardProps> = ({
  item,
  index,
  size = "standard",
}) => {
  if (!item) return null;

  // Format presentation index as "01", "02", etc.
  const formattedNumber = String(index + 1).padStart(2, "0");

  const isLarge = size === "large";

  return (
    <div
      tabIndex={0}
      className={`group brand-card rounded-3xl relative overflow-hidden transition-all duration-500 ease-out cursor-pointer text-left h-full flex flex-col justify-between select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FBB503] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(1,14,98,0.22)] bg-white border border-[#E7E0D2] ${
        isLarge ? "p-7 sm:p-8 min-h-[260px] sm:min-h-[290px]" : "p-6 sm:p-7 min-h-[250px] sm:min-h-[270px]"
      }`}
    >
      {/* 1. Deep Navy Background Transition Overlay (Triggers cleanly on hover / focus-within) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#010E62] via-[#08132E] to-[#000940] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 ease-out z-0 pointer-events-none" />

      {/* 2. Fluid Wave Pattern in Navy Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-15 group-focus-within:opacity-15 transition-opacity duration-500 ease-out z-0 overflow-hidden pointer-events-none">
        <div className="w-[120%] h-[120%] absolute -top-[10%] -left-[10%] group-hover:animate-pulse">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
            <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* 3. Glowing Bottom Accent Curve Line (Reveals on hover/focus) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#FBB503] group-focus-within:bg-[#FBB503] transition-colors duration-500 z-20 shadow-[0_-2px_10px_rgba(251,181,3,0.5)]" />

      {/* 4. Top Section: Icon Badge & Content */}
      <div className="relative z-10 space-y-5">
        {/* Icon Badge Container */}
        <div className="relative w-14 h-14 shrink-0">
          <div className="absolute inset-0 rounded-full bg-[#FBB503]/15 group-hover:bg-[#FBB503]/35 group-focus-within:bg-[#FBB503]/35 transition-all duration-500 blur-md scale-100 group-hover:scale-110" />
          <div className="relative w-14 h-14 rounded-full bg-white border border-[#E7E0D2] group-hover:border-[#FBB503] group-focus-within:border-[#FBB503] flex items-center justify-center shadow-sm transition-colors duration-500">
            <div className="text-primary group-hover:text-primary transition-colors duration-500">
              {getMethodologyIcon(item.iconName, "h-6 w-6")}
            </div>
          </div>
        </div>

        {/* Title & Gold Divider Bar */}
        <div className="space-y-2.5">
          <h3 className="text-lg sm:text-xl font-extrabold text-primary group-hover:!text-white group-focus-within:!text-white transition-colors duration-500 tracking-tight leading-snug font-display">
            {item.title}
          </h3>

          <div className="w-8 h-[2.5px] bg-[#FBB503] rounded-full transition-all duration-500 group-hover:w-12" />

          {item.description && (
            <p className="text-xs sm:text-sm text-text/80 group-hover:!text-white/85 group-focus-within:!text-white/85 transition-colors duration-500 leading-relaxed font-medium">
              {item.description}
            </p>
          )}
        </div>
      </div>

      {/* 5. Bottom Section: Decorative Generated Order Number & Watermark */}
      <div className="relative z-10 flex items-end justify-between pt-6 mt-auto pointer-events-none">
        {/* Generated 2-Digit Order Number */}
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tighter text-black/10 group-hover:text-white/20 group-focus-within:text-white/20 transition-colors duration-500 select-none font-display">
          {formattedNumber}
        </span>

        {/* Theme SVG Watermark Icon */}
        <MethodologyWatermark
          iconName={item.iconName}
          className="w-20 h-20 sm:w-24 sm:h-24 absolute -bottom-3 -right-3 pointer-events-none text-black/5 group-hover:text-white/10 group-focus-within:text-white/10 transition-colors duration-500"
        />
      </div>
    </div>
  );
};
