"use client";

import React, { useState } from "react";
import { faqs } from "@/data/faq";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  return (
    <div id="faq" className="w-full">
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* FAQs Stack */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : idx * 0.05 }}
                className="brand-card rounded-2xl overflow-hidden bg-white border border-border transition-all hover:border-accent/25 hover:shadow-sm duration-300"
              >
                {/* Header/Question tab trigger */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  type="button"
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer hover:bg-bg-soft/20 focus:outline-none transition-colors"
                >
                  <span className="font-extrabold text-primary text-base sm:text-lg pr-4">
                    {faq.question}
                  </span>
                  
                  {/* Rotating toggle icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="shrink-0 p-1.5 bg-bg border border-border rounded-lg text-primary hover:text-primary transition-colors duration-200"
                  >
                    {isOpen ? <Minus className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-primary" />}
                  </motion.div>
                </button>

                {/* Collapsible Answer */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-7 border-t border-border pt-4 text-text text-sm sm:text-base leading-relaxed bg-bg-soft/10">
                        {faq.answer}
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
