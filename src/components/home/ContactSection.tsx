"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { FacebookIcon, YoutubeIcon } from "@/components/ui/Icons";
import { motion, useReducedMotion } from "framer-motion";
import { siteInfo } from "@/data/site";

export default function ContactSection({ infoData }: { infoData?: any }) {
  const content = infoData?.content || {};
  const phone = content.phone || siteInfo.phone;
  const whatsappNumber = content.whatsapp || siteInfo.whatsapp;
  const officeHours = content.officeHours || siteInfo.officeHours;
  const facebookUrl = content.facebookUrl || siteInfo.facebookUrl;
  const youtubeUrl = content.youtubeUrl || siteInfo.youtubeUrl;
  const address = content.address || siteInfo.address;

  const [formData, setFormData] = useState({
    studentName: "",
    studentClass: "",
    interestedCourse: "ssc-academic",
    phone: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert course id to friendly name
    const coursesMap: Record<string, string> = {
      "ssc-academic": "SSC Academic Batch",
      "hsc-academic": "HSC Academic Batch",
      "admission-prep": "Admission Preparation",
      "math-special": "Math Special Batch",
      "physics-special": "Physics Special Batch",
      "crash-course": "Revision Crash Course",
    };

    const courseName = coursesMap[formData.interestedCourse] || formData.interestedCourse;

    const textMessage = `Hello ${siteInfo.teacherName.split(" ").pop()!} Sir,\n\n*Lead Form Submission*\n\nStudent Name: *${formData.studentName}*\nClass/Batch: *${formData.studentClass}*\nInterested Batch: *${courseName}*\nPhone Number: *${formData.phone}*\n\n*Message:* ${formData.message}`;
    
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textMessage)}`;
    
    setSubmitted(true);
    
    setTimeout(() => {
      window.open(waUrl, "_blank");
      setSubmitted(false);
      setFormData({
        studentName: "",
        studentClass: "",
        interestedCourse: "ssc-academic",
        phone: "",
        message: "",
      });
    }, 1500);
  };

  const headerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const }
    }
  };

  const columnVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  return (
    <div id="contact" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Quick info column */}
          <motion.div 
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:pr-8"
          >
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                Direct Contact Channels
              </h3>
              <p className="text-text text-sm leading-relaxed font-semibold">
                If you prefer to call, write, or visit the center directly rather than fill out the form, feel free to use the credentials below.
              </p>
            </div>

            {/* Icons list */}
            <div className="space-y-4">
              {/* Phone */}
                <a
                  href={`tel:${phone.replace(/[\s-]/g, "")}`}
                  className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-white hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 transition-all duration-200 shadow-sm group"
                >
                  <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0 group-hover:scale-105 transition-transform duration-200">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">Phone Calls</span>
                    <span className="block font-extrabold text-primary text-sm sm:text-base">{phone}</span>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-white hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 transition-all duration-200 shadow-sm group"
              >
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">WhatsApp Chat</span>
                  <span className="block font-extrabold text-primary text-sm sm:text-base">Chat with Sir</span>
                </div>
              </a>

                {/* Social Pages */}
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3.5 rounded-xl border border-border bg-white hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 transition-all duration-200 shadow-sm group"
                  >
                    <FacebookIcon className="h-4.5 w-4.5 text-primary group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-bold text-primary-dark">Facebook</span>
                  </a>
                  <a
                    href={youtubeUrl}
                    target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3.5 rounded-xl border border-border bg-white hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 transition-all duration-200 shadow-sm group"
                >
                  <YoutubeIcon className="h-4.5 w-4.5 text-primary group-hover:scale-105 transition-transform" />
                  <span className="text-xs font-bold text-primary-dark">YouTube</span>
                </a>
              </div>

              {/* Office hours */}
              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-white shadow-sm hover:-translate-y-0.5 hover:border-accent/20 transition-all duration-200 group">
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">Office Hours</span>
                  <span className="block font-extrabold text-primary text-sm sm:text-base">{officeHours}</span>
                </div>
              </div>

              {/* Address info */}
              <div className="flex items-start space-x-4 p-4 rounded-xl border border-border bg-white shadow-sm hover:-translate-y-0.5 hover:border-accent/20 transition-all duration-200 group">
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">Office Address</span>
                  <span className="block font-extrabold text-primary text-xs leading-relaxed mt-0.5">
                    {address}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.div 
            variants={columnVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 brand-card rounded-2xl p-6 sm:p-8 bg-white border border-border hover:shadow-md hover:border-accent/10 transition-all duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              
              {/* Student Name */}
              <div className="space-y-2">
                <label htmlFor="studentName" className="block text-xs sm:text-sm font-bold text-primary-dark">
                  Student Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  required
                  placeholder="Enter student's full name"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15 text-text text-sm font-medium transition-all"
                />
              </div>

              {/* Class */}
              <div className="space-y-2">
                <label htmlFor="studentClass" className="block text-xs sm:text-sm font-bold text-primary-dark">
                  Class
                </label>
                <input
                  type="text"
                  id="studentClass"
                  name="studentClass"
                  required
                  placeholder="e.g. Class 10 / HSC 2026"
                  value={formData.studentClass}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15 text-text text-sm font-medium transition-all"
                />
              </div>

              {/* Interested Course */}
              <div className="space-y-2">
                <label htmlFor="interestedCourse" className="block text-xs sm:text-sm font-bold text-primary-dark">
                  Interested Course
                </label>
                <select
                  id="interestedCourse"
                  name="interestedCourse"
                  value={formData.interestedCourse}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15 text-text text-sm font-semibold transition-all cursor-pointer"
                >
                  <option value="ssc-academic">SSC Academic Batch</option>
                  <option value="hsc-academic">HSC Academic Batch</option>
                  <option value="admission-prep">Admission Preparation</option>
                  <option value="math-special">Math Special Batch</option>
                  <option value="physics-special">Physics Special Batch</option>
                  <option value="crash-course">Revision Crash Course</option>
                </select>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs sm:text-sm font-bold text-primary-dark">
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15 text-text text-sm font-medium transition-all"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-xs sm:text-sm font-bold text-primary-dark">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Let Sir know if you have specific timing queries or academic targets..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/15 text-text text-sm font-medium transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitted}
                className="primary-btn w-full flex items-center justify-center space-x-2 text-center disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform duration-100"
              >
                {submitted ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Sending Query...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4.5 w-4.5" />
                    <span>Send Query</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

      </div>
    </div>
  );
}
