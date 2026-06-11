"use client";

import React from "react";
import { courses } from "@/data/courses";
import { Check, Calendar, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesSection() {
  const whatsappNumber = "8801700000000"; // Sir's phone number

  return (
    <section id="courses" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

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
            Batches & Programs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Academic & Admission Batches
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Select the appropriate batch to jumpstart your conceptual mastery. Capped batch sizes ensure personalized focus for every single student.
          </motion.p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course, idx) => {
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              course.whatsappText
            )}`;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                {/* Accent glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 via-transparent to-amber-500/0 group-hover:from-blue-500/5 group-hover:to-amber-500/5 transition-all duration-300 pointer-events-none" />

                <div className="space-y-6">
                  {/* Title & Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
                        {course.target}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 italic">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Class Logistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-900">
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-300">
                      <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Key Syllabus Points */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Program Inclusions:
                    </span>
                    <ul className="grid grid-cols-1 gap-2.5">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-300">
                          <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="pt-8">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl border border-amber-500/20 bg-slate-950 text-amber-400 font-bold hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 shadow-md group-hover:border-amber-500"
                  >
                    <Send className="h-4 w-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
