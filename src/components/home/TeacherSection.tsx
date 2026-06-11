"use client";

import React from "react";
import Image from "next/image";
import { Award, GraduationCap, Users, Send } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { siteInfo, teachingMethods } from "@/data/site";

// Dynamically import the 3D scene with SSR disabled for optimal bundle performance
const HeroScene = dynamic(() => import("../three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  ),
});

interface TeacherSectionProps {
  isTeacherFlying?: boolean;
}

export default function TeacherSection({ isTeacherFlying = false }: TeacherSectionProps) {
  const whatsappLink = `https://wa.me/${siteInfo.whatsapp}?text=Hello%20${encodeURIComponent(siteInfo.teacherName.split(" ").pop()!)}%20Sir%2C%20I%20would%20like%20to%20discuss%2520admissions%20for%20myself%20/%20my%20child.`;
  const shouldReduceMotion = useReducedMotion();

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      }
    }
  };

  const gridItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <section id="teacher" className="brand-section-wrapper bg-bg relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Teacher Image/Badge Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            {/* Transparent 3D Canvas + Image wrapper */}
            <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-[1/1.2] flex items-end justify-center rounded-2xl overflow-hidden z-10">
              {/* 3D Scene Layer (only on large displays for best performance) */}
              <div className="absolute inset-0 z-0 hidden md:block w-full h-full pointer-events-none">
                <HeroScene />
              </div>

              {/* Bottom shadow / fade transition to blend crop edge into cream bg */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-bg via-bg/80 to-transparent z-10 pointer-events-none" />
              
              {/* Radial shadows & ambient gold/blue glows behind photo for perfect 3D integration */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-1/4 bg-primary/15 rounded-full blur-2xl z-0 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-accent/8 rounded-full blur-[80px] z-0 pointer-events-none" />

              {/* Teacher photo with filter drop-shadow to pop out */}
              <motion.div
                id="teacher-section-photo"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ 
                  opacity: isTeacherFlying ? 0 : 1,
                  scale: 1,
                  y: 0
                }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full flex items-end justify-center z-10 select-none pointer-events-auto transition-opacity duration-200"
              >
                <Image
                  src="/images/sir_photo_clean.png"
                  alt={siteInfo.teacherName}
                  fill
                  sizes="(max-width: 768px) 280px, 340px"
                  className="object-contain object-bottom filter drop-shadow-[0_16px_32px_rgba(1,14,98,0.22)]"
                  priority
                />
              </motion.div>
            </div>

            {/* Compact Designation Tag under portrait */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 z-20 text-center w-full max-w-[280px] sm:max-w-[340px] bg-white border border-border p-3.5 rounded-xl shadow-sm hover:border-accent/30 hover:shadow-md transition-all duration-300"
            >
              <span className="block text-accent font-extrabold text-[10px] sm:text-xs uppercase tracking-widest">
                Instructor & CEO
              </span>
              <h4 className="font-extrabold text-base sm:text-lg text-primary mt-1">
                {siteInfo.teacherName}
              </h4>
              <span className="block text-xs text-muted font-bold mt-0.5">
                EEE, CUET
              </span>
            </motion.div>
          </div>

          {/* Teacher Info/Letter Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <motion.h2
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-xs font-bold text-accent tracking-widest uppercase"
              >
                Meet Your Teacher
              </motion.h2>
              <motion.h3
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
              >
                {siteInfo.teacherName}
              </motion.h3>
              <motion.p
                variants={headerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-primary-dark text-sm font-semibold flex items-center gap-1.5"
              >
                <GraduationCap className="h-4.5 w-4.5 text-accent animate-bounce" style={{ animationDuration: "3s" }} />
                <span>{siteInfo.teacherSpecialty}</span>
              </motion.p>
            </div>

            {/* Short Bio */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-text text-sm sm:text-base leading-relaxed"
            >
              {siteInfo.teacherBio}
            </motion.p>

            {/* Teaching Method Cards */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-primary-dark uppercase tracking-wider">
                Our Teaching Methodology:
              </span>
              <motion.div 
                variants={gridContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {teachingMethods.map((method, i) => (
                  <motion.div
                    key={i}
                    variants={gridItemVariants}
                    className="brand-card p-4 bg-white border border-border rounded-xl space-y-1.5 shadow-sm hover:border-accent hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span className="block font-extrabold text-primary text-sm">{method.title}</span>
                    <span className="block text-xs text-muted leading-relaxed font-semibold">{method.desc}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn flex items-center justify-center space-x-2 w-full sm:w-auto text-center hover:shadow-md hover:scale-[1.01] transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Contact Sir</span>
              </a>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
