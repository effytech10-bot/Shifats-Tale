"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryAlbum } from "@/data/albums";
import { Calendar, ZoomIn, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import InnerPageHero from "@/components/layout/InnerPageHero";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function AlbumDetailsClient({ album }: { album: GalleryAlbum }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Gallery", href: "/gallery" },
    { label: album.title },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F2] pt-24 pb-20 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none w-full h-[400px]">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" className="w-full h-full">
           <path d="M0,200 C300,100 700,300 1000,200" fill="none" stroke="#FBB503" strokeWidth="2"/>
           <path d="M0,220 C300,120 700,320 1000,220" fill="none" stroke="#FBB503" strokeWidth="1"/>
        </svg>
      </div>

      <div className="brand-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        <InnerPageHero
          eyebrow={album.category}
          title={
            <>
              <span className="block text-white">Album:</span>
              <span className="block text-accent mt-1">{album.title}</span>
            </>
          }
          description={album.description}
          breadcrumbs={breadcrumbs}
          imageSrc={album.coverImage}
        />

      <div className="mt-4 sm:mt-12">
        
        {/* Back to Albums button */}
        <div className="mb-8">
          <Link href="/gallery" className="inline-flex items-center gap-2 text-[#4A5568] hover:text-[#010E62] transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Albums
          </Link>
        </div>
        
        {/* Album Header Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 mb-10 shadow-sm border border-[#E8DDBF]/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBB503]/10 border border-[#FBB503]/20 text-[#010E62] text-xs font-bold uppercase tracking-wider mb-4">
              {album.category}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#010E62] tracking-tight mb-3">
              {album.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#4A5568] font-medium">
              <Calendar className="w-4 h-4 text-[#FBB503]" />
              {album.date}
            </div>
          </div>
          <div className="md:text-right md:max-w-md border-t md:border-t-0 md:border-l border-[#E8DDBF]/50 pt-4 md:pt-0 md:pl-6">
            <p className="text-[#4A5568] leading-relaxed text-[15px]">
              {album.description}
            </p>
            <div className="mt-4 font-bold text-[#010E62] text-sm">
              {album.images?.length || 0} Photos in this Album
            </div>
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {(album.images || []).map((img, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              key={img.id || index}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500 border border-white"
              onClick={() => {
                setLightboxIndex(index);
                setLightboxOpen(true);
              }}
            >
              <Image
                src={img.url}
                alt={img.alt || "Gallery Image"}
                width={600}
                height={800}
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                unoptimized
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#010E62]/90 via-[#010E62]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-extrabold text-sm leading-snug mb-1">
                    {img.alt || "Image"}
                  </h3>
                </div>
                
                {/* Zoom Icon indicator */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 border border-white/20">
                  <ZoomIn className="w-4.5 h-4.5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
          {(!album.images || album.images.length === 0) && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No images in this album.
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={(album.images || []).map((img) => ({
          src: img.url,
          alt: img.alt || "Gallery Image",
        }))}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
      />
    </div>
    </div>
  );
}
