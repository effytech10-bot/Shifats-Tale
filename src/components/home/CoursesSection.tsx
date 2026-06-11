"use client";

import React from "react";
import { courses } from "@/data/courses";
import { BookOpen, Calendar, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesSection() {
  const whatsappNumber = "8801879169446";

  return (
    <section id="courses" className="brand-section-wrapper bg-bg relative">
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

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
            Batches & Programs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Offered Batches
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
          >
            Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.
          </motion.p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, idx) => {
            const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hello Sir, I want to inquire about the batch: ${course.title}. Please provide timing and seat availability.`
            )}`;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="brand-card rounded-2xl overflow-hidden flex flex-col justify-between bg-white border border-border group"
              >
                {/* Banner Placeholder */}
                <div className="relative w-full h-44 bg-bg flex flex-col items-center justify-center border-b border-border p-4">
                  <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:12px_12px]" />
                  <div className="bg-white p-3 rounded-full border border-border text-primary shadow-sm mb-2 relative z-10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-xs font-extrabold text-primary relative z-10 uppercase tracking-widest">{course.title} Banner</span>
                  <span className="text-[10px] text-muted relative z-10 mt-0.5">Static Placeholder</span>
                </div>

                {/* Course Details */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Title & Target */}
                    <div className="space-y-1">
                      <span className="brand-badge brand-badge-blue">
                        {course.target}
                      </span>
                      <h3 className="text-lg sm:text-xl font-extrabold text-primary pt-1">
                        {course.title}
                      </h3>
                      <p className="text-xs font-semibold text-muted italic">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text leading-relaxed">
                      {course.description}
                    </p>

                    {/* Class Details */}
                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-primary-dark font-bold border-t border-border">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{course.schedule}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 justify-end">
                        <Clock className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4">
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary-btn w-full flex items-center justify-center space-x-2 text-center"
                    >
                      <Send className="h-4 w-4" />
                      <span>Contact for Details</span>
                    </a>
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
