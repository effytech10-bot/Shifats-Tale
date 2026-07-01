"use client";

import React from "react";
import Image from "next/image";
import { User, Play, GraduationCap, Users, MapPin, Feather } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { profileData as defaultProfileData, ProfileInfo, SocialLink } from "@/data/about";
import { renderSocialIcon } from "@/components/ui/SocialIcons";

interface AboutHeroProps {
  profileData?: ProfileInfo;
}

const renderDynamicIcon = (iconName: string, className: string = "w-5 h-5") => {
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) return <LucideIcons.HelpCircle className={className} />;
  return <IconComponent className={className} />;
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

export const AboutHero: React.FC<AboutHeroProps> = ({ profileData: profile = defaultProfileData }) => {
  return (
    <section className="relative pt-12 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-[#FFF9F2]">
      {/* Background Decor */}
      <div className="absolute top-10 right-20 pointer-events-none opacity-40">
        <svg width="200" height="200" viewBox="0 0 100 100" className="text-accent/30 fill-current">
          <circle cx="20" cy="20" r="3" />
          <circle cx="50" cy="20" r="3" />
          <circle cx="80" cy="20" r="3" />
          <circle cx="20" cy="50" r="3" />
          <circle cx="50" cy="50" r="3" />
          <circle cx="80" cy="50" r="3" />
          <circle cx="20" cy="80" r="3" />
          <circle cx="50" cy="80" r="3" />
          <circle cx="80" cy="80" r="3" />
        </svg>
      </div>

      {/* Scattered background dots/shapes */}
      <div className="absolute top-1/4 left-1/2 w-3 h-3 bg-accent/40 rounded-full" />
      <div className="absolute bottom-1/4 left-10 w-4 h-4 bg-primary/20 rounded-full" />
      <div className="absolute top-1/3 right-10 w-3 h-3 rotate-45 bg-accent" />

      <div className="brand-container relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 xl:gap-16 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: CONTENT
              ========================================================================= */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-7 lg:col-span-7 xl:col-span-6"
          >
            {/* Top Badge */}
            <motion.div variants={fadeUpVariants} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary shrink-0 shadow-sm">
                <User className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[13px] font-extrabold text-primary tracking-[0.15em] uppercase">
                About Me
              </span>
              <div className="h-[1px] w-12 bg-[#E7E0D2]" />
            </motion.div>

            {/* Headers */}
            <motion.div variants={fadeUpVariants} className="space-y-1">
              <p className="text-xl font-bold text-accent">
                {profile.greeting}
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-extrabold text-primary leading-[1.05] font-display tracking-tight">
                {profile.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-text mt-4">
                {profile.subtitle}
              </p>
            </motion.div>

            {/* Summary */}
            <motion.p variants={fadeUpVariants} className="text-[15px] sm:text-base text-primary/70 font-medium max-w-xl leading-relaxed">
              {profile.summary}
            </motion.p>

            {/* 4 Stat Cards */}
            {profile.heroStats && (
              <motion.div variants={fadeUpVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
                {(profile.heroStats || []).map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E7E0D2]/60 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[120px]">
                    <div className="text-primary/60 mb-2">
                      {renderDynamicIcon(stat.iconName, "w-5 h-5")}
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-primary/50 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-[15px] font-extrabold text-primary leading-none mb-1">{stat.value}</p>
                      <p className="text-[9px] font-medium text-primary/50 leading-tight">{stat.subValue}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Social Links */}
            {profile.socialLinks && (
              <motion.div variants={fadeUpVariants} className="flex items-center space-x-5 pt-6">
                <span className="text-base font-extrabold text-primary">Follow Me</span>
                <div className="flex items-center space-x-3">
                  {(profile.socialLinks || []).map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center text-primary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all shadow-sm hover:-translate-y-1"
                    >
                      {renderSocialIcon(social.iconName, "w-4 h-4 sm:w-5 sm:h-5")}
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* =========================================================================
              RIGHT COLUMN: IMAGE & WIDGETS
              ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative lg:h-[650px] flex items-center justify-center lg:justify-end mt-16 lg:mt-0 lg:col-span-5 xl:col-span-5 xl:col-start-8"
          >
            {/* Outline Frame behind image */}
            <div className="absolute top-0 right-0 lg:right-0 xl:right-4 w-[280px] sm:w-[380px] lg:w-[460px] h-[360px] sm:h-[480px] lg:h-[560px] border-[1.5px] border-accent rounded-t-full rounded-b-none pointer-events-none z-0" />
            
            {/* Main Image Mask */}
            <div className="relative w-[280px] sm:w-[380px] lg:w-[460px] h-[360px] sm:h-[480px] lg:h-[560px] rounded-t-full rounded-b-[2rem] overflow-hidden z-10 mt-6 mr-6 lg:mr-6 xl:mr-10 bg-[#FFF3E3]">
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                fill
                priority
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 400px, 500px"
              />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

