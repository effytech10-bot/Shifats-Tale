"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrainingItem, SectionHeader } from "@/data/about";
import * as LucideIcons from "lucide-react";
import { Calendar, Building, CheckCircle2, FileText } from "lucide-react";

interface IndustrialTrainingBannerProps {
  training: TrainingItem;
  header?: SectionHeader;
}

export const IndustrialTrainingBanner: React.FC<IndustrialTrainingBannerProps> = ({ training, header }) => {
  const defaultHeader = {
    badge: "Industry Experience",
    title1: "Industrial",
    title2: "Training",
    description: "My practical experience in the telecommunications and power sector."
  };
  
  const displayBadge = header?.badge || defaultHeader.badge;
  const displayTitle1 = header?.title1 || defaultHeader.title1;
  const displayTitle2 = header?.title2 !== undefined ? header.title2 : defaultHeader.title2;
  const displayDesc = header?.description || defaultHeader.description;

  if (!training) return null;

  const renderDynamicIcon = (name: string) => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) return <CheckCircle2 className="w-5 h-5 text-accent" />;
    return <IconComponent className="w-5 h-5 text-accent" />;
  };

  return (
    <section className="py-16 lg:py-24 relative bg-[#FFF9F2] overflow-hidden">
      
      {/* Background Telecom Tower SVG Graphic */}
      <div className="absolute top-0 right-0 opacity-20 pointer-events-none translate-x-1/4 -translate-y-1/4">
        <svg width="500" height="700" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 100 L150 500 L250 500 Z" stroke="#FBB503" strokeWidth="2"/>
          <path d="M150 500 L200 600 L250 500" stroke="#FBB503" strokeWidth="2"/>
          <circle cx="200" cy="100" r="20" stroke="#FBB503" strokeWidth="2"/>
          <circle cx="200" cy="100" r="40" stroke="#FBB503" strokeWidth="1" opacity="0.5"/>
          <circle cx="200" cy="100" r="60" stroke="#FBB503" strokeWidth="1" opacity="0.2"/>
          {/* Cross lines for the tower */}
          <path d="M190 200 L210 200" stroke="#FBB503" strokeWidth="2"/>
          <path d="M180 300 L220 300" stroke="#FBB503" strokeWidth="2"/>
          <path d="M170 400 L230 400" stroke="#FBB503" strokeWidth="2"/>
          <path d="M190 200 L220 300" stroke="#FBB503" strokeWidth="1"/>
          <path d="M210 200 L180 300" stroke="#FBB503" strokeWidth="1"/>
          <path d="M180 300 L230 400" stroke="#FBB503" strokeWidth="1"/>
          <path d="M220 300 L170 400" stroke="#FBB503" strokeWidth="1"/>
        </svg>
      </div>

      {/* Wavy lines radiating */}
      <div className="absolute top-[50px] right-0 opacity-10 pointer-events-none w-full h-[300px] overflow-hidden">
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full">
           <path d="M0,150 C300,50 700,250 1000,150" fill="none" stroke="#FBB503" strokeWidth="2"/>
           <path d="M0,160 C300,70 700,270 1000,160" fill="none" stroke="#FBB503" strokeWidth="1.5"/>
           <path d="M0,140 C300,30 700,230 1000,140" fill="none" stroke="#FBB503" strokeWidth="1"/>
        </svg>
      </div>

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#E7E0D2] shadow-sm">
            <LucideIcons.Radio className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{displayBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            {displayTitle1}{" "}
            {displayTitle2 && <span className="text-accent">{displayTitle2}</span>}
          </h2>
          <p className="text-primary/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            {displayDesc}
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-sm border border-[#E7E0D2] flex flex-col lg:flex-row gap-10 lg:gap-16"
        >
          {/* Left Column (Details) */}
          <div className="flex-1 space-y-8">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-14 h-14 rounded-full bg-[#0A1A44] flex items-center justify-center shrink-0 border border-accent/20 shadow-lg relative overflow-hidden">
                <LucideIcons.Radio className="w-6 h-6 text-accent relative z-10" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-primary font-display leading-tight mb-2">
                  {training.title}
                </h3>
                <p className="text-base font-bold text-primary/80">
                  {training.organization}
                </p>
              </div>
            </div>

            {/* Chips */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#E7E0D2] bg-white">
                <Calendar className="w-4 h-4 text-primary/60" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-primary/50 tracking-wider">Duration</span>
                  <span className="text-xs font-bold text-primary">{training.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#E7E0D2] bg-white">
                <Building className="w-4 h-4 text-primary/60" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-primary/50 tracking-wider">Organization Type</span>
                  <span className="text-xs font-bold text-primary">{training.organizationType || "Government"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#E7E0D2] bg-white">
                <CheckCircle2 className="w-4 h-4 text-primary/60" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-primary/50 tracking-wider">Status</span>
                  <span className="text-xs font-bold text-primary">{training.status || "Completed"}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-[#E7E0D2]" />

            <p className="text-primary/70 font-medium leading-relaxed">
              {training.description}
            </p>

            {/* Features */}
            {training.features && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {training.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-[#FFF9F2] border border-[#E7E0D2]">
                    <div className="shrink-0 bg-white p-1.5 rounded-lg border border-[#E7E0D2] shadow-sm">
                      {renderDynamicIcon(feature.iconName)}
                    </div>
                    <span className="text-xs font-bold text-primary leading-tight">
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Right Column (Certificate Visual) */}
          <div className="lg:w-[450px] lg:max-w-md shrink-0 flex items-center justify-center">
            {training.certificateUrl ? (
              <img 
                src={training.certificateUrl} 
                alt="Industrial Training Certificate" 
                className="w-full h-auto rounded-[1.5rem] border border-[#E7E0D2] shadow-sm object-cover" 
              />
            ) : (
              <div className="w-full min-h-[300px] rounded-[1.5rem] border border-[#E7E0D2] bg-white shadow-sm p-10 flex flex-col items-center justify-center">
                <FileText className="w-16 h-16 text-primary/20 mb-4" />
                <p className="text-primary/50 font-medium text-sm">Certificate not available</p>
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </section>
  );
};
