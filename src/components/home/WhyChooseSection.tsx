"use client";

import React from "react";
import { Cpu, NotebookTabs, ClipboardList, MessageCircle, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const benefits: Benefit[] = [
  {
    title: "Personal Guidance",
    description: "Direct mentorship from Shifat Sir, including target goal planning, parent alignment feedback, and personalized tracking.",
    icon: <UserCheck className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Small Batch Environment",
    description: "Intentionally capped intake (max 30 candidates per batch) to make sure no student sits silently with unresolved doubts.",
    icon: <Users className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Weekly Exams",
    description: "Rigorous weekly quizzes, board-standard creative questions, and mock evaluations to build test-taking confidence.",
    icon: <ClipboardList className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Lecture Sheets",
    description: "Curated worksheets, handwritten concept books, and mathematical shortcut checklists compiled directly by Shifat Sir.",
    icon: <NotebookTabs className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Doubt Solving",
    description: "Designated solving classes and active online Q&A groups to answer every individual student query step-by-step.",
    icon: <MessageCircle className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Concept-Based Teaching",
    description: "We focus on the underlying physical laws and mathematical proofs, helping students visualize concepts instead of memorizing.",
    icon: <Cpu className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  }
];

export default function WhyChooseSection() {
  return (
    <section id="why-choose" className="brand-section-wrapper bg-bg-soft relative">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

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
            Our Methodology
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Why Learn with Shifat Sir?
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
          >
            We go beyond standard classroom setups. Our ecosystem focuses on core conceptual depth, solving techniques, and keeping students highly accountable.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="brand-card rounded-2xl p-6 flex flex-col space-y-4 relative group hover:bg-white transition-all duration-300"
            >
              {/* Top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon Container */}
              <div className={`p-3 rounded-xl border shrink-0 w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${benefit.colorClass}`}>
                {benefit.icon}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-sm text-text leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
