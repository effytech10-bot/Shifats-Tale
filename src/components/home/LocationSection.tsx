"use client";

import React from "react";
import { MapPin, Compass, Train } from "lucide-react";
import { motion } from "framer-motion";

export default function LocationSection() {
  const mapUrl = "https://maps.google.com/maps?q=Rangunia%20Government%20College,%20Chattogram&t=&z=16&ie=UTF8&iwloc=&output=embed";
  const directionUrl = "https://maps.google.com/?q=Rangunia+Government+College+Chattogram";

  return (
    <section id="location" className="brand-section-wrapper bg-bg relative">
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

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
            Location
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight"
          >
            Visit Our Offline Facility
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text text-sm sm:text-base"
          >
            Classes are conducted in a clean, fully air-conditioned and high-tech facility near Rangunia College, Chattogram.
          </motion.p>
        </div>

        {/* Location Box grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 brand-card rounded-2xl p-6 sm:p-8 bg-white border border-border">
            <div className="space-y-6">
              {/* Address Box */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-accent/15 p-2.5 rounded-xl text-primary shrink-0 mt-0.5">
                  <MapPin className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-primary text-base sm:text-lg">Physical Venue</h4>
                  <p className="text-sm text-text mt-1.5 leading-relaxed font-medium">
                    Sekandar & M.P Yusuf Building, 3rd Floor, next to Rangunia College, Rangunia, Chattogram, Bangladesh
                  </p>
                </div>
              </div>

              {/* Transit/Directions */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-accent/15 p-2.5 rounded-xl text-primary shrink-0 mt-0.5">
                  <Train className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-primary text-base sm:text-lg">How to reach</h4>
                  <p className="text-sm text-text mt-1.5 leading-relaxed font-medium">
                    Conveniently located next to Rangunia College in Rangunia, Chattogram. Easily accessible from all parts of Rangunia by local transport (CNG/bus).
                  </p>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-start space-x-3.5">
                <div className="bg-accent/15 p-2.5 rounded-xl text-primary shrink-0 mt-0.5">
                  <Compass className="h-5.5 w-5.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-primary text-base sm:text-lg">Security & Amenities</h4>
                  <p className="text-sm text-text mt-1.5 leading-relaxed font-medium">
                    CCTV monitored secure campus. Filtered drinking water, clean separate washrooms, and high-speed projector visual lecture screens.
                  </p>
                </div>
              </div>
            </div>

            {/* Directions CTA */}
            <div className="pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <a
                href={directionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn w-full flex items-center justify-center text-center font-bold"
              >
                <span>Get Direction</span>
              </a>
              <a
                href="tel:+8801879169446"
                className="secondary-btn w-full flex items-center justify-center text-center font-bold"
              >
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-border h-[320px] lg:h-auto min-h-[350px] relative glow-accent-gold shadow-sm bg-white">
            <iframe
              title="Shifat's Tales Physical Venue Map"
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0 grayscale opacity-85 contrast-[1.05] hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              allowFullScreen={false}
              loading="lazy"
            />
            {/* Map Placeholder Tag */}
            <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-white border border-border rounded-lg shadow-sm text-[10px] text-primary font-bold uppercase tracking-wider">
              Google Map Placeholder
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
