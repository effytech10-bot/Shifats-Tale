"use client";

import React from "react";
import { Cpu, NotebookTabs, ShieldAlert, Award, Headphones, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
}

const benefits: Benefit[] = [
  {
    title: "Concept Visualization",
    description: "Instead of raw formulas, we utilize interactive 3D simulations and graphing models to demonstrate concepts in Mechanics, Optics, and Calculus.",
    icon: <Cpu className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Exclusive Hand Notes",
    description: "Access curated handwritten summary notes, calculus roadmap sheets, and shortcut banks compiled directly by Shifat Sir, updated every session.",
    icon: <NotebookTabs className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Small Capped Batches",
    description: "Strict limit of 25-30 students per offline batch. This guarantees that Sir can personally guide and answer queries from every attendee.",
    icon: <UserCheck className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Rigorous Evaluation",
    description: "Weekly structured quiz sheets, board CQ mock tests, and intensive admission-level diagnostics with individual error analysis sheets.",
    icon: <Award className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Dedicated Doubt Resolvers",
    description: "Access to designated Telegram solving groups where students can submit queries, answered promptly with handwritten solutions.",
    icon: <Headphones className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
  {
    title: "Direct Parents Support",
    description: "Direct tracking, performance updates, and scheduled counseling sessions to align students' academic schedules with their goals.",
    icon: <ShieldAlert className="h-6 w-6" />,
    colorClass: "text-primary bg-bg border-border",
  },
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
