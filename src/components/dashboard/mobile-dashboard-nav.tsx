"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudentSidebar } from "./student-sidebar";
import { TeacherSidebar } from "./teacher-sidebar";

interface MobileDashboardNavProps {
  isOpen: boolean;
  onClose: () => void;
  role: "STUDENT" | "TEACHER";
  activeBatches?: any[];
}

export function MobileDashboardNav({
  isOpen,
  onClose,
  role,
  activeBatches = [],
}: MobileDashboardNavProps) {
  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 lg:hidden transition-all duration-300",
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Slideout content drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-355 ease-out transform flex flex-col z-50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close Button Inside Drawer */}
        <button
          onClick={onClose}
          type="button"
          className={cn(
            "absolute top-4 right-4 z-55 p-1.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors",
            role === "TEACHER" ? "hover:bg-slate-800 text-white" : "hover:bg-primary-dark text-white"
          )}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Dynamic Sidebar Container */}
        <div className="h-full flex-grow">
          {role === "STUDENT" ? (
            <StudentSidebar onLinkClick={onClose} className="h-full border-r-0" activeBatches={activeBatches} />
          ) : (
            <TeacherSidebar onLinkClick={onClose} className="h-full border-r-0" />
          )}
        </div>
      </div>
    </div>
  );
}

