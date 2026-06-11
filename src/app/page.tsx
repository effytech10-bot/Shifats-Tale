import React from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustStats from "@/components/home/TrustStats";
import CoursesSection from "@/components/home/CoursesSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import TeacherSection from "@/components/home/TeacherSection";
import ResultsSection from "@/components/home/ResultsSection";
import YouTubeClassesSection from "@/components/home/YouTubeClassesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GallerySection from "@/components/home/GallerySection";
import FAQSection from "@/components/home/FAQSection";
import LocationSection from "@/components/home/LocationSection";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-900">
      {/* Dynamic Header Navbar */}
      <Navbar />

      {/* Main Sections Body */}
      <main className="flex-grow">
        <HeroSection />
        <TrustStats />
        <CoursesSection />
        <WhyChooseSection />
        <TeacherSection />
        <ResultsSection />
        <YouTubeClassesSection />
        <TestimonialsSection />
        <GallerySection />
        <FAQSection />
        <LocationSection />
        <ContactSection />
      </main>

      {/* Page Layout Footer */}
      <Footer />
    </div>
  );
}
