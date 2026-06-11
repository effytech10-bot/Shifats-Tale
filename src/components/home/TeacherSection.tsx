"use client";

import React from "react";
import Image from "next/image";
import { Award, GraduationCap, Users, Calendar, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherSection() {
  const whatsappLink = "https://wa.me/8801700000000?text=Hello%20Shifat%20Sir%2C%20I%20would%2520like%20to%20discuss%20admissions%20for%20my%20child%20/ myself.";

  return (
    <section id="teacher" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Teacher Image/Badge Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square rounded-2xl overflow-hidden border border-slate-800 glow-blue group"
            >
              {/* Soft overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />

              <Image
                src="/images/shifat_sir.png"
                alt="Adnan Bin Wahid - Shifat Sir"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-w-768px) 100vw, 380px"
                priority
              />

              {/* Float Tag */}
              <div className="absolute bottom-4 left-4 right-4 z-20 glass-card p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="block font-bold text-sm text-white">Adnan Bin Wahid</span>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Shifat Sir</span>
                </div>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded">
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
                className="text-sm font-bold text-amber-500 tracking-widest uppercase"
              >
                Meet the Mentor
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
              >
                Adnan Bin Wahid (Shifat Sir)
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-amber-500/90 text-sm font-semibold flex items-center gap-1.5"
              >
                <GraduationCap className="h-4.5 w-4.5 text-amber-500" />
                <span>B.Sc. in Engineering | Physics & Mathematics Specialist</span>
              </motion.p>
            </div>

            {/* Teaching Credentials List */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start space-x-2.5">
                <Award className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-sm text-white">8+ Years</span>
                  <span className="text-xs text-slate-500">Coaching Experience</span>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <Users className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-sm text-white">1,500+ Students</span>
                  <span className="text-xs text-slate-500">Mentored Personally</span>
                </div>
              </div>
            </div>

            {/* Personal Statement / Letter */}
            <div className="space-y-4 text-slate-350 text-sm leading-relaxed border-l-2 border-amber-500/40 pl-4 py-1 italic">
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
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Discuss Admission with Sir</span>
              </a>
              <a
                href="tel:+8801700000000"
                className="flex items-center justify-center space-x-2 w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold text-sm transition-colors"
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
