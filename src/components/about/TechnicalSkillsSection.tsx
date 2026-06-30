"use client";

import React from "react";
import { motion } from "framer-motion";
import { SkillCategory } from "@/data/about";
import { Terminal, Code, Cpu, FileText, CheckCircle2 } from "lucide-react";

interface TechnicalSkillsSectionProps {
  skills: SkillCategory[];
}

const getCategoryIcon = (title: string) => {
  if (title.includes("Programming")) return <Terminal className="w-5 h-5" />;
  if (title.includes("Libraries")) return <Code className="w-5 h-5" />;
  if (title.includes("Engineering")) return <Cpu className="w-5 h-5" />;
  if (title.includes("Documentation")) return <FileText className="w-5 h-5" />;
  return <CheckCircle2 className="w-5 h-5" />;
};

export default function TechnicalSkillsSection({ skills }: TechnicalSkillsSectionProps) {
  return (
    <section className="py-24 bg-[#FFFCF2] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FBB503]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#010E62]/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4" />

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#010E62]/5 border border-[#010E62]/10 text-[#010E62] text-sm font-bold tracking-wider uppercase mb-6"
          >
            <Cpu className="w-4 h-4 text-[#FBB503]" />
            Core Competencies
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-[#010E62] mb-6"
          >
            Technical <span className="text-[#FBB503]">Expertise</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#4A5568] text-lg font-medium"
          >
            A comprehensive overview of my proficiency in programming languages, engineering software, and data analysis tools.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {skills.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(1,14,98,0.08)] border border-[#E8DDBF] hover:border-[#FBB503]/50 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
            >
              {/* Card accent line */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#010E62] to-[#FBB503] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#FFF9F2] border border-[#E8DDBF] text-[#010E62] flex items-center justify-center group-hover:bg-[#010E62] group-hover:text-white transition-colors duration-300 shadow-inner group-hover:shadow-[0_10px_20px_rgba(1,14,98,0.2)]">
                  {getCategoryIcon(category.title)}
                </div>
                <h3 className="text-xl font-extrabold text-[#010E62] leading-tight group-hover:text-[#FBB503] transition-colors">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2.5 mt-auto">
                {category.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3.5 py-1.5 bg-[#FFF9F2] border border-[#E8DDBF] text-[#010E62] text-[13px] font-bold rounded-xl group-hover:bg-[#010E62]/5 group-hover:border-[#010E62]/20 transition-colors duration-300 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
