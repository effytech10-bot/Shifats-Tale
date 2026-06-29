import { Metadata } from "next";
import InnerPageHero from "@/components/layout/InnerPageHero";
import ContactSection from "@/components/home/ContactSection";
import LocationSection from "@/components/home/LocationSection";
import FAQSection from "@/components/home/FAQSection";
import React from "react";

export const metadata: Metadata = {
  title: "Contact & FAQ | Shifat's Tales",
  description: "Get in touch with Shifat's Tales Academic & Admission Care. We are here to help with your queries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F2] pt-24 pb-20 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-full h-[400px]">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full">
           <path d="M0,200 C300,100 700,300 1000,200" fill="none" stroke="#FBB503" strokeWidth="2"/>
           <path d="M0,220 C300,120 700,320 1000,220" fill="none" stroke="#FBB503" strokeWidth="1"/>
        </svg>
      </div>

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* =========================================================================
            SECTION 1: INNER PAGE HERO
            ========================================================================= */}
        <section className="mb-0">
          <InnerPageHero 
            eyebrow="GET IN TOUCH"
            title={
              <>
                <span className="block text-white">Contact &</span>
                <span className="block text-accent mt-1">FAQ</span>
              </>
            }
            description="Have questions? We are here to help you with anything related to our courses, batches, and admission processes."
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Contact Me" }
            ]}
            imageSrc="/images/gallery-classroom.png"
          />
        </section>

        {/* =========================================================================
            SECTION 2: CONTACT FORM & LOCATION
            ========================================================================= */}
        <div className="space-y-16">
          <ContactSection />
          <LocationSection />
        </div>

        {/* =========================================================================
            SECTION 3: FAQ
            ========================================================================= */}
        <div>
          <FAQSection />
        </div>

      </div>
    </div>
  );
}
