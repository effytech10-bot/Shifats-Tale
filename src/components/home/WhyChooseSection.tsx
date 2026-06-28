"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { benefits, BenefitItem } from "@/data/site";
import { GraduationCap, Target, Users, ShieldCheck } from "lucide-react";
import { MethodologyIntro } from "./methodology/MethodologyIntro";
import { MethodologyCard } from "./methodology/MethodologyCard";

export default function WhyChooseSection() {
  const shouldReduceMotion = useReducedMotion();

  // Sort / Map items to match exact Target Reference composition
  // Top row large items: Small Batch Environment, Weekly Exams
  // Bottom row standard items: Personal Guidance, Lecture Sheets, Doubt Solving, Concept-Based Teaching
  const smallBatchItem = benefits.find((b) => b.title.includes("Small Batch")) || benefits[1] || benefits[0];
  const weeklyExamsItem = benefits.find((b) => b.title.includes("Weekly Exams")) || benefits[2] || benefits[1];

  const topRowItems: BenefitItem[] = [smallBatchItem, weeklyExamsItem];

  const bottomRowItems: BenefitItem[] = benefits.filter(
    (b) => b !== smallBatchItem && b !== weeklyExamsItem
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section id="why-choose" className="brand-section-wrapper bg-[#FFF9EA] relative overflow-hidden">
      {/* Background ambient glows matching warm methodology aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FBB503]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FBB503]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* SVG Background Connector Lines on Desktop */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
        {/* Connector from Title block to Top Card 1 */}
        <svg className="absolute text-[#FBB503]/40" style={{ left: "27%", top: "26%", width: "120px", height: "120px" }} viewBox="0 0 120 120" fill="none">
          <path d="M 10 90 Q 60 90 90 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="10" cy="90" r="4.5" fill="#FBB503" stroke="#FFF9EA" strokeWidth="1.5" />
          <circle cx="90" cy="20" r="4.5" fill="#FBB503" stroke="#FFF9EA" strokeWidth="1.5" />
        </svg>

        {/* Straight Connector between Bottom Cards */}
        <svg className="absolute text-[#FBB503]/40" style={{ left: "69%", top: "73%", width: "80px", height: "20px" }} viewBox="0 0 80 20" fill="none">
          <path d="M 0 10 L 80 10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="2" cy="10" r="3" fill="#FBB503" />
          <circle cx="78" cy="10" r="3" fill="#FBB503" />
        </svg>
      </div>

      <div className="brand-container relative z-10 space-y-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="flex flex-col space-y-6 lg:space-y-8 w-full mx-auto"
        >
          {/* =========================================================================
              TOP ROW: INTRO BLOCK (COL-4) + 2 LARGE METHODOLOGY CARDS (COL-4 EACH)
              ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full">
            {/* Intro Content Block */}
            <motion.div variants={itemVariants} className="lg:col-span-4">
              <MethodologyIntro />
            </motion.div>

            {/* Top Row Large Card 1 */}
            {topRowItems[0] && (
              <motion.div variants={itemVariants} className="lg:col-span-4 h-full">
                <MethodologyCard item={topRowItems[0]} index={0} size="large" />
              </motion.div>
            )}

            {/* Top Row Large Card 2 */}
            {topRowItems[1] && (
              <motion.div variants={itemVariants} className="lg:col-span-4 h-full">
                <MethodologyCard item={topRowItems[1]} index={1} size="large" />
              </motion.div>
            )}
          </div>

          {/* =========================================================================
              BOTTOM ROW: 4 EQUAL STANDARD METHODOLOGY CARDS (COL-3 EACH)
              ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full">
            {bottomRowItems.map((item, idx) => (
              <motion.div key={item.title || idx} variants={itemVariants} className="lg:col-span-3 h-full">
                <MethodologyCard item={item} index={idx + 2} size="standard" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Pill-shaped Methodology Trust Bar */}
        <div className="flex justify-center pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 bg-white/80 border border-[#E7E0D2] rounded-3xl sm:rounded-full px-6 py-4 sm:py-3.5 shadow-lg backdrop-blur-md max-w-4xl w-full">
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <GraduationCap className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Concept First</span>
            </div>
            <div className="hidden sm:block h-5 w-[1.5px] bg-[#E7E0D2]" />

            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <Target className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Accountability Always</span>
            </div>
            <div className="hidden sm:block h-5 w-[1.5px] bg-[#E7E0D2]" />

            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <Users className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Student Success</span>
            </div>
            <div className="hidden sm:block h-5 w-[1.5px] bg-[#E7E0D2]" />

            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <ShieldCheck className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Trust & Transparency</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
