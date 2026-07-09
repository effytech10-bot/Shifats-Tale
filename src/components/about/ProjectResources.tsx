"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ArrowRight } from "lucide-react";

export function ProjectResources({ links }: { links: any[] }) {
  const [selectedResource, setSelectedResource] = useState<{url: string, name: string} | null>(null);

  const getIcon = (name: string, className = "w-5 h-5") => {
    const IconComponent = (LucideIcons as any)[name];
    if (!IconComponent) return <div className={`rounded-full bg-current ${className}`} />;
    return <IconComponent className={className} />;
  };

  const validLinks = links;

  if (!validLinks || validLinks.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-extrabold text-primary uppercase tracking-widest mb-4 flex items-center">
        <LucideIcons.FileSymlink className="w-4 h-4 mr-2 text-accent" />
        Resources
      </h3>
      <div className="flex flex-col gap-3">
        {validLinks.map((link, idx) => {
          const isFileLink = link.isFile || (link.url && link.url.includes('/api/resource'));

          if (isFileLink) {
            return (
              <button 
                key={idx}
                onClick={() => setSelectedResource({ url: link.url, name: link.label || "Project Document" })}
                className="flex items-center justify-between w-full px-5 py-4 rounded-xl border-2 border-primary text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors group shadow-sm text-left"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-accent group-hover:text-white transition-colors">
                    {getIcon(link.iconName, "w-5 h-5")}
                  </span>
                  <span>{link.label}</span>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            );
          }

          return (
            <a 
              key={idx}
              href={link.url}
              className="flex items-center justify-between w-full px-5 py-4 rounded-xl border-2 border-primary text-sm font-bold text-primary hover:bg-primary hover:text-white transition-colors group shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <span className="text-accent group-hover:text-white transition-colors">
                  {getIcon(link.iconName, "w-5 h-5")}
                </span>
                <span>{link.label}</span>
              </div>
              <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
            </a>
          );
        })}
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
    </div>
  );
}
