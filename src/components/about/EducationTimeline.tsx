"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EducationItem, SectionHeader } from "@/data/about";
import { GraduationCap } from "lucide-react";

interface EducationTimelineProps {
  education: EducationItem[];
  header?: SectionHeader;
}

export const EducationTimeline: React.FC<EducationTimelineProps> = ({ education, header }) => {
  const defaultHeader = {
    badge: "Academic Journey",
    title1: "Education &",
    title2: "Qualifications",
    description: "My academic background and formal education that shaped my engineering foundation."
  };
  
  const displayBadge = header?.badge || defaultHeader.badge;
  const displayTitle1 = header?.title1 || defaultHeader.title1;
  const displayTitle2 = header?.title2 !== undefined ? header.title2 : defaultHeader.title2;
  const displayDesc = header?.description || defaultHeader.description;

  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const trackHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  if (!education || education.length === 0) return null;

  const sortedEdu = [...education].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" ref={containerRef}>
      {/* Decorative gradient blur in background */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      
      <div className="brand-container max-w-5xl mx-auto space-y-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#E7E0D2] shadow-sm">
            <GraduationCap className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{displayBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            {displayTitle1} {displayTitle2 && <span className="text-accent">{displayTitle2}</span>}
          </h2>
          {displayDesc && (
            <p className="text-gray-500 text-sm max-w-xl text-center mt-2">
              {displayDesc}
            </p>
          )}
        </motion.div>

        {/* Timeline Container */}
        <div className="relative py-8">
          {/* Main Vertical Track Background */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-[#E7E0D2]/60 rounded-full" />
          
          {/* Animated Fill Track */}
          <motion.div 
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 md:-ml-0.5 bg-gradient-to-b from-accent to-primary rounded-full origin-top"
            style={{ scaleY: trackHeight }}
          />

          <div className="space-y-16 lg:space-y-24 relative z-10">
            {sortedEdu.map((item, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
                  className={`flex flex-col md:flex-row items-center w-full ${isEven ? "md:justify-start" : "md:justify-end"} relative group`}
                >
                  {/* Timeline Dot (Desktop & Mobile) */}
                  <div className={`absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 ${isEven ? "border-primary" : "border-accent"} -ml-3.5 md:-ml-4 z-20 shadow-md group-hover:scale-125 transition-transform duration-300 flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-[45%] pl-14 md:pl-0 ${isEven ? "md:pr-14" : "md:pl-14"}`}>
                    <div className={`bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[1.5rem] border border-white shadow-[0_10px_40px_-10px_rgba(1,14,98,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(1,14,98,0.15)] transition-all duration-300 hover:-translate-y-2 group-hover:border-accent/40 relative ${isEven ? "text-left md:text-right" : "text-left"}`}>
                      
                      {/* Inner wrapper for watermark clipping */}
                      <div className="absolute inset-0 rounded-[1.5rem] overflow-hidden pointer-events-none">
                        {/* Background Watermark Icon */}
                        <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? "left-4 sm:left-8" : "right-4 sm:right-8"} opacity-20 pointer-events-none`}>
                          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-[#E7E0D2] flex items-center justify-center p-6 border-dashed">
                            <GraduationCap className="w-full h-full text-[#E7E0D2]" strokeWidth={1} />
                          </div>
                        </div>
                      </div>

                      {/* Year Badge */}
                      <div className={`absolute top-0 -translate-y-1/2 px-5 py-1.5 rounded-full bg-primary text-accent text-sm font-extrabold shadow-[3px_3px_0_#FBB503] z-10 ${isEven ? "left-6 md:left-auto md:right-8" : "left-6 sm:left-8"}`}>
                        {item.year}
                      </div>

                      <div className="space-y-3 pt-2 relative z-10">
                        <h4 className="font-extrabold text-2xl sm:text-3xl text-primary font-display leading-tight">
                          {item.degree}
                        </h4>
                        <p className="text-sm sm:text-base text-muted font-bold">
                          {item.institution}
                        </p>
                        
                        {/* Custom Yellow Divider */}
                        <div className={`flex items-center gap-1.5 pt-1 ${isEven ? "justify-start md:justify-end" : "justify-start"}`}>
                          {isEven ? (
                            <>
                              <div className="w-1.5 h-1.5 rounded-full bg-accent hidden md:block" />
                              <div className="w-12 h-1 rounded-full bg-accent hidden md:block" />
                              <div className="w-12 h-1 rounded-full bg-accent block md:hidden" />
                              <div className="w-1.5 h-1.5 rounded-full bg-accent block md:hidden" />
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-1 rounded-full bg-accent" />
                              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            </>
                          )}
                        </div>

                        {/* Restored GPA Info */}
                        {item.gpa && (
                          <div className={`pt-2 ${isEven ? "md:flex md:justify-end" : ""}`}>
                            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-[#E7E0D2] shadow-sm">
                              <span className="text-[11px] font-bold text-muted uppercase tracking-wider">GPA / Class</span>
                              <span className="text-sm font-extrabold text-primary">{item.gpa}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
