"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PublicationItem } from "@/data/about";
import { BookOpen, Users, MapPin, Eye, Link as LinkIcon, Award, ChevronDown, FileText, ChevronLeft, ChevronRight } from "lucide-react";

interface PublicationsSectionProps {
  publications: PublicationItem[];
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ publications }) => {
  const [filter, setFilter] = useState<"All" | "Journal Article" | "Conference Paper">("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  if (!publications || publications.length === 0) return null;

  const filteredData = publications.filter((item) => {
    if (filter === "All") return true;
    return item.type === filter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const yearA = parseInt(a.year || "0");
    const yearB = parseInt(b.year || "0");
    if (sortBy === "newest") return yearB - yearA;
    return yearA - yearB;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (newFilter: "All" | "Journal Article" | "Conference Paper") => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = () => {
    setSortBy(sortBy === "newest" ? "oldest" : "newest");
    setCurrentPage(1);
  };

  return (
    <section className="py-16 lg:py-24 relative bg-[#FFF9F2] overflow-hidden">
      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#E7E0D2] shadow-sm">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Research & Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-display">
            Research Publications
          </h2>
          <p className="text-primary/70 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            A curated list of my peer-reviewed journal articles and conference papers in the field of photonics and optical communication.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => handleFilterChange("All")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${filter === "All" ? "bg-primary text-white" : "bg-white text-primary border border-[#E7E0D2] hover:bg-white/80"}`}
            >
              {filter === "All" && <div className="w-2 h-2 rounded-full bg-accent shrink-0" />}
              <span>All Publications</span>
            </button>

            <button 
              onClick={() => handleFilterChange("Journal Article")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${filter === "Journal Article" ? "bg-primary text-white" : "bg-white text-primary border border-[#E7E0D2] hover:bg-white/80"}`}
            >
              {filter === "Journal Article" ? (
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              ) : (
                <BookOpen className="w-4 h-4 opacity-70 shrink-0" />
              )}
              <span>Journal Articles</span>
            </button>

            <button 
              onClick={() => handleFilterChange("Conference Paper")}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${filter === "Conference Paper" ? "bg-primary text-white" : "bg-white text-primary border border-[#E7E0D2] hover:bg-white/80"}`}
            >
              {filter === "Conference Paper" ? (
                <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              ) : (
                <Users className="w-4 h-4 opacity-70 shrink-0" />
              )}
              <span>Conference Papers</span>
            </button>
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

        {/* Publications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {currentData.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row gap-8 shadow-sm border border-[#E7E0D2] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all"
              >
                {/* Left Column (Meta) */}
                <div className="lg:w-[220px] shrink-0 space-y-4 border-l-[3px] border-accent pl-5">
                  <div className="text-accent font-extrabold text-lg">
                    {item.year}
                  </div>
                  
                  <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-md text-[11px] font-bold ${
                    item.type === "Journal Article" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                  }`}>
                    {item.type === "Journal Article" ? <BookOpen className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    <span>{item.type}</span>
                  </div>

                  <div className="font-bold text-sm text-primary leading-tight">
                    {item.venue}
                  </div>

                  {item.status && (
                    <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-[11px] font-bold rounded-md">
                      {item.status}
                    </div>
                  )}

                  {item.location && (
                    <div className="flex items-start space-x-1.5 text-muted text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Middle Column (Title & Summary) */}
                <div className="flex-1">
                  <h3 className="text-xl sm:text-[22px] font-extrabold text-primary font-display leading-[1.3] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary/70 font-medium leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                {/* Right Column (Actions) */}
                <div className="lg:w-[200px] shrink-0 flex flex-col gap-3">
                  <a href={item.link || "#"} className="flex items-center justify-between w-full px-5 py-3 rounded-xl border border-[#E7E0D2] text-sm font-bold text-primary hover:border-primary transition-colors group">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span>Read Paper</span>
                    </div>
                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                  </a>
                  
                  <a href={item.doiLink || "#"} className="flex items-center justify-center w-full px-5 py-3 rounded-xl border border-[#E7E0D2] text-sm font-bold text-primary hover:border-primary transition-colors group">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                      <span>View DOI</span>
                    </div>
                  </a>

                  <a href={item.certificateLink || "#"} className="flex items-center justify-center w-full px-5 py-3 rounded-xl border border-[#FBB503]/30 text-sm font-bold text-accent hover:bg-[#FBB503]/5 transition-colors group">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                      <span>Certificate</span>
                    </div>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

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
