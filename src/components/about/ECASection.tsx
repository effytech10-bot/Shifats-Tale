"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ECAItem, SectionHeader } from "@/data/about";
import { Calendar, MapPin, ChevronRight, Activity, GraduationCap, Bot, ChevronLeft, Briefcase } from "lucide-react";

interface ECASectionProps {
  ecaItems: ECAItem[];
  header?: SectionHeader;
}

export default function ECASection({ ecaItems, header }: ECASectionProps) {
  const defaultHeader = {
    badge: "Beyond Academics",
    title1: "Extracurricular",
    title2: "Activities",
    description: "Leadership, organizational involvement, and professional roles outside the core academic curriculum."
  };
  
  const displayBadge = header?.badge || defaultHeader.badge;
  const displayTitle1 = header?.title1 || defaultHeader.title1;
  const displayTitle2 = header?.title2 !== undefined ? header.title2 : defaultHeader.title2;
  const displayDesc = header?.description || defaultHeader.description;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const totalPages = Math.max(1, Math.ceil(ecaItems.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = ecaItems.slice(startIndex, startIndex + itemsPerPage);

  // Theme configuration for the cards
  const getThemeColors = (theme?: string) => {
    switch (theme) {
      case "blue":
        return {
          border: "border-l-[#2563EB]",
          iconBg: "bg-[#EFF6FF]",
          iconColor: "text-[#2563EB]",
          tagBg: "bg-[#EFF6FF]",
          tagText: "text-[#2563EB]",
        };
      case "green":
        return {
          border: "border-l-[#16A34A]",
          iconBg: "bg-[#F0FDF4]",
          iconColor: "text-[#16A34A]",
          tagBg: "bg-[#F0FDF4]",
          tagText: "text-[#16A34A]",
        };
      case "purple":
        return {
          border: "border-l-[#9333EA]",
          iconBg: "bg-[#FAF5FF]",
          iconColor: "text-[#9333EA]",
          tagBg: "bg-[#FAF5FF]",
          tagText: "text-[#9333EA]",
        };
      case "yellow":
      default:
        return {
          border: "border-l-[#FBB503]",
          iconBg: "bg-[#FFFDF5]",
          iconColor: "text-[#FBB503]",
          tagBg: "bg-[#FFFDF5]",
          tagText: "text-[#FBB503]",
        };
    }
  };

  const renderIcon = (iconName?: string, className?: string) => {
    switch (iconName) {
      case "GraduationCap": return <GraduationCap className={className} />;
      case "Bot": return <Bot className={className} />;
      default: return <Briefcase className={className} />;
    }
  };

  return (
    <section className="py-24 bg-[#FFFDF8] relative overflow-hidden font-sans">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#FBB503]/5 rounded-full blur-3xl pointer-events-none translate-x-1/2" />
      
      <div className="brand-container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-[#E8DDBF]/50 text-[#010E62] text-[13px] font-bold tracking-wider uppercase mb-5"
          >
            <Activity className="w-4 h-4 text-[#FBB503]" />
            {displayBadge}
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-[#010E62] mb-6 tracking-tight leading-tight"
          >
            {displayTitle1} {displayTitle2 && <span className="text-[#FBB503]">{displayTitle2}</span>}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[17px] text-[#4A5568] leading-relaxed font-medium"
          >
            {displayDesc}
          </motion.p>
        </div>

        {/* Cards List */}
        <div className="flex flex-col gap-10">
          <AnimatePresence mode="wait">
            {currentItems.map((item, index) => {
              const theme = getThemeColors(item.colorTheme);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className={`bg-white rounded-[32px] shadow-[0_20px_50px_rgba(1,14,98,0.04)] border-y border-r border-[#E8DDBF]/40 border-l-[10px] ${theme.border} flex flex-col md:flex-row overflow-hidden group`}
                >
                  {/* Left Content Area */}
                  <div className="flex-grow p-8 md:p-10 flex flex-col justify-center">
                    
                    <div className="flex items-start gap-6 mb-8">
                      {/* Icon Box */}
                      <div className={`w-[72px] h-[72px] rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-sm shrink-0 border border-white`}>
                        {renderIcon(item.iconName, `w-9 h-9 ${theme.iconColor}`)}
                      </div>
                      
                      {/* Header Info */}
                      <div className="pt-1">
                        {item.tag && (
                          <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase mb-3 ${theme.tagBg} ${theme.tagText}`}>
                            {item.tag}
                          </span>
                        )}
                        <h3 className="text-[28px] font-extrabold text-[#010E62] leading-tight mb-2">
                          {item.role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[#010E62]/90 font-bold text-[17px]">
                            {item.organization}
                          </span>
                          <span className="text-[#4A5568] bg-[#F1F5F9] px-3 py-0.5 rounded-full text-[13px] font-bold">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Meta Details */}
                    <div className="flex flex-wrap items-center gap-y-2 text-[14px] font-semibold text-[#4A5568] mb-8">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#718096]" />
                        <span>{item.startDate} – {item.endDate}</span>
                      </div>
                      <span className="mx-3 text-[#CBD5E1]">•</span>
                      <div className="flex items-center gap-1.5">
                        <span>{item.duration}</span>
                      </div>
                      <span className="mx-3 text-[#CBD5E1]">•</span>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#718096]" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Attachment Box */}
                    {item.attachment && (
                      <div className="flex items-center gap-5 p-3 pr-6 rounded-2xl bg-[#F9FAFB] border border-[#E2E8F0]/60 max-w-xl group/attach cursor-pointer hover:bg-white hover:shadow-md hover:border-[#E8DDBF] transition-all duration-300">
                        <div className="w-[100px] h-[64px] rounded-xl overflow-hidden relative shrink-0">
                          <Image
                            src={item.attachment.imageUrl}
                            alt={item.attachment.caption}
                            fill
                            className="object-cover group-hover/attach:scale-105 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="font-extrabold text-[#010E62] text-[15px] truncate">
                            {item.attachment.caption}
                          </p>
                          {item.attachment.description && (
                            <p className="text-[#4A5568] text-[13px] font-medium mt-0.5 truncate">
                              {item.attachment.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Image Area */}
                  {item.coverImage && (
                    <div className="w-full md:w-[380px] lg:w-[420px] shrink-0 relative min-h-[300px] md:min-h-full">
                      {/* The curved mask container */}
                      <div className="absolute inset-0 md:py-6 md:pr-6 pl-0 md:pl-4">
                        <div className="w-full h-full relative rounded-[32px] md:rounded-l-[80px] md:rounded-r-3xl overflow-hidden shadow-inner group-hover:shadow-lg transition-shadow duration-500">
                          <Image
                            src={item.coverImage}
                            alt={item.role}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#010E62]/40 to-transparent mix-blend-overlay" />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Functional Pagination */}
        <div className="flex justify-center items-center gap-2 mt-16">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#718096] hover:bg-white hover:text-[#010E62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-full text-[14px] font-bold flex items-center justify-center transition-all ${
                  page === currentPage ? "bg-[#010E62] text-white shadow-md" : "text-[#718096] hover:bg-white hover:text-[#010E62]"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#718096] hover:bg-white hover:text-[#010E62] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
