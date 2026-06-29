"use client";

import React, { useState } from "react";
import { Sun, Zap, Lock, Wind, Bot, Cpu, ArrowRight, X, Layers, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem } from "@/data/about";

interface ProjectsGridProps {
  projects: ProjectItem[];
}

const renderProjectIcon = (iconName: string, className: string = "h-6 w-6") => {
  switch (iconName) {
    case "Sun": return <Sun className={className} />;
    case "Zap": return <Zap className={className} />;
    case "Lock": return <Lock className={className} />;
    case "Fan":
    case "Wind": return <Wind className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Cpu": return <Cpu className={className} />;
    default: return <Layers className={className} />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  if (!projects || projects.length === 0) return null;

  const sortedProjects = [...projects].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-16 lg:py-24 relative z-10 bg-bg-soft/50">
      <div className="brand-container max-w-7xl mx-auto space-y-12 text-left">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#E7E0D2] shadow-sm">
            <Cpu className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Engineering & Dev</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            Selected Projects
          </h2>
          <p className="text-muted font-medium max-w-2xl mx-auto">
            A collection of robust engineering projects and software applications showcasing my problem-solving abilities.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
        >
          {sortedProjects.map((project) => (
            <motion.div
              variants={itemVariants}
              key={project.id}
              onClick={() => setSelectedProject(project)}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 sm:p-8 shadow-lg hover:shadow-[0_20px_50px_-12px_rgba(1,14,98,0.15)] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Decorative gradient blob */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-[30px] -mr-10 -mt-10 group-hover:bg-accent/20 transition-colors duration-500" />
              
              <div className="space-y-6 relative z-10 flex flex-col w-full h-full">
                {/* Icon Box */}
                <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#E7E0D2]/50 text-primary group-hover:bg-primary group-hover:text-accent group-hover:border-primary transition-all duration-300 w-max">
                  {renderProjectIcon(project.iconName, "h-7 w-7")}
                </div>

                {/* Title & Short Description */}
                <div className="space-y-3 flex-1">
                  <h4 className="font-extrabold text-lg sm:text-xl text-primary font-display leading-snug">
                    {project.title}
                  </h4>
                  <p className="text-sm text-text/70 line-clamp-3 leading-relaxed font-medium">
                    {project.shortDescription}
                  </p>
                </div>

                {/* View Details Link */}
                <div className="pt-4 flex items-center space-x-2 text-sm font-extrabold text-primary group-hover:text-accent transition-colors border-t border-[#E7E0D2]/50">
                  <span>Explore Project</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Project Details Modal Lightbox */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-primary/60 backdrop-blur-lg"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-[2.5rem] border border-white/50 shadow-2xl max-w-2xl w-full p-8 sm:p-10 space-y-8 text-left max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-soft to-transparent pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between relative z-10 shrink-0">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-[1.5rem] bg-accent/20 text-primary border border-accent/10">
                    {renderProjectIcon(selectedProject.iconName, "h-8 w-8")}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">
                      {selectedProject.category || "Engineering Project"}
                    </span>
                    <h4 className="text-2xl sm:text-3xl font-extrabold text-primary font-display mt-3 leading-tight">
                      {selectedProject.title}
                    </h4>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-3 rounded-full bg-white hover:bg-bg-soft text-primary shadow-sm border border-[#E7E0D2] transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto custom-scrollbar pr-4 space-y-8 relative z-10 flex-1">
                {/* Description */}
                <div className="space-y-4">
                  <h5 className="text-sm font-extrabold text-primary uppercase tracking-wider flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span>Project Overview & Scope</span>
                  </h5>
                  <p className="text-sm sm:text-base text-text/80 leading-relaxed font-medium">
                    {selectedProject.fullDescription || selectedProject.shortDescription}
                  </p>
                </div>

                {/* Tech Stack Chips */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div className="space-y-4 bg-bg-soft/50 p-6 rounded-3xl border border-[#E7E0D2]">
                    <h5 className="text-sm font-extrabold text-primary uppercase tracking-wider flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      <span>Tech Stack & Tools</span>
                    </h5>
                    <div className="flex flex-wrap gap-3">
                      {selectedProject.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-[#E7E0D2] text-sm font-bold text-primary shadow-sm hover:border-accent hover:shadow-md transition-all"
                        >
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Close Button */}
              <div className="pt-4 flex justify-end shrink-0 relative z-10 border-t border-[#E7E0D2]/60 mt-4">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="primary-btn px-8 py-3 text-sm rounded-xl shadow-lg hover:shadow-accent/40"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

