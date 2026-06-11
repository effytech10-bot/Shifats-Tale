"use client";

import React from "react";
import Image from "next/image";
import { Award, GraduationCap, Users, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherSection() {
  const whatsappLink = "https://wa.me/8801700000000?text=Hello%20Shifat%20Sir%2C%20I%20would%2520like%20to%20discuss%20admissions%20for%20my%20child%20/ myself.";

  return (
    <section id="teacher" className="brand-section-wrapper bg-bg relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="brand-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Teacher Image/Badge Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden border border-border group bg-white shadow-sm flex flex-col justify-between p-6"
            >
              {/* Photo Grid backdrop */}
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />

              <div className="flex-grow flex flex-col items-center justify-center space-y-4 py-8 relative z-10">
                <div className="bg-bg p-6 rounded-full border border-border text-primary shadow-sm">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <span className="block font-extrabold text-primary text-base">Teacher Photo Placeholder</span>
                  <span className="block text-xs text-muted font-semibold">Adnan Bin Wahid (Shifat Sir)</span>
                </div>
              </div>

              {/* Float Tag */}
              <div className="bg-bg-soft border border-border p-3 rounded-xl flex items-center justify-between shadow-sm relative z-10">
                <div>
                  <span className="block font-bold text-xs text-primary">Adnan Bin Wahid</span>
                  <span className="block text-[8px] text-muted font-bold uppercase tracking-wider leading-none">Shifat Sir</span>
                </div>
                <span className="bg-accent text-primary text-[9px] font-extrabold px-2.5 py-1 rounded">
                  Lead Mentor
                </span>
              </div>
            </motion.div>
          </div>

          {/* Teacher Info/Letter Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xs font-bold text-accent tracking-widest uppercase"
              >
                Meet Your Teacher
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
              >
                Adnan Bin Wahid (Shifat Sir)
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-primary-dark text-sm font-semibold flex items-center gap-1.5"
              >
                <GraduationCap className="h-4.5 w-4.5 text-accent" />
                <span>B.Sc. in Engineering | Physics & Mathematics Specialist</span>
              </motion.p>
            </div>

            {/* Short Bio */}
            <p className="text-text text-sm sm:text-base leading-relaxed">
              Hello, I am Adnan Bin Wahid (Shifat Sir). For over a decade, I have guided college and secondary science group students in Dhaka to master core Physics and Higher Mathematics. My goal is to make learning concept-driven and systematic, transforming complicated exam materials into easily solvable challenges.
            </p>

            {/* Teaching Method Cards */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-primary-dark uppercase tracking-wider">
                Our Teaching Methodology:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Concept-First Learning", desc: "Prioritizing complete visualization of scientific laws before solving formulas." },
                  { title: "Chapter-Wise Problem Solving", desc: "Systematic mastery of textbook exercises and math shortcuts chapter by chapter." },
                  { title: "Board Question Practice", desc: "Intensive drills using past test banks and creative question templates." },
                  { title: "Weak Student Support", desc: "Tailored doubt resolution slots and parent sync reports for student accountability." }
                ].map((method, i) => (
                  <div
                    key={i}
                    className="brand-card p-4 bg-white border border-border rounded-xl space-y-1.5 shadow-sm hover:border-accent transition-colors duration-200"
                  >
                    <span className="block font-extrabold text-primary text-sm">{method.title}</span>
                    <span className="block text-xs text-muted leading-relaxed font-semibold">{method.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn flex items-center justify-center space-x-2 w-full sm:w-auto text-center"
              >
                <Send className="h-4 w-4" />
                <span>Contact Sir</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
