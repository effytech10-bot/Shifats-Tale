"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Trophy, ChevronLeft, ChevronRight, Award, Star } from "lucide-react";
import { topStudentsData } from "@/data/top-students";

export default function TopOfTheMonthSection({ topStudentsData: dynamicData }: { topStudentsData?: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const displayData = dynamicData?.content?.months && dynamicData.content.months.length > 0
    ? dynamicData.content.months
    : topStudentsData;

  const currentMonth = displayData[currentIndex] || displayData[0];

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? displayData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === displayData.length - 1 ? 0 : prev + 1));
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.9,
      };
    },
  };

  return (
    <section className="relative py-24 sm:py-32 bg-[#FFFCF2] overflow-hidden" id="top-students">
      {/* Premium Background Elements */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FBB503]/30 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#FBB503]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#010E62]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center space-x-2 bg-white border border-[#FBB503]/30 rounded-full px-5 py-2 shadow-sm mb-6"
          >
            <Crown className="w-5 h-5 text-[#FBB503]" />
            <span className="text-sm font-extrabold text-[#010E62] uppercase tracking-wider">Top of the Month</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#010E62] tracking-tight mb-6"
          >
            Celebrating <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#010E62] to-[#FBB503]">Excellence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#4A5568] font-medium"
          >
            Recognizing the outstanding achievements and hard work of our top-performing students every month.
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Main content area */}
          <div className="relative w-full">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="w-full"
              >
                {/* Month Title */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center justify-center gap-4">
                    <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#FBB503]"></div>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#010E62]">
                      {currentMonth.monthName}
                    </h3>
                    <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#FBB503]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 px-4 md:px-8">
                  {currentMonth?.students?.map((student: any, idx: number) => (
                    <div
                      key={student.id || idx}
                      className="group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(251,181,3,0.15)] border border-[#E8DDBF]/50 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
                    >
                      {/* Premium Card Glow */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FBB503]/10 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110 duration-700" />
                      <div className="absolute top-6 right-6 opacity-5 pointer-events-none transition-transform group-hover:rotate-12 duration-700">
                        <Trophy size={120} />
                      </div>
                      
                      {/* Image Container */}
                      <div className="relative w-36 h-36 md:w-40 md:h-40 mb-8 mt-4 z-10">
                        {/* Glow ring behind */}
                        <div className="absolute inset-0 bg-[#FBB503] rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        
                        <div className="relative w-full h-full rounded-full overflow-hidden border-[6px] border-white shadow-[0_0_0_2px_rgba(251,181,3,0.3)] bg-[#FFFCF2]">
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        
                        {/* Floating Badge */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#010E62] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-[0_4px_12px_rgba(1,14,98,0.3)] flex items-center gap-1.5 border border-[#010E62]/80">
                          <Star className="w-3.5 h-3.5 text-[#FBB503] fill-[#FBB503]" />
                          Top Achiever
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 w-full flex-1 flex flex-col">
                        <div className="mb-6">
                          <div className="inline-block px-4 py-1.5 bg-[#FFF8E6] text-[#010E62] text-xs font-extrabold rounded-xl mb-4 border border-[#FBB503]/20">
                            {student.batch}
                          </div>
                          <h4 className="text-2xl md:text-3xl font-extrabold text-[#010E62] mb-2 group-hover:text-[#FBB503] transition-colors duration-300">
                            {student.name}
                          </h4>
                          <p className="text-[15px] text-[#4A5568] font-medium px-4">
                            {student.college}
                          </p>
                        </div>
                        
                        <div className="w-full bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DDBF]/60 mt-auto shadow-sm group-hover:border-[#FBB503]/30 transition-colors duration-300">
                          <div className="flex flex-col items-center gap-1.5">
                            <Award className="w-6 h-6 text-[#FBB503] mb-1" />
                            <p className="text-base font-extrabold text-[#010E62]">
                              {student.achievement}
                            </p>
                            <p className="text-sm font-bold text-[#FBB503]">
                              Score: {student.score}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-6 mt-4 sm:mt-8 relative z-20">
            <button
              onClick={handlePrevious}
              className="w-14 h-14 rounded-full bg-white border border-[#E8DDBF] shadow-sm flex items-center justify-center text-[#010E62] hover:text-[#FBB503] hover:border-[#FBB503] hover:bg-[#FFF8E6] transition-all hover:scale-110 active:scale-95"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-7 h-7" strokeWidth={2.5} />
            </button>
            
            <div className="flex gap-2.5 items-center">
              {topStudentsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? "w-10 h-3 bg-[#FBB503]"
                      : "w-3 h-3 bg-[#E8DDBF] hover:bg-[#010E62]/40"
                  }`}
                  aria-label={`Go to month ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-14 h-14 rounded-full bg-white border border-[#E8DDBF] shadow-sm flex items-center justify-center text-[#010E62] hover:text-[#FBB503] hover:border-[#FBB503] hover:bg-[#FFF8E6] transition-all hover:scale-110 active:scale-95"
              aria-label="Next Month"
            >
              <ChevronRight className="w-7 h-7" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}