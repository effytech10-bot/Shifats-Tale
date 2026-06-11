import React from "react";
import { Award, Users, GraduationCap, CheckCircle } from "lucide-react";

interface StatItem {
  number: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const stats: StatItem[] = [
  {
    number: "10+",
    label: "Years Experience",
    description: "Teaching Physics & Mathematics",
    icon: <Award className="h-6 w-6 text-accent" />,
  },
  {
    number: "1,200+",
    label: "Students Guided",
    description: "SSC and HSC Candidates",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    number: "40+",
    label: "Successful Batches",
    description: "Academic & Admission Care",
    icon: <GraduationCap className="h-6 w-6 text-primary-dark" />,
  },
  {
    number: "Weekly",
    label: "Exam System",
    description: "Continuous progress evaluation",
    icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
  },
];

export default function TrustStats() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-8">
      <div className="brand-container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="brand-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group bg-white border border-border"
            >
              {/* Top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon wrapper */}
              <div className="bg-bg-soft p-3 rounded-xl border border-border group-hover:scale-105 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Number */}
              <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight pt-1">
                {stat.number}
              </span>

              {/* Label */}
              <span className="text-xs sm:text-sm font-bold text-primary-dark">
                {stat.label}
              </span>

              {/* Description */}
              <span className="text-[11px] sm:text-xs text-muted font-medium">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
