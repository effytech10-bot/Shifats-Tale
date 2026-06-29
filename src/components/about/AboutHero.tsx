"use client";

import React from "react";
import Image from "next/image";
import { User, Play, GraduationCap, Users, MapPin, Feather } from "lucide-react";
import { motion } from "framer-motion";
import { ProfileInfo, SocialLink } from "@/data/about";

interface AboutHeroProps {
  profile: ProfileInfo;
}

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.1 8.4 2 10.2 2 12s.1 3.6.5 4.9a4 4 0 0 0 2.8 2.8c1.3.4 4 .5 6.7.5s5.4-.1 6.7-.5a4 4 0 0 0 2.8-2.8c.4-1.3.5-3.1.5-4.9s-.1-3.6-.5-4.9a4 4 0 0 0-2.8-2.8C17.4 4 14.7 3.9 12 3.9s-5.4.1-6.7.5a4 4 0 0 0-2.8 2.8z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const renderSocialIcon = (iconName: SocialLink["iconName"], className: string = "w-4 h-4") => {
  switch (iconName) {
    case "Facebook": return <FacebookIcon className={className} />;
    case "Instagram": return <InstagramIcon className={className} />;
    case "Youtube": return <YoutubeIcon className={className} />;
    case "Linkedin": return <LinkedinIcon className={className} />;
    case "Twitter": return <TwitterIcon className={className} />;
    default: return null;
  }
};

const renderStatIcon = (iconName: string, className: string = "w-5 h-5") => {
  switch (iconName) {
    case "GraduationCap": return <GraduationCap className={className} />;
    case "Users": return <Users className={className} />;
    case "Youtube": return <YoutubeIcon className={className} />;
    case "MapPin": return <MapPin className={className} />;
    default: return <User className={className} />;
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const AboutHero: React.FC<AboutHeroProps> = ({ profile }) => {
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
                Md. Zia Uddin<br />Azad Sifat
              </h1>
              <p className="text-xl font-bold text-accent pt-3">
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
                {profile.heroStats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-[#E7E0D2]/60 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 min-h-[120px]">
                    <div className="text-primary/60 mb-2">
                      {renderStatIcon(stat.iconName, "w-5 h-5")}
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
                  {profile.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border border-[#E7E0D2] flex items-center justify-center text-primary/70 hover:bg-accent hover:text-primary hover:border-accent transition-all shadow-sm hover:-translate-y-1"
                    >
                      {renderSocialIcon(link.iconName, "w-4 h-4 sm:w-5 sm:h-5")}
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

            {/* Quote Box (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute bottom-10 -left-6 sm:-left-12 lg:-left-24 xl:-left-28 bg-primary text-white p-6 sm:p-8 max-w-[280px] sm:max-w-[320px] shadow-2xl z-20"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
                borderRadius: "24px"
              }}
            >
              <div className="text-accent font-serif text-[60px] leading-none absolute top-4 left-6 opacity-90 h-10">
                &ldquo;
              </div>
              <p className="relative z-10 text-[13px] sm:text-sm font-medium leading-relaxed mt-6 pb-2">
                {profile.quote}
              </p>
              <p className="mt-2 font-display text-accent text-xl sm:text-2xl pb-4" style={{ fontFamily: "cursive" }}>
                Shifat
              </p>
            </motion.div>

            {/* Circular Badge (Bottom Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1, type: "spring" }}
              className="absolute -bottom-4 lg:bottom-4 -right-2 sm:-right-6 lg:-right-8 w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-full shadow-xl z-20 flex flex-col items-center justify-center text-center p-4 border border-[#E7E0D2]/30"
            >
              <div className="w-10 h-10 rounded-full border border-accent flex items-center justify-center mb-2">
                <Feather className="w-4 h-4 text-accent" />
              </div>
              <p className="text-[8px] sm:text-[9px] font-extrabold text-primary uppercase tracking-widest leading-tight">
                Guiding Minds<br />Inspiring Hearts
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

