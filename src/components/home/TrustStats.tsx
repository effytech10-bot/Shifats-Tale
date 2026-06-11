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
    number: "8+",
    label: "Years Experience",
    description: "Teaching Physics & Mathematics",
    icon: <Award className="h-6 w-6 text-amber-400" />,
  },
  {
    number: "1,500+",
    label: "A+ in Board Exams",
    description: "SSC and HSC Candidates",
    icon: <Users className="h-6 w-6 text-blue-400" />,
  },
  {
    number: "400+",
    label: "Varsity Merit Positions",
    description: "BUET, Dhaka University, Medicals",
    icon: <GraduationCap className="h-6 w-6 text-teal-400" />,
  },
  {
    number: "1-on-1",
    label: "Personal Care",
    description: "Direct feedback & doubt clearing",
    icon: <CheckCircle className="h-6 w-6 text-emerald-400" />,
  },
];

export default function TrustStats() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 -mt-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:-translate-y-1 group"
            >
              {/* Top gradient highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Icon wrapper */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Number */}
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-1">
                {stat.number}
              </span>

              {/* Label */}
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                {stat.label}
              </span>

              {/* Description */}
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                {stat.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
