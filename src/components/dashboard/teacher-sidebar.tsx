import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  CreditCard, 
  Bell, 
  FileText, 
  UserCheck,
  Settings,
  ShieldAlert,
  GraduationCap
} from "lucide-react";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const teacherNavItems: NavItem[] = [
  { label: "Overview", href: "/teacher", icon: LayoutDashboard },
  { label: "Manage Students", href: "/teacher/students", icon: Users },
  { label: "Manage Batches", href: "/teacher/batches", icon: BookOpen },
  { label: "Attendance Control", href: "/teacher/attendance", icon: UserCheck },
  { label: "Payment Ledger", href: "/teacher/payments", icon: CreditCard },
  { label: "Announcements", href: "/teacher/announcements", icon: Bell },
  { label: "Study Materials", href: "/teacher/materials", icon: FileText },
  { label: "Exams & Grading", href: "/teacher/exams", icon: GraduationCap },
  { label: "Portal Settings", href: "/teacher/settings", icon: Settings },
];

export function TeacherSidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-primary-dark text-white border-r border-slate-900", className)}>
      {/* Brand area */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-900 bg-slate-950/20">
        <div className="p-2 bg-accent rounded-xl text-primary-dark">
          <ShieldAlert className="h-6 w-6 font-bold" />
        </div>
        <div>
          <span className="font-extrabold text-base tracking-wide font-display block leading-none">
            SHIFAT'S TALES
          </span>
          <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 block">
            Teacher Portal
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
        {teacherNavItems.map((item) => {
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
                  ? "bg-accent text-primary-dark shadow-md shadow-accent/15"
                  : "text-white/80 hover:text-white hover:bg-slate-800/40"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary-dark rounded-r-full" />
              )}
              <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105", isActive ? "text-primary-dark" : "text-white/60 group-hover:text-white")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Account indicator */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/10 text-xs font-semibold text-white/50 text-center">
        &copy; {new Date().getFullYear()} Shifat's Tales
      </div>
    </div>
  );
}
