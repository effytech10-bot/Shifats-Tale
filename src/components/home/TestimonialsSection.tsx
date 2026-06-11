"use client";

import React from "react";
import { testimonials } from "@/data/testimonials";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="brand-section-wrapper bg-bg-soft relative">
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

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
            Testimonials
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            What Parents & Students Say
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
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
              className="brand-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative bg-white border border-border group"
            >
              {/* Double quote background icon - very subtle */}
              <Quote className="absolute right-6 top-6 h-12 w-12 text-bg transition-colors pointer-events-none" />

              <div className="space-y-4 relative z-10">
                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                {/* Quote Content */}
                <p className="text-text text-sm sm:text-base leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* User Identity Info */}
              <div className="pt-6 border-t border-border mt-6 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-primary text-sm sm:text-base">
                    {t.name}
                  </h4>
                  <span className="text-xs text-muted block">
                    {t.batch}
                  </span>
                </div>
                
                {t.achievement && (
                  <span className="text-[10px] sm:text-xs font-bold text-primary bg-bg px-2.5 py-1 rounded-lg border border-border max-w-[200px] text-right truncate">
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
