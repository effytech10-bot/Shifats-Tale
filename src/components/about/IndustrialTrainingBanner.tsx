"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrainingItem, profileData, SectionHeader } from "@/data/about";
import * as LucideIcons from "lucide-react";
import { Award, Calendar, Building, CheckCircle2, FileText, ExternalLink } from "lucide-react";

interface IndustrialTrainingBannerProps {
  training: TrainingItem;
  header?: SectionHeader;
}

export const IndustrialTrainingBanner: React.FC<IndustrialTrainingBannerProps> = ({ training, header }) => {
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
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{header?.badge || "Industry Experience"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            {header?.title1 || "Industrial"}{" "}
            {header?.title2 ? <span className="text-accent">{header.title2}</span> : "Training"}
          </h2>
          <p className="text-primary/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            {header?.description || "Practical industry exposure and hands-on professional training to bridge academic knowledge with real-world applications."}
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

            {/* Action Button */}
            <div className="pt-2">
              <a href={training.certificateUrl || "#"} className="inline-flex items-center space-x-2 px-8 py-4 bg-accent hover:bg-accent/90 text-primary font-bold rounded-xl shadow-md transition-all hover:-translate-y-1">
                <FileText className="w-5 h-5" />
                <span>View Certificate</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
              </a>
            </div>
          </div>

          {/* Right Column (Certificate Visual) */}
          <div className="lg:w-[450px] shrink-0 bg-[#0A1A44] rounded-[1.5rem] p-6 relative overflow-hidden flex items-center justify-center min-h-[400px]">
            {/* Background patterns for the dark blue area */}
            <div className="absolute inset-0 opacity-10">
               <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <circle cx="100" cy="0" r="50" fill="none" stroke="white" strokeWidth="0.5"/>
                  <circle cx="100" cy="0" r="80" fill="none" stroke="white" strokeWidth="0.5"/>
                  <circle cx="100" cy="0" r="110" fill="none" stroke="white" strokeWidth="0.5"/>
                  <circle cx="100" cy="0" r="140" fill="none" stroke="white" strokeWidth="0.5"/>
               </svg>
            </div>

            {/* The Certificate Paper */}
            <div className="bg-white w-[90%] h-[95%] rounded-lg p-6 shadow-2xl relative z-10 flex flex-col items-center text-center transform -rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* Border inner */}
               <div className="absolute inset-2 border border-[#E7E0D2] rounded-md pointer-events-none" />
               <div className="absolute inset-3 border border-accent/20 rounded-sm pointer-events-none" />
               
               <div className="flex w-full justify-between items-start mb-6">
                 <Award className="w-8 h-8 text-accent" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">{training.organization.split("(")[1]?.replace(")","") || "BTCL"}</span>
               </div>

               <div className="space-y-4 w-full">
                 <div className="text-[10px] font-bold text-accent tracking-widest uppercase flex items-center justify-center space-x-2">
                   <div className="w-6 h-px bg-accent/30" />
                   <span>Official Certificate</span>
                   <div className="w-6 h-px bg-accent/30" />
                 </div>
                 <h4 className="text-base font-extrabold text-primary uppercase">Certificate of Completion</h4>
                 <div className="text-[9px] text-muted font-medium mt-4">This is to certify that</div>
                 <div className="text-sm font-bold text-accent border-b border-[#E7E0D2] pb-1 mx-4">{profileData.name}</div>
                 <div className="text-[9px] text-muted font-medium">has successfully completed</div>
                 <div className="text-xs font-bold text-primary">{training.title}</div>
                 <div className="text-[9px] text-muted font-medium">at</div>
                 <div className="text-[9px] font-bold text-accent">{training.organization}</div>
               </div>

               <div className="mt-auto flex w-full justify-between items-end pt-6">
                 <div className="flex flex-col items-center">
                    <Award className="w-6 h-6 text-accent mb-1" />
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 border-b border-primary/20 mb-1" />
                    <span className="text-[6px] text-muted uppercase font-bold">Date of Issue</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 border-b border-primary/20 mb-1 flex items-center justify-center">
                       <span className="font-signature text-primary text-lg leading-none -mt-3 italic">Signature</span>
                    </div>
                    <span className="text-[6px] text-muted uppercase font-bold">Authorized Signature</span>
                 </div>
               </div>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
