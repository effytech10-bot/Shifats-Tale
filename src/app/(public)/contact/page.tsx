import { Metadata } from "next";
import InnerPageHero from "@/components/layout/InnerPageHero";
import ContactSection from "@/components/home/ContactSection";
import LocationSection from "@/components/home/LocationSection";
import FAQSection from "@/components/home/FAQSection";
import React from "react";
import { getPageSection } from "@/features/website-cms/actions/content-actions";

export const metadata: Metadata = {
  title: "Contact & FAQ | Shifat's Tales",
  description: "Get in touch with Shifat's Tales Academic & Admission Care. We are here to help with your queries.",
};

export default async function ContactPage() {
  const heroData = await getPageSection("CONTACT", "CONTACT_HERO");
  const contactInfo = await getPageSection("CONTACT", "CONTACT_INFO");
  const contactFaq = await getPageSection("CONTACT", "CONTACT_FAQ");

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
            eyebrow={heroData?.eyebrow || "GET IN TOUCH"}
            title={
              <>
                <span className="block text-white">{heroData?.title || "Contact &"}</span>
                <span className="block text-accent mt-1">{heroData?.subtitle || "FAQ"}</span>
              </>
            }
            description={heroData?.description || "Have questions? We are here to help you with anything related to our courses, batches, and admission processes."}
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Contact Me" }
            ]}
            imageSrc={heroData?.mediaUrl || "/images/gallery-classroom.png"}
          />
        </section>

        {/* =========================================================================
            SECTION 2: CONTACT FORM & LOCATION
            ========================================================================= */}
        <div className="space-y-16">
          <ContactSection />
          <LocationSection infoData={contactInfo} />
        </div>

        {/* =========================================================================
            SECTION 3: FAQ
            ========================================================================= */}
        <div>
          <FAQSection faqData={contactFaq} />
        </div>

      </div>
    </div>
  );
}
