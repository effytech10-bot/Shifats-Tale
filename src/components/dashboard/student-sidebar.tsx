"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { 
  BookOpen, 
  LayoutDashboard, 
  CreditCard, 
  User,
  GraduationCap,
  LogOut,
  Loader2
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
  activeBatches?: any[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function StudentSidebar({ className, onLinkClick, activeBatches = [] }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Dynamic Navigation Items
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  ];

  // Map active batches to individual navigation links
  activeBatches.forEach((batch) => {
    navItems.push({
      label: batch.name || `${batch.subject} Batch`,
      href: `/student/batches/${batch.id}`,
      icon: BookOpen,
    });
  });

  // Base links
  navItems.push(
    { label: "Exams & Results", href: "/student/exams", icon: GraduationCap },
    { label: "Payments", href: "/student/payments", icon: CreditCard },
    { label: "Profile", href: "/student/profile", icon: User }
  );

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-primary text-white border-r border-primary-dark", className)}>
      {/* Brand area */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-primary-dark bg-primary-dark/40">
        <div className="p-2 bg-accent rounded-xl text-primary">
          <GraduationCap className="h-6 w-6 font-bold" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-wide font-display block leading-none">
            SHIFAT'S TALES
          </span>
          <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 block">
            Student Portal
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 group relative",
                isActive
                  ? "bg-accent text-primary shadow-md shadow-accent/15"
                  : "text-white/80 hover:text-white hover:bg-primary-dark/30"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105", isActive ? "text-primary" : "text-white/60 group-hover:text-white")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Logout action directly inside sidebar */}
        <button
          onClick={handleSignOut}
          disabled={loggingOut}
          className="w-full flex items-center gap-3.5 px-4 py-3 text-sm font-bold rounded-xl text-white/70 hover:text-rose-200 hover:bg-rose-950/20 transition-all duration-200 text-left disabled:opacity-50"
        >
          {loggingOut ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-white/50" />
          ) : (
            <LogOut className="h-5 w-5 shrink-0 text-white/50 group-hover:text-rose-300" />
          )}
          <span>Logout</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-dark bg-primary-dark/20 text-xs font-semibold text-white/50 text-center">
        &copy; {new Date().getFullYear()} Shifat's Tales
      </div>
    </div>
  );
}
