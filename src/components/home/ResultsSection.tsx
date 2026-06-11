"use client";

import React, { useState } from "react";
import { studentResults } from "@/data/results";
import { GraduationCap, School, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryFilter = "All" | "Engineering" | "University" | "Medical" | "Board";

export default function ResultsSection() {
  const [filter, setFilter] = useState<CategoryFilter>("All");

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

  return (
    <section id="results" className="brand-section-wrapper bg-bg-soft relative">
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Hall of Fame
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Our Student Success Stories
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              className={`px-4.5 py-2.5 text-xs sm:text-sm font-bold rounded-full border transition-all duration-350 cursor-pointer ${
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
          <AnimatePresence mode="popLayout">
            {filteredResults.map((result) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={result.id}
                className="brand-card rounded-2xl p-5 flex flex-col justify-between space-y-4 bg-white border border-border relative group"
              >
                <div className="space-y-3">
                  {/* Category Badge & Year */}
                  <div className="flex items-center justify-between">
                    <span className="brand-badge brand-badge-blue">
                      {result.examType}
                    </span>
                    <span className="text-[11px] text-muted font-bold">
                      Class of {result.year}
                    </span>
                  </div>

                  {/* Student Details with photo placeholder */}
                  <div className="flex items-center space-x-3 pt-2">
                    {/* Student Photo Placeholder */}
                    <div className="w-12 h-12 bg-bg border border-border rounded-full flex items-center justify-center shrink-0 shadow-sm text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-primary text-base leading-tight">
                        {result.name}
                      </h4>
                      <p className="text-xs text-text flex items-center space-x-1.5 font-semibold mt-1">
                        <School className="h-3.5 w-3.5 text-muted shrink-0" />
                        <span className="truncate max-w-[150px]">{result.college}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achieved Rank Info Block */}
                <div className="bg-bg-soft border border-border p-3 rounded-xl flex items-center space-x-2.5 mt-2">
                  <div className="bg-accent/15 p-2 rounded-lg">
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
