"use client";

import React from "react";
import { motion } from "framer-motion";
import { SkillCategory, SectionHeader } from "@/data/about";
import { Terminal, Code, Cpu, FileText, CheckCircle2 } from "lucide-react";

interface TechnicalSkillsSectionProps {
  skills: SkillCategory[];
  header?: SectionHeader;
}

const cardDetails = [
  {
    theme: {
      border: "border-t-[#8B5CF6]",
      gradient: "from-[#8B5CF6] to-[#6D28D9]",
      text: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]",
      number: "01",
    },
  },
  {
    theme: {
      border: "border-t-[#10B981]",
      gradient: "from-[#10B981] to-[#047857]",
      text: "text-[#10B981]",
      bg: "bg-[#10B981]",
      number: "02",
    },
  },
  {
    theme: {
      border: "border-t-[#F59E0B]",
      gradient: "from-[#F59E0B] to-[#B45309]",
      text: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]",
      number: "03",
    },
  },
  {
    theme: {
      border: "border-t-[#3B82F6]",
      gradient: "from-[#3B82F6] to-[#1D4ED8]",
      text: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]",
      number: "04",
    },
  }
];

const getCategoryIcon = (title: string, className: string = "") => {
  if (title.includes("Programming")) return <Terminal className={className} />;
  if (title.includes("Libraries")) return <Code className={className} />;
  if (title.includes("Engineering")) return <Cpu className={className} />;
  if (title.includes("Documentation")) return <FileText className={className} />;
  return <CheckCircle2 className={className} />;
};

export default function TechnicalSkillsSection({ skills, header }: TechnicalSkillsSectionProps) {
  return (
    <section className="py-24 bg-[#FFFCF6] relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FBB503]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#010E62]/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8DDBF]/50 shadow-sm text-[#010E62] text-xs sm:text-sm font-bold tracking-wider uppercase mb-6"
          >
            <Cpu className="w-4 h-4 text-[#FBB503]" />
            {header?.badge || "Core Competencies"}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-[52px] font-extrabold text-[#010E62] mb-6 leading-tight tracking-tight"
          >
            {header?.title1 || "Technical"} {header?.title2 ? <span className="text-[#FBB503]">{header.title2}</span> : ""}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#4A5568] text-[17px] font-medium max-w-2xl mx-auto"
          >
            {header?.description || "A comprehensive overview of my proficiency in programming languages, engineering software, and data analysis tools."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category, index) => {
            const cardData = cardDetails[index % cardDetails.length];
            const { theme } = cardData;
            
            // Use dynamic fields from category, or fallback to sensible defaults
            const description = category.description || "Proficient in these technologies.";
            const progress = category.progress || "80%";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-white rounded-[32px] p-8 shadow-[0_20px_50px_rgba(1,14,98,0.04)] border border-[#E8DDBF]/40 border-t-[6px] ${theme.border} flex flex-col h-full relative group transition-all duration-300 hover:shadow-lg`}
              >
                
                {/* Top Section: Icon & Number */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white shadow-md`}>
                    {getCategoryIcon(category.title, "w-6 h-6")}
                  </div>
                  <div className={`text-3xl font-extrabold ${theme.text} opacity-30 tracking-tighter`}>
                    {theme.number}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-[22px] font-extrabold text-[#010E62] leading-tight mb-3">
                  {category.title.split(" & ").map((word, i, arr) => (
                    <React.Fragment key={i}>
                      {word}
                      {i !== arr.length - 1 && " & "}
                      <br className="hidden lg:block" />
                    </React.Fragment>
                  ))}
                </h3>
                <p className="text-[13px] text-[#718096] font-medium leading-relaxed mb-6">
                  {description}
                </p>

                {/* Skills Pills */}
                <div className="flex flex-wrap gap-2.5 mb-8">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-1.5 bg-white border border-[#E2E8F0] text-[#4A5568] text-[12px] font-bold rounded-full shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Progress Bar (Bottom) */}
                <div className="mt-auto pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-grow h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden flex">
                      {/* Segmented dashed look by rendering multiple divs or a repeating gradient */}
                      <div 
                        className={`h-full ${theme.bg} rounded-full`}
                        style={{ width: progress, "--tw-bg-opacity": 1 } as React.CSSProperties}
                      >
                        <div 
                          className="w-full h-full" 
                          style={{ backgroundImage: 'linear-gradient(to right, transparent 95%, white 95%)', backgroundSize: '20% 100%' }}
                        />
                      </div>
                    </div>
                    <span className={`text-[14px] font-extrabold ${theme.text}`}>
                      {progress}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
