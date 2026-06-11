"use client";

import React, { useState } from "react";
import { studentResults, StudentResult } from "@/data/results";
import { Award, GraduationCap, School, MapPin } from "lucide-react";
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
    <section id="results" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/20 relative">
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-bold text-amber-500 tracking-widest uppercase"
          >
            Hall of Fame
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Our Student Success Stories
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Authentic highlights of ND/Holy Cross and leading college candidates who secured positions in BUET, Medicals, and Dhaka University under Sir's mentorship.
          </motion.p>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4.5 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-300 ${
                filter === tab.value
                  ? "bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/15"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
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
                className="glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-300 relative group"
              >
                <div className="space-y-3">
                  {/* Category Badge & Year */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                      {result.examType}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Class of {result.year}
                    </span>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors">
                      {result.name}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center space-x-1.5 font-medium">
                      <School className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{result.college}</span>
                    </p>
                  </div>
                </div>

                {/* Achieved Rank Info Block */}
                <div className="bg-slate-900/60 border border-slate-850 p-3 rounded-xl flex items-center space-x-2.5 mt-2">
                  <div className="bg-amber-500/10 p-2 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none">
                      Secured Rank
                    </span>
                    <span className="text-xs font-bold text-slate-200 mt-1 block">
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
