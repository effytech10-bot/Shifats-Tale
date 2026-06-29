"use client";

import React, { useState } from "react";
import { Award, ExternalLink, ShieldCheck, X, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrainingItem } from "@/data/about";

interface IndustrialTrainingBannerProps {
  training: TrainingItem;
}

export const IndustrialTrainingBanner: React.FC<IndustrialTrainingBannerProps> = ({ training }) => {
  const [showModal, setShowModal] = useState(false);

  if (!training) return null;

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden bg-primary text-white mt-10">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
      
      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />

      {/* Top and Bottom Gold Borders */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />

      <div className="brand-container max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Content Area */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Award className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Industrial Experience
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display leading-tight">
                {training.title}
              </h3>
              <div className="flex items-center space-x-3 text-lg font-medium text-white/90">
                <span className="px-3 py-1 bg-white/10 rounded-lg">{training.organization}</span>
                <span className="text-white/40">•</span>
                <span className="text-accent">{training.duration}</span>
              </div>
            </div>

            <p className="text-base lg:text-lg text-white/70 leading-relaxed font-medium max-w-2xl">
              {training.description}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Hands-on technical exposure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span>Industry-standard practices</span>
              </div>
            </div>

            {/* View Certificate Button */}
            <div className="pt-6">
              <button
                onClick={() => setShowModal(true)}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-extrabold text-primary bg-accent rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(251,181,3,0.8)] active:scale-95"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>View Official Certificate</span>
                  <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
              </button>
            </div>
          </motion.div>

          {/* Right Graphic Certificate Mockup Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="lg:col-span-5 flex items-center justify-center lg:justify-end"
          >
            <div
              onClick={() => setShowModal(true)}
              className="relative w-full max-w-[380px] aspect-[1.4/1] rounded-[2rem] bg-white p-6 text-primary shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] border-4 border-white/20 hover:border-accent/60 transform hover:-translate-y-4 hover:rotate-2 transition-all duration-500 cursor-pointer group flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle texture for certificate */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="relative z-10 flex items-center justify-between border-b-2 border-[#E7E0D2] pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-6 w-6 text-accent" />
                  <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider">Official Certificate</span>
                </div>
                <span className="text-[10px] font-bold text-muted bg-bg-soft px-2 py-1 rounded-md">BTCL</span>
              </div>

              <div className="relative z-10 text-center py-4 space-y-2">
                <h4 className="text-sm font-extrabold text-primary uppercase tracking-widest">CERTIFICATE OF COMPLETION</h4>
                <p className="text-xs text-muted font-semibold">{training.duration} Industrial Training</p>
                <div className="mx-auto w-12 h-1 bg-accent/20 rounded-full mt-2" />
                <p className="text-[10px] text-primary/80 font-extrabold uppercase mt-2">Bangladesh Telecommunication Company Limited</p>
              </div>

              <div className="relative z-10 flex justify-between items-end border-t-2 border-[#E7E0D2] pt-3">
                <div className="w-10 h-10 rounded-full border-2 border-accent/40 flex items-center justify-center bg-accent/5">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <span className="text-[10px] font-bold text-primary group-hover:text-accent transition-colors flex items-center space-x-1.5 bg-bg-soft px-3 py-1.5 rounded-full">
                  <span>Click to verify</span>
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Certificate Modal Lightbox */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[2.5rem] border border-white/10 shadow-2xl max-w-3xl w-full p-8 sm:p-12 space-y-8 text-center flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-bg-soft hover:bg-accent/20 text-primary transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="w-20 h-20 rounded-full bg-accent/10 text-primary mx-auto flex items-center justify-center border-4 border-accent shadow-[0_0_30px_rgba(251,181,3,0.3)]">
                <Award className="h-10 w-10 text-accent" />
              </div>
              
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-muted">
                  Verified Training Document
                </span>
                <h5 className="font-extrabold text-2xl sm:text-3xl text-primary font-display">
                  {training.title}
                </h5>
                <p className="text-sm sm:text-base font-bold text-primary/70 inline-block px-4 py-2 bg-bg-soft rounded-lg">
                  {training.organization} &bull; {training.duration}
                </p>
              </div>
              
              <div className="p-6 bg-bg-soft/50 rounded-2xl border border-[#E7E0D2] mx-auto max-w-xl">
                <p className="text-sm sm:text-base text-text/80 leading-relaxed font-medium">
                  {training.description}
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="primary-btn px-8 py-3 text-sm shadow-lg hover:shadow-accent/40 rounded-xl"
                >
                  Close Certificate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

