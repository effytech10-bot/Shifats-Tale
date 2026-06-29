"use client";

import React, { useState } from "react";
import { BookOpen, Code, ArrowRight, X, ExternalLink, Cpu, Database, Layout, PenTool, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResearchThesis, PublicationItem, SkillCategory } from "@/data/about";

interface ResearchSkillsSectionProps {
  thesis: ResearchThesis;
  publications: PublicationItem[];
  skillCategories: SkillCategory[];
}

const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes("language") || name.includes("core")) return <Code className="w-5 h-5" />;
  if (name.includes("frontend") || name.includes("ui")) return <Layout className="w-5 h-5" />;
  if (name.includes("backend") || name.includes("database")) return <Database className="w-5 h-5" />;
  if (name.includes("tool") || name.includes("cloud")) return <Cpu className="w-5 h-5" />;
  if (name.includes("design")) return <PenTool className="w-5 h-5" />;
  return <Lightbulb className="w-5 h-5" />;
};

export const ResearchSkillsSection: React.FC<ResearchSkillsSectionProps> = ({
  thesis,
  publications,
  skillCategories,
}) => {
  const [showPubModal, setShowPubModal] = useState(false);

  return (
    <section className="py-16 lg:py-24 relative z-10">
      <div className="brand-container max-w-7xl mx-auto space-y-16">
        
        {/* =========================================================================
            BENTO GRID LAYOUT
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 auto-rows-[minmax(180px,auto)]">
          
          {/* 1. Research & Thesis - Large Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 lg:row-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden group shadow-2xl"
          >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-accent opacity-10 rounded-full blur-[40px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full justify-between space-y-8">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display">
                  Research Experience
                </h3>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs font-bold uppercase tracking-wider mb-4">
                    {thesis.type}
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2 font-display">
                    &quot;{thesis.title}&quot;
                  </h4>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-white/70 font-medium">
                    <p>Supervisor: <span className="text-white font-bold">{thesis.supervisor}</span></p>
                    <p>Co-supervisor: <span className="text-white font-bold">{thesis.coSupervisors.join(", ")}</span></p>
                  </div>
                </div>

                <ul className="space-y-3 pt-2">
                  {thesis.keyFindings.slice(0, 3).map((finding, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-sm text-white/80 leading-relaxed">
                      <ArrowRight className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowPubModal(true)}
                className="mt-6 w-max inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white text-primary text-sm font-extrabold hover:bg-accent hover:text-primary transition-all duration-300 shadow-lg hover:shadow-accent/20"
              >
                <span>View All Publications</span>
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* 2. Technical Skills - Header/Intro Box */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-xl flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute -right-10 top-10 w-32 h-32 bg-accent/10 rounded-full blur-[30px]" />
            <div className="flex items-center space-x-3 mb-4 relative z-10">
              <div className="p-2.5 rounded-2xl bg-accent/15 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight font-display">
                Technical Toolkit
              </h3>
            </div>
            <p className="text-muted/90 font-medium leading-relaxed relative z-10">
              A comprehensive stack of languages, frameworks, and tools I use to build scalable web applications and intuitive user interfaces.
            </p>
          </motion.div>

          {/* 3. Skill Categories - Bento Items */}
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + (idx * 0.1) }}
              whileHover={{ y: -5 }}
              className={`bg-white border border-[#E7E0D2] rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 group ${idx === 0 ? "lg:col-span-5 lg:row-span-1" : "lg:col-span-3 lg:row-span-1"}`}
            >
              <div className="flex items-center space-x-2 mb-4 text-primary">
                {getCategoryIcon(cat.title)}
                <h4 className="font-extrabold text-sm uppercase tracking-wider">{cat.title}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-bg-soft text-primary text-xs font-bold border border-transparent group-hover:border-[#E7E0D2] transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}

        </div>
      </div>

      {/* Publications Modal Lightbox */}
      <AnimatePresence>
        {showPubModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-primary/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="relative bg-white rounded-[2rem] border border-white/50 shadow-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 text-left flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-[#E7E0D2] pb-4 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-accent/20 text-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-primary font-display">
                    Research Publications
                  </h4>
                </div>
                <button
                  onClick={() => setShowPubModal(false)}
                  className="p-2 rounded-full bg-bg-soft hover:bg-accent/20 text-primary transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                {publications.map((pub, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={pub.id} 
                    className="p-5 rounded-2xl bg-bg-soft/50 border border-[#E7E0D2] space-y-3 hover:border-accent hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex flex-wrap gap-2 items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-accent/20 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-accent/20">
                        {pub.type}
                      </span>
                      {pub.year && <span className="text-xs font-bold text-muted bg-white px-2 py-1 rounded-md border border-[#E7E0D2]">{pub.year}</span>}
                    </div>
                    <h5 className="font-extrabold text-base sm:text-lg text-primary leading-snug">
                      {pub.title}
                    </h5>
                    {pub.venue && (
                      <p className="text-sm text-muted font-semibold flex items-start space-x-2">
                        <span className="w-1 h-1 rounded-full bg-muted mt-2 shrink-0" />
                        <span>{pub.venue}</span>
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

