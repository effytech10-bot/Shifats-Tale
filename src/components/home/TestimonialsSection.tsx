"use client";

import React from "react";
import { testimonials } from "@/data/testimonials";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

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
            Testimonials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            What Parents & Students Say
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Honest feedback from students who achieved Board A+ and cracked engineering university admissions under Shifat Sir's guidance.
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative hover:border-slate-700 transition-all duration-300 group"
            >
              {/* Double quote background icon */}
              <Quote className="absolute right-6 top-6 h-12 w-12 text-slate-900 group-hover:text-slate-800 transition-colors pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Quote Content */}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* User Identity Info */}
              <div className="pt-6 border-t border-slate-900 mt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {t.name}
                  </h4>
                  <span className="text-xs text-slate-500 block">
                    {t.batch}
                  </span>
                </div>
                
                {t.achievement && (
                  <span className="text-[10px] sm:text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 max-w-[200px] text-right truncate">
                    {t.achievement}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
