"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteInfo } from "@/data/site";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "#courses" },
  { label: "Results", href: "#results" },
  { label: "Free Classes", href: "#youtube-classes" },
  { label: "Gallery", href: "/gallery" },
  { label: "Location", href: "#location" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
    setIsOpen(false);
    if (href === "/" && pathname === "/") {
      e.preventDefault();
      const targetElement = document.querySelector("#home");
      if (targetElement) {
        const offsetTop = (targetElement as HTMLElement).offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    if (href.startsWith("#")) {
      if (pathname === "/") {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const offsetTop = (targetElement as HTMLElement).offsetTop - 80; // height of navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/")) {
      return pathname === href;
    }
    return false;
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-soft/90 backdrop-blur-md py-3 shadow-sm border-b border-border/50"
          : "bg-transparent py-5 border-b border-transparent"
      )}
    >
      <div className="brand-container">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href={pathname === "/" ? "#home" : "/"} onClick={(e) => handleLinkClick(e, pathname === "/" ? "#home" : "/")} className="relative h-12 w-48 sm:h-14 sm:w-56 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg">
            <Image
              src="/images/logo_transparent.png"
              alt="Shifat's Tales Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const targetHref = link.href.startsWith("#") && pathname !== "/" ? `/${link.href}` : link.href;
              return (
                <Link
                  key={link.href}
                  href={targetHref}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 select-none",
                    active
                      ? "text-primary bg-accent/20 font-extrabold shadow-xs"
                      : "text-primary-dark/85 hover:text-primary hover:bg-bg/60 hover:scale-[1.04] active:scale-[0.98]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Call to Action CTA */}
          <div className="hidden sm:flex items-center space-x-4">
            <a
              href={`tel:${siteInfo.phone.replace(/[\s-]/g, "")}`}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary-dark hover:scale-[1.04] active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
              title="Call Sir"
            >
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <span className="hidden md:inline">Call Sir</span>
            </a>
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl border-2 border-primary/10 hover:border-primary/30 text-primary text-xs sm:text-sm font-bold hover:bg-primary/5 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Login</span>
            </Link>
            <Link
              href="/register"
              className="primary-btn px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-accent/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-primary hover:text-primary-dark hover:bg-bg/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent hover:scale-[1.05] active:scale-[0.95] transition-all duration-200 relative z-50"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
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
          "lg:hidden fixed inset-y-0 right-0 w-full sm:w-80 bg-bg-soft/98 backdrop-blur-xl border-l border-border/80 shadow-2xl z-40 transform transition-all duration-350 ease-in-out p-6 pt-24",
          isOpen 
            ? "translate-x-0 opacity-100 pointer-events-auto" 
            : "translate-x-full opacity-0 pointer-events-none invisible"
        )}
        id="mobile-menu"
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const targetHref = link.href.startsWith("#") && pathname !== "/" ? `/${link.href}` : link.href;
            return (
              <Link
                key={link.href}
                href={targetHref}
                onClick={(e) => handleLinkClick(e, link.href)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-lg font-bold border-b border-border/40 pb-2.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded",
                  active
                    ? "text-primary font-extrabold pl-2 border-l-4 border-l-accent bg-accent/10 py-1"
                    : "text-primary-dark/90 hover:text-primary hover:pl-2"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-6 flex flex-col space-y-3.5">
            <a
              href={`tel:${siteInfo.phone.replace(/[\s-]/g, "")}`}
              className="flex items-center justify-center space-x-2 py-3 rounded-xl border-2 border-primary/10 bg-primary/5 text-primary font-bold hover:bg-primary/10 hover:text-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Phone className="h-4 w-4" />
              <span>Call Sir Now</span>
            </a>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center space-x-2 py-3 rounded-xl border-2 border-primary/10 bg-primary/5 text-primary font-bold hover:bg-primary/10 hover:text-primary-dark hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Login</span>
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="primary-btn flex items-center justify-center space-x-2 py-3 rounded-xl font-bold shadow-lg shadow-accent/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

