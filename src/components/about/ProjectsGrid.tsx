"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectItem, SectionHeader } from "@/data/about";
import * as LucideIcons from "lucide-react";
import { 
  Play, ArrowRight, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";

interface ProjectsGridProps {
  projects: ProjectItem[];
  header?: SectionHeader;
}

const ITEMS_PER_PAGE = 6;

export const ProjectsGrid: React.FC<ProjectsGridProps> = ({ projects, header }) => {
  const defaultHeader = {
    badge: "Real-world Applications",
    title1: "Featured",
    title2: "Projects",
    description: "A showcase of my academic and personal projects demonstrating theoretical knowledge applied to real-world challenges."
  };
  
  const displayBadge = header?.badge || defaultHeader.badge;
  const displayTitle1 = header?.title1 || defaultHeader.title1;
  const displayTitle2 = header?.title2 !== undefined ? header.title2 : defaultHeader.title2;
  const displayDesc = header?.description || defaultHeader.description;

  const [filter, setFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedResource, setSelectedResource] = useState<{url: string, name: string} | null>(null);

  const categories = ["All", "Energy", "Power", "Electronics", "Embedded", "CAD", "Automation"];

  const handleFilterChange = (cat: string) => {
    setFilter(cat);
    setCurrentPage(1); // Reset page on filter change
  };

  const handleSortChange = () => {
    setSortBy(prev => prev === "newest" ? "oldest" : "newest");
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(project => {
    if (filter === "All") return true;
    return project.category === filter;
  });

  const featuredProject = filteredProjects.find(p => p.isFeatured);
  let regularProjects = filteredProjects.filter(p => !p.isFeatured);

  // Apply sorting
  regularProjects = regularProjects.sort((a, b) => {
    if (sortBy === "newest") {
      return b.displayOrder - a.displayOrder;
    } else {
      return a.displayOrder - b.displayOrder;
    }
  });

  const totalPages = Math.ceil(regularProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = regularProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getIcon = (name: string, className = "w-4 h-4") => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) return <div className={`rounded-full bg-accent ${className}`} />;
    return <IconComponent className={className} />;
  };

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case "Energy": return getIcon("Sun", "w-4 h-4 opacity-50");
      case "Power": return getIcon("Zap", "w-4 h-4 opacity-50");
      case "Electronics": return getIcon("Settings", "w-4 h-4 opacity-50");
      case "Embedded": return getIcon("Cpu", "w-4 h-4 opacity-50");
      case "CAD": return getIcon("Layout", "w-4 h-4 opacity-50");
      case "Automation": return getIcon("Bot", "w-4 h-4 opacity-50");
      default: return <div className="w-2 h-2 rounded-full bg-accent" />;
    }
  };

  return (
    <section className="py-16 lg:py-24 relative bg-[#FFF9F2] overflow-hidden">
      
      {/* Background Vectors */}
      <div className="absolute top-0 left-0 opacity-10 pointer-events-none -translate-x-1/4 -translate-y-1/4">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="100" stroke="#FBB503" strokeWidth="2" strokeDasharray="10 10"/>
          <path d="M200 50 L200 80 M200 320 L200 350 M50 200 L80 200 M320 200 L350 200 M95 95 L115 115 M285 285 L305 305 M95 305 L115 285 M285 115 L305 95" stroke="#FBB503" strokeWidth="2"/>
        </svg>
      </div>

      <div className="absolute top-40 right-0 opacity-10 pointer-events-none translate-x-1/4">
        <svg width="300" height="300" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 50 L100 50 L150 100 L250 100" stroke="#FBB503" strokeWidth="2"/>
          <path d="M50 100 L120 100 L170 150 L250 150" stroke="#FBB503" strokeWidth="2"/>
          <circle cx="50" cy="50" r="4" fill="#FBB503"/>
          <circle cx="250" cy="100" r="4" fill="#FBB503"/>
          <circle cx="50" cy="100" r="4" fill="#FBB503"/>
          <circle cx="250" cy="150" r="4" fill="#FBB503"/>
        </svg>
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-white/20 relative"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E7E0D2] bg-gray-50/50">
                <div className="flex items-center space-x-3 truncate">
                  <LucideIcons.FileText className="w-5 h-5 text-accent shrink-0" />
                  <h3 className="font-bold text-primary truncate text-sm sm:text-base">
                    {selectedResource.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <a
                    href={selectedResource.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 flex items-center space-x-1.5"
                  >
                    <LucideIcons.Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  <button 
                    onClick={() => setSelectedResource(null)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LucideIcons.X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-100 relative">
                <iframe 
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + selectedResource.url : selectedResource.url)}&embedded=true`} 
                  className="w-full h-full border-none"
                  title={selectedResource.name}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#E7E0D2] shadow-sm">
            <LucideIcons.Layout className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{displayBadge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            {displayTitle1}{" "}
            {displayTitle2 && <span className="text-accent">{displayTitle2}</span>}
          </h2>
          <p className="text-primary/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            {displayDesc}
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 pt-8">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                  filter === cat 
                    ? "bg-primary text-white" 
                    : "bg-white text-primary border border-[#E7E0D2] hover:bg-white/80"
                }`}
              >
                {filter === cat ? (
                  <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                ) : (
                  getCategoryIcon(cat)
                )}
                <span>{cat}</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button 
              onClick={handleSortChange}
              className="flex items-center space-x-2 bg-white px-5 py-2.5 rounded-xl border border-[#E7E0D2] shadow-sm text-sm font-bold text-primary hover:bg-white/80 transition-colors"
            >
              <span>{sortBy === "newest" ? "Newest First" : "Oldest First"}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>

        {/* Featured Project */}
        <AnimatePresence mode="popLayout">
          {featuredProject && (
            <motion.div 
              key={featuredProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-sm border border-[#E7E0D2] overflow-hidden flex flex-col lg:flex-row h-auto lg:min-h-[420px]"
            >
              {/* Image side */}
              <div className="lg:w-[45%] relative h-64 lg:h-auto lg:min-h-full overflow-hidden group shrink-0">
                <img 
                  src={featuredProject.imageUrl} 
                  alt={featuredProject.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-6 left-6 bg-accent text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md">
                  Featured
                </div>
              </div>
              
              {/* Content side */}
              <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-accent font-black text-[10px] uppercase tracking-widest mb-3">
                  {getIcon(featuredProject.iconName)}
                  <span>{featuredProject.category}</span>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-extrabold text-primary font-display mb-4 leading-tight">
                  {featuredProject.title}
                </h3>
                
                <p className="text-primary/70 font-medium text-sm leading-relaxed mb-8">
                  {featuredProject.shortDescription}
                </p>

                {/* Metrics */}
                {featuredProject.metrics && (
                  <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-8">
                    {featuredProject.metrics.map((metric, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                          {getIcon(metric.iconName)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-primary font-extrabold text-sm">{metric.value}</span>
                          <span className="text-primary/50 text-[9px] font-black uppercase tracking-widest">{metric.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Project Resource */}
                {featuredProject.resourceUrl && (
                  <div className="flex flex-wrap gap-4 mt-auto">
                    <button 
                      onClick={() => setSelectedResource({ url: featuredProject.resourceUrl!, name: featuredProject.resourceFileName || "Project Document" })}
                      className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-sm bg-[#0A1A44] text-white hover:bg-[#0A1A44]/90"
                    >
                      <span>View Project Report</span>
                      <LucideIcons.FileText className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Grid Projects */}
          {paginatedProjects.length > 0 && (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginatedProjects.map((project) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="bg-white rounded-3xl border border-[#E7E0D2] shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-shadow h-auto sm:min-h-[220px]"
                >
                  {/* Left Image */}
                  <div className="w-full sm:w-[40%] h-48 sm:h-full relative overflow-hidden shrink-0">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Right Content */}
                  <div className="p-5 flex flex-col flex-1 w-full sm:w-[60%]">
                    <div className="flex items-center space-x-1.5 text-accent font-black text-[9px] uppercase tracking-widest mb-2">
                      <div className="w-3.5 h-3.5 flex items-center justify-center">
                         {getIcon(project.iconName)}
                      </div>
                      <span>{project.category}</span>
                    </div>
                    
                    <h4 className="text-sm font-extrabold text-primary leading-snug mb-1.5 line-clamp-2">
                      {project.title}
                    </h4>
                    
                    <p className="text-[10px] text-primary/70 font-medium mb-3 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                    
                    {/* Technologies Pills */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.technologies.map(tech => (
                          <span key={tech} className="px-2 py-0.5 bg-white text-primary/60 text-[8px] font-bold rounded border border-[#E7E0D2]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Compact Metrics */}
                    {project.metrics && (
                      <div className="flex items-start justify-between gap-1 mb-3 pt-2 border-t border-[#E7E0D2]/50">
                        {project.metrics.map((metric, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center">
                            <span className="text-accent mb-0.5 scale-75">{getIcon(metric.iconName)}</span>
                            <span className="text-primary font-extrabold text-[10px]">{metric.value.split(" ")[0]}</span>
                            <span className="text-primary/50 text-[6px] font-black uppercase tracking-widest leading-tight">{metric.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Action / Resource */}
                    {project.resourceUrl && (
                      <div className="mt-auto pt-3 border-t border-[#E7E0D2]/50">
                        <button 
                          onClick={() => setSelectedResource({ url: project.resourceUrl!, name: project.resourceFileName || "Project Document" })}
                          className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 bg-[#0A1A44] text-white text-[10px] font-bold rounded-lg hover:bg-[#0A1A44]/90 transition-colors"
                        >
                          <LucideIcons.FileText className="w-3.5 h-3.5" />
                          <span>View Project Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#E7E0D2] bg-white text-primary disabled:opacity-50 hover:bg-[#FBE8CA] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                  currentPage === i + 1 
                    ? "bg-primary text-white" 
                    : "border border-[#E7E0D2] bg-white text-primary hover:bg-[#FBE8CA]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center border border-[#E7E0D2] bg-white text-primary disabled:opacity-50 hover:bg-[#FBE8CA] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
