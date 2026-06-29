"use client";

import React, { useState, useEffect } from "react";
import { GraduationCap, UserCheck, BookOpen, Award, Code } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { MetricItem } from "@/data/about";

interface AboutMetricsProps {
  metrics: MetricItem[];
}

const renderMetricIcon = (iconName: string, className: string = "h-6 w-6") => {
  switch (iconName) {
    case "GraduationCap":
      return <GraduationCap className={className} />;
    case "UserCheck":
      return <UserCheck className={className} />;
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Award":
      return <Award className={className} />;
    case "Code":
      return <Code className={className} />;
    default:
      return <GraduationCap className={className} />;
  }
};

const AnimatedNumber = ({ value }: { value: string }) => {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, "")) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;

    const totalDuration = 2000;
    const incrementTime = (totalDuration / end) * 2;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {target > 0 ? count : ""}
      {target > 0 ? suffix : value}
    </span>
  );
};

export const AboutMetrics: React.FC<AboutMetricsProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className="relative z-20 -mt-10 sm:-mt-16 mb-16 px-4">
      <div className="brand-container max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(1,14,98,0.1)] relative overflow-hidden"
        >
          {/* Subtle gloss overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
            {metrics.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-5 group"
              >
                <div className="p-4 rounded-2xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300 shadow-inner">
                  {renderMetricIcon(item.iconName, "h-7 w-7 sm:h-8 sm:w-8")}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-extrabold text-2xl sm:text-3xl text-primary font-display mb-1 group-hover:text-accent transition-colors">
                    <AnimatedNumber value={item.value} />
                  </h4>
                  <span className="block text-xs sm:text-sm font-bold text-muted uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
