"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { EducationItem } from "@/data/about";
import { GraduationCap } from "lucide-react";

interface EducationTimelineProps {
  education: EducationItem[];
}

export const EducationTimeline: React.FC<EducationTimelineProps> = ({ education }) => {
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
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Academic Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            Education
          </h2>
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
                  <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 border-accent -ml-3.5 md:-ml-4 z-20 shadow-md group-hover:scale-125 group-hover:border-primary transition-transform duration-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-[45%] pl-14 md:pl-0 ${isEven ? "md:pr-14 md:text-right" : "md:pl-14 md:text-left"}`}>
                    <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[1.5rem] border border-white shadow-[0_10px_40px_-10px_rgba(1,14,98,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(1,14,98,0.15)] transition-all duration-300 hover:-translate-y-2 group-hover:border-accent/40 relative">
                      
                      {/* Year Badge */}
                      <div className={`absolute top-0 -translate-y-1/2 ${isEven ? "md:right-8" : "md:left-8"} px-4 py-1.5 rounded-full bg-primary text-accent text-sm font-extrabold shadow-lg`}>
                        {item.year}
                      </div>

                      <div className="space-y-2 pt-2">
                        <h4 className="font-extrabold text-xl sm:text-2xl text-primary font-display leading-tight">
                          {item.degree}
                        </h4>
                        <p className="text-sm sm:text-base text-muted font-bold">
                          {item.institution}
                        </p>
                        {item.gpa && (
                          <div className={`inline-flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-lg mt-3 ${isEven ? "md:justify-end" : ""}`}>
                            <span className="text-xs font-bold text-muted uppercase">GPA / Class</span>
                            <span className="text-sm font-extrabold text-primary">{item.gpa}</span>
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
