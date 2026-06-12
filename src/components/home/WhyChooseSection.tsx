"use client";

import React from "react";
import { 
  UserCheck, 
  Users, 
  ClipboardList, 
  BookOpen, 
  MessageCircle, 
  Lightbulb, 
  GraduationCap, 
  Target, 
  ShieldCheck, 
  Star 
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { benefits } from "@/data/site";

const getIcon = (iconName: string, isInverse: boolean = false) => {
  const iconColorClass = isInverse ? "text-primary" : "text-primary";
  switch (iconName) {
    case "UserCheck": return <UserCheck className={`h-6 w-6 ${iconColorClass}`} />;
    case "Users": return <Users className={`h-6 w-6 ${iconColorClass}`} />;
    case "ClipboardList": return <ClipboardList className={`h-6 w-6 ${iconColorClass}`} />;
    case "NotebookTabs": return <BookOpen className={`h-6 w-6 ${iconColorClass}`} />;
    case "MessageCircle": return <MessageCircle className={`h-6 w-6 ${iconColorClass}`} />;
    case "Cpu": return <Lightbulb className={`h-6 w-6 ${iconColorClass}`} />;
    default: return <UserCheck className={`h-6 w-6 ${iconColorClass}`} />;
  }
};

export default function WhyChooseSection() {
  const shouldReduceMotion = useReducedMotion();

  // Find benefit objects by title/iconName to render them in correct grid cells
  const getBenefit = (idx: number) => benefits[idx];
  
  const b01 = getBenefit(0); // Personal Guidance
  const b02 = getBenefit(1); // Small Batch Environment
  const b03 = getBenefit(2); // Weekly Exams
  const b04 = getBenefit(3); // Lecture Sheets
  const b05 = getBenefit(4); // Doubt Solving
  const b06 = getBenefit(5); // Concept-Based Teaching

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section id="why-choose" className="brand-section-wrapper bg-[#FFF9EA] relative overflow-hidden">
      {/* Background ambient glows to match the warm methodology aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* SVG Background Connector Lines on Desktop */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
        {/* Curved Connector 1: Title block to Card 02 */}
        <svg className="absolute text-[#FBB503]/40" style={{ left: "28%", top: "28%", width: "120px", height: "120px" }} viewBox="0 0 120 120" fill="none">
          <path d="M 10 90 Q 60 90 90 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          {/* Pulsing dots on line */}
          <circle cx="10" cy="90" r="4.5" fill="#FBB503" stroke="#FFF9EA" strokeWidth="1.5" />
          <circle cx="90" cy="20" r="4.5" fill="#FBB503" stroke="#FFF9EA" strokeWidth="1.5" />
        </svg>

        {/* Straight Connector 2: Card 05 to Card 06 */}
        <svg className="absolute text-[#FBB503]/40" style={{ left: "68%", top: "71%", width: "70px", height: "20px" }} viewBox="0 0 70 20" fill="none">
          <path d="M 0 10 L 70 10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="2" cy="10" r="3" fill="#FBB503" />
          <circle cx="68" cy="10" r="3" fill="#FBB503" />
        </svg>

        {/* Bottom Left Radiating Dot */}
        <div className="absolute left-[15%] bottom-[12%] flex items-center justify-center">
          <span className="absolute w-6 h-6 rounded-full bg-[#FBB503]/30 animate-ping" />
          <span className="w-3.5 h-3.5 rounded-full bg-[#FBB503] border-2 border-white shadow-sm" />
        </div>
      </div>

      <div className="brand-container relative z-10 space-y-12">
        {/* Asymmetrical Methodology Grid (stretched w-full for wider screen footprint) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full mx-auto">
          
          {/* ================== TOP ROW ================== */}
          
          {/* Column 1: Title Block (Col-span-4) */}
          <motion.div 
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-4 flex flex-col justify-center space-y-5 pr-4 text-left"
          >
            {/* Title Badge matching image with tiny dots */}
            <div className="flex items-center space-x-2 text-[10px] font-extrabold uppercase tracking-widest text-[#010E62]">
              <span className="flex items-center space-x-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#010E62] shrink-0" />
                <span className="w-8 h-[1.5px] bg-[#010E62]/30 shrink-0" />
              </span>
              <span>OUR METHODOLOGY</span>
              <span className="flex items-center space-x-1 shrink-0">
                <span className="w-8 h-[1.5px] bg-[#010E62]/30 shrink-0" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#010E62] shrink-0" />
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight leading-tight">
              Why Learn with <br />
              <span className="relative inline-block pb-3 mt-1.5">
                Shifat Sir?
                <span className="absolute bottom-0 left-0 w-20 h-[5px] bg-[#FBB503] rounded-full" />
              </span>
            </h2>

            <p className="text-text text-sm leading-relaxed max-w-sm font-medium">
              We go beyond standard classroom setups. Our ecosystem focuses on core conceptual depth, solving techniques, and keeping students highly accountable.
            </p>
          </motion.div>

          {/* Column 2: Highlight Card 02 (Col-span-4) - Blue by default */}
          {b02 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-4 brand-card rounded-3xl p-7 flex flex-col space-y-6 relative overflow-hidden group transition-all duration-500 ease-out border border-[#010E62]/10 bg-gradient-to-br from-[#010E62] to-[#000940] shadow-xl hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(1,14,98,0.25)] text-left cursor-pointer"
            >
              {/* Background abstract waves with float animation */}
              <div className="absolute inset-0 opacity-12 pointer-events-none overflow-hidden rounded-3xl z-0">
                <motion.div
                  animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
                    <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
                  </svg>
                </motion.div>
              </div>

              {/* Glowing Icon Circle */}
              <div className="relative w-14 h-14 shrink-0 z-10">
                <div className="absolute inset-0 rounded-full bg-[#FBB503]/30 blur-md animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg">
                  {getIcon(b02.iconName)}
                </div>
              </div>

              {/* Title & Desc */}
              <div className="space-y-2.5 z-10">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {b02.title}
                </h3>
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
                  {b02.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Column 3: Card 03 (Col-span-4) - Cream default, Blue on hover */}
          {b03 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-4 brand-card rounded-3xl p-7 flex flex-col space-y-6 relative overflow-hidden group transition-all duration-500 ease-out border border-[#E7E0D2] bg-gradient-to-b from-white to-[#FFFDF6] shadow-md hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(1,14,98,0.25)] text-left cursor-pointer"
            >
              {/* Blue background hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#010E62] to-[#000940] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
              
              {/* Background waves in blue overlay with float animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-500 ease-out z-0 overflow-hidden rounded-3xl">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
                    <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
                  </svg>
                </motion.div>
              </div>

              {/* Glow Icon container relative z-10 */}
              <div className="relative w-14 h-14 shrink-0 z-10">
                <div className="absolute inset-0 rounded-full bg-[#FBB503]/15 group-hover:bg-[#FBB503]/35 group-hover:scale-110 blur-md transition-all duration-300" />
                <div className="relative w-14 h-14 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center shadow-sm">
                  {getIcon(b03.iconName)}
                </div>
              </div>

              {/* Title & Desc relative z-10 */}
              <div className="space-y-2.5 relative z-10">
                <h3 className="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300 tracking-tight">
                  {b03.title}
                </h3>
                <p className="text-[#4B5563] group-hover:text-white/85 transition-colors duration-300 text-xs sm:text-sm leading-relaxed">
                  {b03.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* ================== BOTTOM ROW ================== */}
          
          {/* Row 2, Col 1-4: Card 01 Horizontal wide layout (Col-span-4) */}
          {b01 && (
            <motion.div
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-4 brand-card rounded-3xl p-7 flex flex-col sm:flex-row items-start gap-6 relative overflow-hidden group transition-all duration-500 ease-out border border-[#E7E0D2] bg-gradient-to-b from-white to-[#FFFDF6] shadow-md hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(1,14,98,0.25)] text-left cursor-pointer"
            >
              {/* Blue background hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#010E62] to-[#000940] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
              
              {/* Background waves in blue overlay with float animation */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-500 ease-out z-0 overflow-hidden rounded-3xl">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
                    <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
                  </svg>
                </motion.div>
              </div>

              {/* Top decoration Dot pattern grid */}
              <svg className="absolute bottom-3 left-4 text-accent/10 group-hover:text-accent/15 transition-colors duration-500 w-16 h-12 pointer-events-none z-10" fill="currentColor">
                <pattern id="dot-pattern-01" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.2" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dot-pattern-01)" />
              </svg>

              {/* Large UserCheck Glow Icon relative z-10 */}
              <div className="relative w-14 h-14 shrink-0 mt-2 z-10">
                <div className="absolute inset-0 rounded-full bg-[#FBB503]/20 group-hover:bg-[#FBB503]/35 group-hover:scale-110 blur-md transition-all duration-300" />
                <div className="relative w-14 h-14 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center shadow-md">
                  <div className="relative">
                    <UserCheck className="h-6 w-6 text-primary" />
                    <div className="absolute -bottom-1 -right-1 bg-[#FBB503] p-0.5 rounded-full border border-white">
                      <Star className="h-2 w-2 text-primary fill-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content block relative z-10 */}
              <div className="space-y-2 flex-grow min-w-0 pr-4 relative z-10">
                <h3 className="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300 tracking-tight">
                  {b01.title}
                </h3>
                <p className="text-[#4B5563] group-hover:text-white/85 transition-colors duration-300 text-xs sm:text-sm leading-relaxed">
                  {b01.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Row 2, Col 5-12: Sub-grid for Card 04, 05, 06 (Col-span-8) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 04 */}
            {b04 && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="brand-card rounded-3xl p-7 flex flex-col space-y-6 relative overflow-hidden group transition-all duration-500 ease-out border border-[#E7E0D2] bg-gradient-to-b from-white to-[#FFFDF6] shadow-md hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(1,14,98,0.25)] text-left cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#010E62] to-[#000940] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-500 ease-out z-0 overflow-hidden rounded-3xl">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
                      <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
                    </svg>
                  </motion.div>
                </div>

                <div className="relative w-14 h-14 shrink-0 z-10">
                  <div className="absolute inset-0 rounded-full bg-[#FBB503]/15 group-hover:bg-[#FBB503]/35 group-hover:scale-110 blur-md transition-all duration-300" />
                  <div className="relative w-14 h-14 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center shadow-sm">
                    {getIcon(b04.iconName)}
                  </div>
                </div>

                <div className="space-y-2.5 relative z-10">
                  <h3 className="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300 tracking-tight">
                    {b04.title}
                  </h3>
                  <p className="text-[#4B5563] group-hover:text-white/85 transition-colors duration-300 text-xs sm:text-sm leading-relaxed">
                    {b04.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Card 05 */}
            {b05 && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="brand-card rounded-3xl p-7 flex flex-col space-y-6 relative overflow-hidden group transition-all duration-500 ease-out border border-[#E7E0D2] bg-gradient-to-b from-white to-[#FFFDF6] shadow-md hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(1,14,98,0.25)] text-left cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#010E62] to-[#000940] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-500 ease-out z-0 overflow-hidden rounded-3xl">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
                      <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
                    </svg>
                  </motion.div>
                </div>

                <div className="relative w-14 h-14 shrink-0 z-10">
                  <div className="absolute inset-0 rounded-full bg-[#FBB503]/15 group-hover:bg-[#FBB503]/35 group-hover:scale-110 blur-md transition-all duration-300" />
                  <div className="relative w-14 h-14 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center shadow-sm">
                    {getIcon(b05.iconName)}
                  </div>
                </div>

                <div className="space-y-2.5 relative z-10">
                  <h3 className="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300 tracking-tight">
                    {b05.title}
                  </h3>
                  <p className="text-[#4B5563] group-hover:text-white/85 transition-colors duration-300 text-xs sm:text-sm leading-relaxed">
                    {b05.description}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Card 06 */}
            {b06 && (
              <motion.div
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="brand-card rounded-3xl p-7 flex flex-col space-y-6 relative overflow-hidden group transition-all duration-500 ease-out border border-[#E7E0D2] bg-gradient-to-b from-white to-[#FFFDF6] shadow-md hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(1,14,98,0.25)] text-left cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#010E62] to-[#000940] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-0" />
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-12 transition-opacity duration-500 ease-out z-0 overflow-hidden rounded-3xl">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-full h-full"
                  >
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,40 C30,60 70,20 100,40 L100,100 L0,100 Z" fill="#FBB503" />
                      <path d="M0,60 C40,40 60,80 100,60 L100,100 L0,100 Z" fill="#FFFFFF" />
                    </svg>
                  </motion.div>
                </div>

                {/* Decoration Dot pattern grid */}
                <svg className="absolute bottom-3 right-4 text-accent/10 group-hover:text-accent/15 transition-colors duration-500 w-16 h-12 pointer-events-none z-10" fill="currentColor">
                  <pattern id="dot-pattern-06" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.2" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#dot-pattern-06)" />
                </svg>

                <div className="relative w-14 h-14 shrink-0 z-10">
                  <div className="absolute inset-0 rounded-full bg-[#FBB503]/15 group-hover:bg-[#FBB503]/35 group-hover:scale-110 blur-md transition-all duration-300" />
                  <div className="relative w-14 h-14 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center shadow-sm">
                    {getIcon(b06.iconName)}
                  </div>
                </div>

                <div className="space-y-2.5 relative z-10">
                  <h3 className="text-lg font-bold text-primary group-hover:text-white transition-colors duration-300 tracking-tight">
                    {b06.title}
                  </h3>
                  <p className="text-[#4B5563] group-hover:text-white/85 transition-colors duration-300 text-xs sm:text-sm leading-relaxed">
                    {b06.description}
                  </p>
                </div>
              </motion.div>
            )}

          </div>

        </div>

        {/* Floating Bottom Pill-shaped Methodology Trust Bar */}
        <div className="flex justify-center pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0 bg-white/75 border border-[#E7E0D2] rounded-3xl sm:rounded-full px-6 py-4 sm:py-3 shadow-lg backdrop-blur-md max-w-4xl w-full">
            {/* Value 1: Concept First */}
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <GraduationCap className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Concept First</span>
            </div>
            {/* Divider */}
            <div className="hidden sm:block h-5 w-[1.5px] bg-[#E7E0D2]" />

            {/* Value 2: Accountability Always */}
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <Target className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Accountability Always</span>
            </div>
            {/* Divider */}
            <div className="hidden sm:block h-5 w-[1.5px] bg-[#E7E0D2]" />

            {/* Value 3: Student Success */}
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-extrabold text-primary w-full sm:w-1/4">
              <Users className="h-4.5 w-4.5 text-[#FBB503]" />
              <span>Student Success</span>
            </div>
            {/* Divider */}
            <div className="hidden sm:block h-5 w-[1.5px] bg-[#E7E0D2]" />

            {/* Value 4: Trust & Transparency */}
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
