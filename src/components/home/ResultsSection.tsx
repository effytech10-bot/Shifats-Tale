"use client";

import React, { useState } from "react";
import { studentResults } from "@/data/results";
import { GraduationCap, School, User } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type CategoryFilter = "All" | "Engineering" | "University" | "Medical" | "Board";

export default function ResultsSection() {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const shouldReduceMotion = useReducedMotion();

  const filteredResults = studentResults.filter((result) => {
    if (filter === "All") return true;
    return result.examType === filter;
  });

  const filterTabs: { label: string; value: CategoryFilter }[] = [
    { label: "All Success", value: "All" },
    { label: "Engineering", value: "Engineering" },
    { label: "Varsity A Unit", value: "University" },
    { label: "Medical", value: "Medical" },
    { label: "Board GPA 5.00", value: "Board" },
  ];

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
      scale: shouldReduceMotion ? 1 : 0.95, 
      y: shouldReduceMotion ? 0 : 20 
    },
    visible: (idx: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: shouldReduceMotion ? 0 : idx * 0.05,
        ease: "easeOut" as const
      }
    }),
    exit: { 
      opacity: 0, 
      scale: shouldReduceMotion ? 1 : 0.95,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <section id="results" className="brand-section-wrapper bg-bg-soft relative">
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Hall of Fame
          </motion.h2>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Our Student Success Stories
          </motion.p>
          <motion.p
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-text text-sm sm:text-base"
          >
            Real results ND/Holy Cross and leading college candidates secured in BUET, medical colleges, and Dhaka University batches.
          </motion.p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-95 ${
                filter === tab.value
                  ? "bg-accent border-accent text-primary shadow-sm"
                  : "bg-white border-border text-muted hover:text-primary hover:border-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredResults.map((result, idx) => (
              <motion.div
                layout
                variants={cardVariants}
                custom={idx}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={result.id}
                className="brand-card rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-white border border-border relative group hover:-translate-y-1 hover:border-accent/40 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-3">
                  {/* Category Badge & Year */}
                  <div className="flex items-center justify-between">
                    <span className="brand-badge brand-badge-blue group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {result.examType}
                    </span>
                    <span className="text-[11px] text-muted font-bold">
                      Class of {result.year}
                    </span>
                  </div>

                  {/* Student Details with photo placeholder */}
                  <div className="flex items-center space-x-3 pt-2">
                    {/* Student Photo Placeholder */}
                    <div className="w-12 h-12 bg-bg border border-border rounded-full flex items-center justify-center shrink-0 shadow-sm text-primary group-hover:scale-105 transition-transform duration-300">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-primary text-base leading-tight group-hover:text-primary-dark transition-colors">
                        {result.name}
                      </h4>
                      <p className="text-xs text-text flex items-center space-x-1.5 font-semibold mt-1">
                        <School className="h-3.5 w-3.5 text-muted shrink-0" />
                        <span className="truncate max-w-[180px] sm:max-w-none">{result.college}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achieved Rank Info Block */}
                <div className="bg-bg-soft border border-border p-3 rounded-xl flex items-center space-x-2.5 mt-2 group-hover:border-accent/20 transition-colors">
                  <div className="bg-accent/15 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="block text-[9px] text-muted font-bold uppercase tracking-wider leading-none">
                      Secured Rank
                    </span>
                    <span className="text-xs font-bold text-primary mt-1 block">
                      {result.achievement}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
