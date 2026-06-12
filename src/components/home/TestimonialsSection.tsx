"use client";

import React, { useState, useEffect } from "react";
import { testimonials } from "@/data/testimonials";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();

  // Distribute testimonials into responsive columns
  const col1 = [testimonials[0], testimonials[3], testimonials[6]];
  const col2 = [testimonials[1], testimonials[4], testimonials[7]];
  const col3 = [testimonials[2], testimonials[5], testimonials[8]];

  const tab1 = [testimonials[0], testimonials[2], testimonials[4], testimonials[6], testimonials[8]];
  const tab2 = [testimonials[1], testimonials[3], testimonials[5], testimonials[7]];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const TestimonialCard = ({ item }: { item: typeof testimonials[0] }) => (
    <div 
      className="brand-card rounded-2xl p-6 bg-white border border-border flex flex-col justify-between space-y-4 hover:shadow-lg hover:border-accent/40 transition-all duration-300 w-full text-left select-none"
    >
      <div className="space-y-3">
        {/* Star Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-accent text-accent shrink-0" />
          ))}
        </div>

        {/* Message */}
        <p className="text-xs sm:text-sm text-text font-semibold leading-relaxed italic">
          "{item.message}"
        </p>
      </div>

      {/* User Info Row */}
      <div className="pt-4 border-t border-border flex items-center space-x-3 mt-auto">
        {/* Initials Avatar */}
        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-primary text-xs font-extrabold shrink-0 shadow-sm">
          {getInitials(item.name)}
        </div>
        <div className="min-w-0">
          <h4 className="font-extrabold text-primary text-xs sm:text-sm truncate leading-snug">
            {item.name}
          </h4>
          <span className="text-[10px] text-muted block font-semibold truncate">
            {item.batch} {item.achievement ? `| ${item.achievement}` : ""}
          </span>
        </div>
      </div>
    </div>
  );

  const MarqueeColumn = ({ items, speed }: { items: typeof testimonials; speed: string }) => (
    <div className="relative h-[620px] overflow-hidden rounded-2xl">
      <div 
        style={{ "--marquee-duration": speed } as React.CSSProperties}
        className="flex flex-col gap-5 animate-marquee-vertical animate-marquee-vertical-hover-pause py-2"
      >
        {items.map((item, index) => (
          <TestimonialCard key={`col-orig-${item.id}-${index}`} item={item} />
        ))}
        {items.map((item, index) => (
          <TestimonialCard key={`col-dup-${item.id}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="brand-section-wrapper bg-bg-soft relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Testimonials
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            What Parents & Students Say
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Honest feedback from students who achieved Board A+ and cracked engineering university admissions under Shifat Sir's guidance.
          </motion.p>
        </div>

        {/* 3-Column Infinite Vertical Marquee Container */}
        <div className="relative max-w-6xl mx-auto w-full overflow-hidden px-2 py-4">
          {/* Top & Bottom Fade Overlays */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#FFFCF2] via-[#FFFCF2]/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FFFCF2] via-[#FFFCF2]/80 to-transparent z-10" />

          {/* Responsive columns grid */}
          <div className="relative z-0">
            {/* Desktop: 3 Columns */}
            <div className="hidden lg:grid grid-cols-3 gap-6">
              <MarqueeColumn items={col1} speed="24s" />
              <MarqueeColumn items={col2} speed="30s" />
              <MarqueeColumn items={col3} speed="27s" />
            </div>

            {/* Tablet: 2 Columns */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
              <MarqueeColumn items={tab1} speed="26s" />
              <MarqueeColumn items={tab2} speed="32s" />
            </div>

            {/* Mobile: 1 Column */}
            <div className="grid grid-cols-1 gap-6 md:hidden">
              <MarqueeColumn items={testimonials} speed="40s" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
