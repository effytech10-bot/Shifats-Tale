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
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden border border-border glow-accent-gold group bg-white shadow-sm"
            >
              {/* Soft overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/65 via-transparent to-transparent opacity-70 z-10" />

              <Image
                src="/images/shifat_sir.png"
                alt="Adnan Bin Wahid - Shifat Sir"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-103"
                sizes="(max-w-768px) 100vw, 380px"
                priority
              />

              {/* Float Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-border flex items-center justify-between shadow-md">
                <div>
                  <span className="block font-bold text-sm text-primary">Adnan Bin Wahid</span>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider leading-none">Shifat Sir</span>
                </div>
                <span className="bg-accent text-primary text-[10px] font-extrabold px-2 py-1 rounded">
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
                Meet the Mentor
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

            {/* Teaching Credentials List */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2.5">
                <Award className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-sm text-primary">8+ Years</span>
                  <span className="text-xs text-muted font-medium">Coaching Experience</span>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <Users className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-sm text-primary">1,500+ Students</span>
                  <span className="text-xs text-muted font-medium">Mentored Personally</span>
                </div>
              </div>
            </div>

            {/* Personal Statement / Letter */}
            <div className="space-y-4 text-text text-sm sm:text-base leading-relaxed border-l-2 border-accent pl-4 py-1 italic">
              <p>
                "At Shifat's Tales, I don't believe in rote memorization. Physics and Mathematics are not just sets of formulas to copy down; they are stories of how the world functions. When you understand the logic behind a river-boat vector math or a mechanics collision problem, you don't need to memorize anything."
              </p>
              <p>
                "Every single student gets my personal focus. We keep class batches intentionally small so that no one sits silently with an unsolved doubt. Whether you are aiming to pass your board exams with a solid A+ or preparing to score a top rank in the BUET admission tests, I am here to walk that path with you."
              </p>
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
                <span>Discuss Admission with Sir</span>
              </a>
              <a
                href="tel:+8801700000000"
                className="secondary-btn flex items-center justify-center space-x-2 w-full sm:w-auto"
              >
                <span>Call Directly</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
