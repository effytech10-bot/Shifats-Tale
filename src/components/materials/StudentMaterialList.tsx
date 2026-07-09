"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Eye, Download, ExternalLink, Info, Calendar, FileText, X } from "lucide-react";

interface Material {
  id: string;
  title: string;
  description: string;
  content_type: string;
  file_size: number | null;
  allow_download: boolean;
  external_url: string | null;
  published_at: string;
  created_at: string;
}

export function StudentMaterialList({ materials, batchId }: { materials: Material[], batchId: string }) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    if (selectedMaterial) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedMaterial]);

  const formatBytes = (bytes: number | null) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => {
          const isFile = ["PDF", "DOC", "DOCX", "IMAGE"].includes(material.content_type);
          const isPreviewable = ["PDF", "IMAGE"].includes(material.content_type);
          const isExternal = ["LINK", "YOUTUBE"].includes(material.content_type);
          const isText = ["NOTE", "ANNOUNCEMENT"].includes(material.content_type);

          return (
            <div
              key={material.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="p-5 space-y-3.5">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {material.content_type}
                  </span>
                  {material.file_size && (
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {formatBytes(material.file_size)}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 line-clamp-1">
                    {material.title}
                  </h3>
                  {material.description && (
                    <p className="text-[11px] text-slate-500 font-semibold mt-1.5 leading-relaxed line-clamp-2">
                      {material.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Published: {new Date(material.published_at || material.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/50 flex gap-2 justify-end">
                {isPreviewable && (
                  <button
                    onClick={() => setSelectedMaterial(material)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200/80 hover:bg-slate-200 text-slate-800 rounded-xl transition-all font-bold text-[10px]"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                )}

                {isFile && material.allow_download && (
                  <a
                    href={`/api/materials/${material.id}/access?mode=download`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-xl transition-all font-bold text-[10px]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </a>
                )}

                {isExternal && material.external_url && (
                  <a
                    href={material.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-primary hover:bg-accent/80 rounded-xl transition-all font-bold text-[10px]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Resource
                  </a>
                )}

                {isText && (
                  <div className="w-full bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-[10px] font-semibold text-slate-600 flex items-start gap-1.5">
                    <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-slate-700 block mb-0.5">Read Note</span>
                      <p className="leading-relaxed whitespace-pre-wrap">{material.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedMaterial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-white/20 relative"
              >
                <div className="flex items-center justify-between p-4 border-b border-[#E7E0D2] bg-gray-50/50">
                  <div className="flex items-center space-x-3 truncate">
                    <FileText className="w-5 h-5 text-accent shrink-0" />
                    <h3 className="font-bold text-primary truncate text-sm sm:text-base">
                      {selectedMaterial.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    {selectedMaterial.allow_download && (
                      <a
                        href={`/api/materials/${selectedMaterial.id}/access?mode=download`}
                        download
                        className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 flex items-center space-x-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedMaterial(null)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-100 relative">
                  <iframe
                    src={`/api/materials/${selectedMaterial.id}/access?mode=preview`}
                    className="w-full h-full border-none"
                    title={selectedMaterial.title}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
