"use client";

import React from "react";
import { courses } from "@/data/courses";
import { Check, Calendar, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesSection() {
  const whatsappNumber = "8801700000000"; // Sir's phone number

  return (
    <section id="courses" className="brand-section-wrapper bg-bg relative">
      {/* Background decoration */}
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
            Academic & Admission Batches
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
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
                className="brand-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative group bg-white border border-border"
              >
                <div className="space-y-6">
                  {/* Title & Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="brand-badge brand-badge-blue">
                        {course.target}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary group-hover:text-primary transition-colors">
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

                  {/* Class Logistics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border">
                    <div className="flex items-center space-x-2 text-xs font-bold text-primary-dark">
                      <Calendar className="h-4 w-4 text-accent shrink-0" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-primary-dark">
                      <Clock className="h-4 w-4 text-accent shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                  </div>

                  {/* Key Syllabus Points */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-primary-dark uppercase tracking-wider block">
                      Program Inclusions:
                    </span>
                    <ul className="grid grid-cols-1 gap-2.5">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-text">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
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
                    className="primary-btn w-full flex items-center justify-center space-x-2 text-center"
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
