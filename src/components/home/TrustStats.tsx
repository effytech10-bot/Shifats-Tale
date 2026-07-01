"use client";

import React from "react";
import { Award, Users, GraduationCap, CheckCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { stats } from "@/data/site";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Award": return <Award className="h-6 w-6 text-accent" />;
    case "Users": return <Users className="h-6 w-6 text-primary" />;
    case "GraduationCap": return <GraduationCap className="h-6 w-6 text-primary-dark" />;
    case "CheckCircle": return <CheckCircle className="h-6 w-6 text-emerald-600" />;
    default: return <Award className="h-6 w-6 text-accent" />;
  }
};

export default function TrustStats({ heroData }: { heroData?: any }) {
  const shouldReduceMotion = useReducedMotion();
  
  const content = heroData?.content || {};
  
  const displayStats = [
    {
      id: "stat-1",
      icon: "Users",
      value: content.studentCount || "10,000+",
      label: "Students Taught",
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      id: "stat-2",
      icon: "Award",
      value: content.boardSuccess || "100%",
      label: "Board Success Rate",
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      id: "stat-3",
      icon: "GraduationCap",
      value: content.universitySuccess || "5,000+",
      label: "University Admits",
      color: "text-primary-dark",
      bg: "bg-primary-dark/5",
    },
    {
      id: "stat-4",
      icon: "CheckCircle",
      value: content.experience || "10+",
      label: "Years Experience",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 15 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut" as const
      } 
    },
  };

  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 mt-8">
      <div className="brand-container">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {displayStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              variants={cardVariants}
              className="brand-card rounded-2xl p-5 sm:p-6 flex flex-col items-center text-center space-y-2 relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-accent/30 group bg-white border border-border"
            >
              {/* Top border highlight on hover */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon wrapper */}
              <div className={`p-4 rounded-2xl ${stat.bg} mb-2 relative group-hover:scale-110 transition-transform duration-300`}>
                {getIcon(stat.icon)}
              </div>

              {/* Number */}
              <h3 className={`text-2xl sm:text-3xl font-black ${stat.color} tracking-tight`}>
                {stat.value}
              </h3>

              <div className="space-y-1">
                <p className="font-bold text-sm sm:text-base text-primary/90">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
