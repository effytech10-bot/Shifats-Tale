"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    batch: "hsc-academic",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const whatsappNumber = "8801700000000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the WhatsApp message content based on form input
    const batchName = 
      formData.batch === "hsc-academic" ? "HSC Academic Program" :
      formData.batch === "varsity-admission" ? "University & Engineering Admission Care" :
      formData.batch === "ssc-academic" ? "SSC Academic Care" : "Physics Masterclass";

    const textMessage = `Hello Shifat Sir,\n\nMy name is *${formData.name}*.\nPhone: *${formData.phone}*.\nI want to inquire about the *${batchName}* batch.\n\n*Message:* ${formData.message}`;
    
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;
    
    setSubmitted(true);
    
    // Smooth delay before redirecting to WhatsApp
    setTimeout(() => {
      window.open(waUrl, "_blank");
      setSubmitted(false);
      setFormData({ name: "", phone: "", batch: "hsc-academic", message: "" });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-950/20">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-bold text-amber-500 tracking-widest uppercase"
          >
            Connect Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
          >
            Inquire About Upcoming Batches
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base"
          >
            Fill up the short form below to compile an direct inquiry. Submitting will immediately open a chat with Shifat Sir on WhatsApp.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Quick info column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 lg:pr-8">
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Direct Contact Channels
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                If you prefer to call or email directly rather than fill out the form, feel free to use the details below. We reply to WhatsApp messages within 2-3 hours.
              </p>
            </div>

            {/* Icons list */}
            <div className="space-y-5">
              <a
                href="tel:+8801700000000"
                className="flex items-center space-x-4 p-4 rounded-xl border border-slate-900 bg-slate-950/60 hover:border-slate-800 transition-colors"
              >
                <div className="bg-amber-500/10 p-2.5 rounded-lg text-amber-500 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">Phone Calls</span>
                  <span className="block font-bold text-slate-200 text-sm sm:text-base">+880 1700-000000</span>
                </div>
              </a>

              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-xl border border-slate-900 bg-slate-950/60 hover:border-slate-800 transition-colors"
              >
                <div className="bg-emerald-500/10 p-2.5 rounded-lg text-emerald-500 shrink-0">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">WhatsApp Direct</span>
                  <span className="block font-bold text-slate-200 text-sm sm:text-base">Click to Chat Now</span>
                </div>
              </a>

              <a
                href="mailto:info@shifatstales.com"
                className="flex items-center space-x-4 p-4 rounded-xl border border-slate-900 bg-slate-950/60 hover:border-slate-800 transition-colors"
              >
                <div className="bg-blue-500/10 p-2.5 rounded-lg text-blue-400 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-semibold uppercase tracking-wider">Email Inquiry</span>
                  <span className="block font-bold text-slate-200 text-sm sm:text-base font-mono">info@shifatstales.com</span>
                </div>
              </a>
            </div>

            <div className="text-xs text-slate-500 leading-relaxed border-t border-slate-900 pt-6">
              * Note: For seat reservation, visiting the Farmgate center during schedule hours and completing offline enrollment confirmation is required.
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 glass-card rounded-2xl p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              
              {/* Name field */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-slate-300">
                  Your Full Name / Parent's Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-amber-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-slate-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  placeholder="e.g. 017XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-amber-500 focus:outline-none text-white text-sm transition-all"
                />
              </div>

              {/* Batch selection */}
              <div className="space-y-2">
                <label htmlFor="batch" className="block text-xs sm:text-sm font-semibold text-slate-300">
                  Target Program / Batch
                </label>
                <select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-amber-500 focus:outline-none text-white text-sm transition-all"
                >
                  <option value="hsc-academic">HSC Academic Program (Physics & Math)</option>
                  <option value="varsity-admission">University & Engineering Admission Care</option>
                  <option value="ssc-academic">SSC Academic Care (Science Core)</option>
                  <option value="physics-special">Physics Masterclass (Concept Builder)</option>
                </select>
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-slate-300">
                  Message / Inquiries
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Let Sir know if you have specific timing queries or academic targets..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-900 focus:border-amber-500 focus:outline-none text-white text-sm transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/10 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitted ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Opening WhatsApp chat...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" />
                    <span>Send Inquiry to Sir</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
