"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Send, CheckCircle2, Calendar, Clock, BookOpen, GraduationCap, Zap, Star } from "lucide-react";
import { courses } from "@/data/courses";
import { siteInfo } from "@/data/site";
import InnerPageHero from "@/components/layout/InnerPageHero";

export default function CoursesClient() {
  const whatsappNumber = siteInfo.whatsapp;
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "All Programs", icon: BookOpen },
    { id: "academic", label: "Academic", icon: GraduationCap },
    { id: "admission", label: "Admission", icon: Star },
    { id: "special", label: "Special Care", icon: Zap },
    { id: "crash", label: "Crash Course", icon: Clock }
  ];

  const filteredCourses = courses.filter(course => {
    if (filter === "all") return true;
    return course.type === filter;
  });

  return (
    <div className="min-h-screen bg-[#FFF9F2] pt-24 pb-20 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-full h-[400px]">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full">
           <path d="M0,200 C300,100 700,300 1000,200" fill="none" stroke="#FBB503" strokeWidth="2"/>
           <path d="M0,220 C300,120 700,320 1000,220" fill="none" stroke="#FBB503" strokeWidth="1"/>
        </svg>
      </div>

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Header */}
        <InnerPageHero
          eyebrow="BATCHES & PROGRAMS"
          title={
            <>
              <span className="block text-white">Explore Our Batches at</span>
              <span className="block text-accent mt-1">Shifat&apos;s Tales</span>
            </>
          }
          description="Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Courses" },
          ]}
          imageSrc="/images/flyer_hsc26_hsc27.jpg"
          imageAlt="Courses Cover"
        />

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                  filter === cat.id 
                    ? "bg-primary text-white" 
                    : "bg-white text-primary border border-[#E7E0D2] hover:bg-white/80 hover:shadow-md"
                }`}
              >
                {filter === cat.id ? (
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                ) : (
                  <Icon className="w-4 h-4 opacity-70 shrink-0" />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Courses Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E7E0D2] flex flex-col hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group"
              >
              {/* Card Banner */}
              <div className="relative w-full h-[280px] bg-gradient-to-b from-[#FFF9F2] to-white border-b border-[#E7E0D2]/50 p-6 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(rgba(10,26,68,0.06)_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />
                <Image
                  src={course.bannerImage}
                  alt={course.title}
                  fill
                  className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-700 ease-out relative z-10 filter drop-shadow-md"
                />
              </div>

              {/* Card Content */}
              <div className="p-7 md:p-8 flex flex-col flex-grow relative">
                <div className="mb-4">
                  <span className="inline-flex items-center space-x-1.5 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full bg-[#08132E] text-white shadow-sm mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>{course.target}</span>
                  </span>
                  <h3 className="text-2xl sm:text-[26px] font-extrabold text-[#08132E] tracking-tight leading-tight mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm font-bold text-accent">
                    {course.subtitle}
                  </p>
                </div>

                <p className="text-[13px] sm:text-sm text-gray-600 leading-relaxed mb-6 font-medium">
                  {course.description}
                </p>

                {/* Highlights/Features */}
                {course.features && course.features.length > 0 && (
                  <div className="space-y-3 mb-8">
                    <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#08132E]/50">Key Features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-xs sm:text-[13px] text-gray-700 font-semibold">
                      {course.features.map((feature: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Schedule Details - Premium Dark Block */}
                <div className="grid grid-cols-2 gap-5 p-5 rounded-3xl bg-[#08132E] text-white text-left mt-auto mb-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                  <div className="relative z-10">
                    <span className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest text-accent font-extrabold mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Weekly Schedule</span>
                    </span>
                    <span className="text-xs sm:text-[13px] font-medium leading-snug text-white/95 block pr-2">{course.schedule}</span>
                  </div>
                  <div className="relative z-10 border-l border-white/10 pl-5">
                    <span className="flex items-center space-x-1.5 text-[9px] sm:text-[10px] uppercase tracking-widest text-accent font-extrabold mb-2">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Duration</span>
                    </span>
                    <span className="text-xs sm:text-[13px] font-medium leading-snug text-white/95 block">{course.duration}</span>
                  </div>
                </div>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello Sir, I want to inquire about the batch: ${course.title}. Please provide details and class timings.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full primary-btn flex items-center justify-center space-x-2 text-center py-3.5 text-xs font-bold shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
