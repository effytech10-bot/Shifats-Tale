"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { FacebookIcon, YoutubeIcon } from "@/components/ui/Icons";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    studentName: "",
    studentClass: "",
    interestedCourse: "ssc-academic",
    phone: "",
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

    const textMessage = `Hello Shifat Sir,\n\n*Lead Form Submission*\n\nStudent Name: *${formData.studentName}*\nClass/Batch: *${formData.studentClass}*\nInterested Batch: *${courseName}*\nPhone Number: *${formData.phone}*\n\n*Message:* ${formData.message}`;
    
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

  return (
    <section id="contact" className="brand-section-wrapper bg-bg-soft relative">
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="brand-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold text-accent tracking-widest uppercase"
          >
            Connect Now
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Inquire About Upcoming Batches
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
          >
            Fill out the short form below to compile an direct inquiry. Submitting will immediately open a chat with Shifat Sir on WhatsApp.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Quick info column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 lg:pr-8">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                Direct Contact Channels
              </h3>
              <p className="text-text text-sm leading-relaxed">
                If you prefer to call, write, or visit the center directly rather than fill out the form, feel free to use the credentials below.
              </p>
            </div>

            {/* Icons list */}
            <div className="space-y-4">
              {/* Phone */}
              <a
                href="tel:+8801700000000"
                className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-white hover:border-accent transition-all shadow-sm"
              >
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">Phone Calls</span>
                  <span className="block font-extrabold text-primary text-sm sm:text-base">+880 1700-000000</span>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-white hover:border-accent transition-all shadow-sm"
              >
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0">
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
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3.5 rounded-xl border border-border bg-white hover:border-accent transition-all shadow-sm"
                >
                  <FacebookIcon className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-primary-dark">Facebook</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3.5 rounded-xl border border-border bg-white hover:border-accent transition-all shadow-sm"
                >
                  <YoutubeIcon className="h-4.5 w-4.5 text-primary" />
                  <span className="text-xs font-bold text-primary-dark">YouTube</span>
                </a>
              </div>

              {/* Office hours */}
              <div className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-white shadow-sm">
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">Office Hours</span>
                  <span className="block font-extrabold text-primary text-sm sm:text-base">Daily 4:00 PM - 9:00 PM</span>
                </div>
              </div>

              {/* Address info */}
              <div className="flex items-start space-x-4 p-4 rounded-xl border border-border bg-white shadow-sm">
                <div className="bg-accent/15 p-2.5 rounded-lg text-primary shrink-0 mt-0.5">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[10px] text-muted font-bold uppercase tracking-wider">Office Address</span>
                  <span className="block font-extrabold text-primary text-xs leading-relaxed mt-0.5">
                    2nd Floor, Green View Tower, Farmgate, Dhaka
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7 brand-card rounded-2xl p-6 sm:p-8 bg-white border border-border">
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none text-text text-sm font-medium transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none text-text text-sm font-medium transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none text-text text-sm font-semibold transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none text-text text-sm font-medium transition-all"
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
                  className="w-full px-4 py-3 rounded-xl bg-bg-soft border border-border focus:border-accent focus:bg-white focus:outline-none text-text text-sm font-medium transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitted}
                className="primary-btn w-full flex items-center justify-center space-x-2 text-center disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
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
          </div>

        </div>
      </div>
    </section>
  );
}
