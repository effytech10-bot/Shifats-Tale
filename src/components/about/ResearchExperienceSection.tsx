"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResearchExperienceItem, SectionHeader } from "@/data/about";
import * as LucideIcons from "lucide-react";
import { ChevronRight, Target, Activity, BarChart } from "lucide-react";

interface ResearchExperienceSectionProps {
  researchData: ResearchExperienceItem[];
  header?: SectionHeader;
}

const renderDynamicIcon = (iconName: string, className: string = "w-5 h-5") => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) return <LucideIcons.FileText className={className} />;
  return <IconComponent className={className} />;
};

export const ResearchExperienceSection: React.FC<ResearchExperienceSectionProps> = ({ researchData, header }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!researchData || researchData.length === 0) return null;

  const activeItem = researchData[activeIndex];

  return (
    <section className="py-16 lg:py-24 relative bg-[#FFF9F2] overflow-hidden">
      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#E7E0D2] shadow-sm">
            <LucideIcons.FlaskConical className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{header?.badge || "Research Experience"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            {header?.title1 || "Research That Drives"}{" "}
            {header?.title2 ? <span className="text-accent">{header.title2}</span> : "Impact"}
          </h2>
          <p className="text-primary/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            {header?.description || "Exploring advanced topics in engineering to solve real-world problems through research and innovation."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* =========================================================
              LEFT COLUMN: Menu 
              ========================================================= */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Vertical Menu */}
            <div className="relative pl-6 sm:pl-8">
              {/* Vertical line connecting nodes */}
              <div className="absolute left-[3px] sm:left-[11px] top-8 bottom-8 w-[2px] bg-[#E7E0D2]" />
              
              <div className="space-y-4">
                {researchData.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div 
                      key={item.id} 
                      className="relative group cursor-pointer"
                      onClick={() => setActiveIndex(idx)}
                    >
                      {/* Node Dot */}
                      <div className={`absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[4px] border-[#FFF9F2] z-10 transition-colors duration-300 ${isActive ? "bg-accent scale-110 shadow-sm" : "bg-primary group-hover:bg-primary/70"}`} />
                      
                      {/* Menu Item Card */}
                      <div className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 ${isActive ? "bg-white border border-accent shadow-[0_8px_30px_rgb(0,0,0,0.04)]" : "bg-white/50 border border-transparent hover:bg-white/80 hover:shadow-sm"}`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? "bg-[#FBE8CA] text-accent" : "bg-primary/5 text-primary"}`}>
                            {renderDynamicIcon(item.iconName, "w-6 h-6")}
                          </div>
                          <div>
                            <h4 className={`font-bold text-base sm:text-lg leading-tight mb-1 transition-colors ${isActive ? "text-primary" : "text-primary/80 group-hover:text-primary"}`}>
                              {item.type}
                            </h4>
                            <p className="text-xs sm:text-sm font-medium text-muted">
                              {item.year}
                            </p>
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${isActive ? "border-accent text-accent" : "border-[#E7E0D2] text-primary/40 group-hover:border-primary/20"}`}>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN: Details Card 
              ========================================================= */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-white"
              >
                {/* Top Banner (Dark Blue) */}
                <div className="relative h-32 sm:h-40 bg-primary w-full overflow-hidden">
                  {/* Decorative wavy lines */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                      <path d="M0 100 C 200 0, 400 200, 800 100 L 800 0 L 0 0 Z" fill="url(#grad1)" />
                      <path d="M0 150 C 300 50, 500 250, 800 150 L 800 200 L 0 200 Z" fill="url(#grad2)" />
                      <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FBB503" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="transparent" />
                          <stop offset="100%" stopColor="#FBB503" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Floating Icon Badge */}
                  <div className="absolute -bottom-6 left-8 w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-lg border-[4px] border-white z-10">
                    {renderDynamicIcon(activeItem.iconName, "w-8 h-8 sm:w-10 sm:h-10")}
                  </div>
                </div>

                <div className="p-8 sm:p-10 pt-12 sm:pt-16">
                  {/* Subtitle / Type */}
                  <div className="mb-6">
                    <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-2">Research Type</p>
                    <span className="inline-block px-4 py-1.5 bg-[#FFF3E3] text-primary text-sm font-bold rounded-full">
                      {activeItem.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-[28px] font-extrabold text-primary font-display leading-[1.3] mb-8">
                    {activeItem.title}
                  </h3>

                  {/* Supervisors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-[#E7E0D2]/60">
                    {activeItem.supervisor && (
                      <div>
                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1">Supervisor</p>
                        <p className="text-base font-bold text-primary">{activeItem.supervisor}</p>
                      </div>
                    )}
                    {activeItem.coSupervisors && (
                      <div>
                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-1">Co-Supervisor</p>
                        <p className="text-base font-bold text-primary">{activeItem.coSupervisors}</p>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="mb-10">
                    <p className="text-[11px] font-bold text-muted uppercase tracking-widest mb-3">Research Summary</p>
                    <p className="text-[15px] sm:text-base text-primary/80 font-medium leading-relaxed whitespace-pre-line">
                      {activeItem.summary}
                    </p>
                  </div>

                  {/* Footer Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-5 sm:p-6 bg-white border border-[#E7E0D2] rounded-2xl shadow-sm">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Focus Area</p>
                        <p className="text-xs font-bold text-primary leading-tight">{activeItem.focusArea}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Activity className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Techniques</p>
                        <p className="text-xs font-bold text-primary leading-tight">{activeItem.techniques}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <BarChart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-bold text-muted uppercase tracking-widest mb-1">Outcome</p>
                        <p className="text-xs font-bold text-primary leading-tight">{activeItem.outcome}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};
