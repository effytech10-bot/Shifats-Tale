"use client";

import React, { useState } from "react";
import { faqs } from "@/data/faq";
import { Plus, Minus, Headset } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("f2"); // Start with second one open based on mockup for demo, or null
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="faq" className="w-full">
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* FAQs Stack */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            const number = String(idx + 1).padStart(2, "0");

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                className={`relative rounded-3xl overflow-hidden bg-white transition-all duration-300 ${
                  isOpen 
                    ? "border-2 border-[#EAD5A6] shadow-[0_8px_30px_rgba(234,213,166,0.3)]" 
                    : "border-[1.5px] border-[#F2EFE8] shadow-sm hover:border-[#EAD5A6]/50"
                }`}
              >
                {/* Header/Question tab trigger */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  type="button"
                  className="w-full flex items-center justify-between p-5 sm:p-7 text-left cursor-pointer focus:outline-none bg-white relative z-10"
                >
                  <div className="flex items-center space-x-6 flex-1 pr-6">
                    {/* Number Indicator */}
                    <div className="flex items-center space-x-6">
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,213,166,0.25)_0%,transparent_70%)]" />
                        <span className="relative z-10 font-bold text-[#B58A3F] text-lg font-display">
                          {number}
                        </span>
                      </div>
                      {/* Vertical Divider */}
                      <div className="w-[1.5px] h-8 bg-[#F0EBE0] shrink-0" />
                    </div>

                    {/* Question Text */}
                    <span className="font-extrabold text-[#08132E] text-lg sm:text-xl font-display leading-tight">
                      {faq.question}
                    </span>
                  </div>
                  
                  {/* Rotating toggle icon */}
                  <div
                    className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shadow-sm ${
                      isOpen 
                        ? "bg-gradient-to-br from-[#D2AD60] to-[#B98A33] border-none" 
                        : "bg-white border-[1.5px] border-[#D2AD60] hover:bg-[#FFFBF3]"
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="h-5 w-5 text-white" strokeWidth={3} />
                    ) : (
                      <Plus className="h-5 w-5 text-[#D2AD60]" strokeWidth={2.5} />
                    )}
                  </div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 sm:px-7 sm:pb-7 pt-2 bg-white relative z-0">
                        {/* Inner Answer Box */}
                        <div className="relative bg-gradient-to-br from-[#FFFBF3] to-[#FFFDF9] rounded-2xl border border-[#F4EFE6] p-6 sm:p-8 overflow-hidden">
                          {/* Decorative Background Grid/Lines (Optional) */}
                          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none rounded-tl-full" />
                          <div className="absolute -bottom-12 -right-12 w-48 h-48 border-[1px] border-[#EAD5A6]/20 rounded-full pointer-events-none" />
                          <div className="absolute -bottom-8 -right-8 w-40 h-40 border-[1px] border-[#EAD5A6]/30 rounded-full pointer-events-none" />

                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 relative z-10">
                            {/* Headset Icon Indicator */}
                            <div className="flex items-center space-x-6 sm:space-x-8 shrink-0">
                              <div className="relative flex items-center justify-center w-16 h-16 rounded-full overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,213,166,0.3)_0%,transparent_80%)]" />
                                <div className="absolute inset-0 border border-[#EAD5A6]/30 rounded-full m-1" />
                                <Headset className="w-7 h-7 text-[#B58A3F] relative z-10" strokeWidth={1.5} />
                              </div>
                              {/* Vertical Divider in Answer */}
                              <div className="hidden sm:block w-[1.5px] h-16 bg-[#F0EBE0] shrink-0" />
                            </div>

                            {/* Answer Text */}
                            <div className="text-[#4A5568] text-base sm:text-[1.05rem] leading-relaxed font-medium">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
