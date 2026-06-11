"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone, BookOpen, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Courses", href: "#courses" },
  { label: "Why Us", href: "#why-choose" },
  { label: "Meet Sir", href: "#teacher" },
  { label: "Results", href: "#results" },
  { label: "Free Classes", href: "#youtube-classes" },
  { label: "Reviews", href: "#testimonials" },
  { label: "FAQs", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const offsetTop = (targetElement as HTMLElement).offsetTop - 80; // height of navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "glass-nav py-3 shadow-lg"
          : "bg-transparent py-5 border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="#home" onClick={(e) => handleLinkClick(e, "#home")} className="flex items-center space-x-2 group">
            <div className="bg-amber-500 p-2 rounded-lg text-slate-900 font-bold flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors duration-300">
                Shifat's Tales
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider uppercase font-semibold leading-none">
                Academic & Admission Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-amber-400 rounded-md transition-all duration-200 hover:bg-slate-800/40"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Call to Action CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="tel:+8801700000000"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-semibold hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 shadow-sm"
            >
              <Phone className="h-4 w-4" />
              <span>Call Sir</span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="flex items-center space-x-1.5 px-4.5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-955 text-sm font-bold shadow-md hover:shadow-amber-500/25 transition-all duration-300 text-slate-950"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Inquire Batch</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/50 focus:outline-none transition-colors duration-200"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-y-0 right-0 w-full sm:w-80 bg-slate-950/95 backdrop-blur-xl border-l border-slate-800/60 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out p-6 pt-24",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        id="mobile-menu"
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-lg font-semibold text-slate-300 hover:text-amber-400 border-b border-slate-900 pb-2 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col space-y-3">
            <a
              href="tel:+8801700000000"
              className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-amber-500/40 bg-amber-500/5 text-amber-400 font-semibold hover:bg-amber-500 hover:text-slate-950 transition-all duration-200"
            >
              <Phone className="h-4 w-4" />
              <span>Call Sir Now</span>
            </a>
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/10"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Message Sir</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
