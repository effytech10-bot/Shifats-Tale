"use client";

import React from "react";
import { MapPin, Compass, Train } from "lucide-react";
import { motion } from "framer-motion";
import { siteInfo } from "@/data/site";

export default function LocationSection() {
  const mapUrl = siteInfo.googleMapEmbedUrl;
  const directionUrl = siteInfo.googleMapDirectionUrl;

  return (
    <div id="location" className="w-full">
      <div className="w-full relative z-10">
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
                    {siteInfo.address}
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
                    Conveniently located {siteInfo.nearbyLandmark} in Rangunia. Easily accessible from all parts of the area by local transport (CNG/bus).
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
    </div>
  );
}
