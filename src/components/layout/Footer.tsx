"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Send, Mail } from "lucide-react";
import { FacebookIcon, YoutubeIcon } from "@/components/ui/Icons";

export default function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        const offsetTop = (targetElement as HTMLElement).offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <footer className="bg-primary border-t border-primary-dark/50 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="brand-container grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* About Section */}
        <div className="space-y-4 col-span-1 md:col-span-1.5">
          <div className="flex items-center space-x-2">
            <div className="bg-white px-3 py-1.5 rounded-xl inline-block relative h-11 w-44 sm:h-12 sm:w-48">
              <Image
                src="/images/logo.png"
                alt="Shifat's Tales Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            A premium personal coaching ecosystem specialized in Physics and Higher Mathematics. Founded and mentored by Md. Zia Uddin Azad Sifat (Shifat Sir). Empowering SSC and HSC science students to build core concepts and score top ranks in university admission tests.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-primary-dark border border-primary-dark/80 text-slate-300 hover:text-accent hover:border-accent/40 transition-all duration-200"
              aria-label="Facebook Page"
            >
              <FacebookIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-primary-dark border border-primary-dark/80 text-slate-300 hover:text-accent hover:border-accent/40 transition-all duration-200"
              aria-label="YouTube Channel"
            >
              <YoutubeIcon className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Quick Links</h3>
          <ul className="space-y-3">
            {[
              { label: "Home Program", href: "#home" },
              { label: "Offered Courses", href: "#courses" },
              { label: "Meet Shifat Sir", href: "#teacher" },
              { label: "Success Results", href: "#results" },
              { label: "Free Video Lectures", href: "#youtube-classes" },
              { label: "Student Login", href: "#login", isPortal: true },
              { label: "Admin Login", href: "#admin-login", isPortal: true },
            ].map((link) => (
              <li key={link.label}>
                {link.isPortal ? (
                  <Link
                    href={link.href}
                    className="text-sm text-slate-300 hover:text-accent transition-colors duration-200 font-semibold"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="text-sm text-slate-300 hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-5">Contact Details</h3>
          <ul className="space-y-4">
            <li className="flex items-start space-x-3 text-sm">
              <Phone className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-200 font-bold">Call/WhatsApp</span>
                <a href="tel:+8801879169446" className="hover:text-accent text-slate-300 transition-colors font-semibold">
                  +880 1879-169446
                </a>
              </div>
            </li>
            <li className="flex items-start space-x-3 text-sm">
              <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-200 font-bold">Email</span>
                <a href="mailto:info@shifatstales.com" className="hover:text-accent text-slate-300 transition-colors font-mono">
                  info@shifatstales.com
                </a>
              </div>
            </li>
            <li className="flex items-start space-x-3 text-sm">
              <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <span className="block text-slate-200 font-bold">Location</span>
                <span className="text-slate-400 text-xs leading-relaxed block mt-0.5">
                  Sekandar & M.P Yusuf Building, 3rd Floor, next to Rangunia College, Rangunia, Chattogram, Bangladesh
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Direct WhatsApp Callout */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white tracking-wider uppercase">Direct Admission Care</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We do not offer automatic online enrollment or payments. To join our programs, please connect directly with Shifat Sir or visit our Rangunia venue.
          </p>
          <a
            href="https://wa.me/8801879169446?text=Hello%20Sir%2C%20I%20would%20like%20to%20know%20more%20about%20the%20admissions."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors duration-200"
          >
            <Send className="h-4 w-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="brand-container mt-16 pt-8 border-t border-primary-dark/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Shifat's Tales — Academic & Admission Care. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with ❤️ for students in Bangladesh
        </p>
      </div>
    </footer>
  );
}
