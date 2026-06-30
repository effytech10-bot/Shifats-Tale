"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { albumsData } from "@/data/albums";
import { Calendar, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import InnerPageHero from "@/components/layout/InnerPageHero";

export default function GalleryPage() {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Gallery" },
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
          eyebrow="Our Gallery"
          title={
            <>
              <span className="block text-white">Memories &</span>
              <span className="block text-accent mt-1">Moments</span>
            </>
          }
          description="Explore our curated albums of events, classroom sessions, and premium study materials."
          breadcrumbs={breadcrumbs}
          imageSrc="/images/gallery-classroom.png"
        />

      <div className="mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {albumsData.map((album) => (
            <Link href={`/gallery/${album.id}`} key={album.id} className="block group">
              <div 
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredAlbum(album.id)}
                onMouseLeave={() => setHoveredAlbum(null)}
              >
                {/* Folders Stack Effect */}
                <div className="relative aspect-[4/3] w-full mb-5 z-10">
                  {/* Back Photo */}
                  <motion.div 
                    initial={false}
                    animate={{
                      rotate: hoveredAlbum === album.id ? -8 : -4,
                      y: hoveredAlbum === album.id ? -10 : 0,
                      scale: hoveredAlbum === album.id ? 1.05 : 0.95
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-[#E8DDBF] overflow-hidden origin-bottom"
                  >
                    <Image 
                      src={album.images[1]?.url || album.coverImage}
                      alt="album peek"
                      fill
                      className="object-cover opacity-60 grayscale-[50%]"
                    />
                  </motion.div>
                  
                  {/* Middle Photo */}
                  <motion.div 
                    initial={false}
                    animate={{
                      rotate: hoveredAlbum === album.id ? 8 : 4,
                      y: hoveredAlbum === album.id ? -5 : 0,
                      scale: hoveredAlbum === album.id ? 1.05 : 0.98
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 bg-white rounded-2xl shadow-md border border-[#E8DDBF] overflow-hidden z-10 origin-bottom"
                  >
                    <Image 
                      src={album.images[2]?.url || album.coverImage}
                      alt="album peek"
                      fill
                      className="object-cover opacity-80"
                    />
                  </motion.div>

                  {/* Front Cover */}
                  <motion.div 
                    initial={false}
                    animate={{
                      y: hoveredAlbum === album.id ? 5 : 0,
                      scale: hoveredAlbum === album.id ? 1.02 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute inset-0 bg-white rounded-2xl shadow-lg border-[6px] border-white overflow-hidden z-20 group-hover:shadow-[0_20px_40px_rgba(1,14,98,0.12)] transition-shadow duration-500 origin-bottom"
                  >
                    <Image 
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Dark gradient overlay for text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#010E62]/90 via-[#010E62]/10 to-transparent opacity-80" />
                    
                    {/* Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <ImageIcon className="w-3.5 h-3.5 text-[#010E62]" />
                      <span className="text-[11px] font-extrabold text-[#010E62]">{album.images.length} Photos</span>
                    </div>

                    {/* Category Label */}
                    <div className="absolute bottom-4 left-4">
                      <div className="inline-block px-3 py-1 bg-[#FBB503] text-[#010E62] text-[11px] font-extrabold rounded-md mb-2 shadow-sm uppercase tracking-wider">
                        {album.category}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Album Info */}
                <div className="px-1 relative z-20">
                  <h3 className="text-xl font-extrabold text-[#010E62] group-hover:text-[#FBB503] transition-colors mb-1.5 leading-tight">
                    {album.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[13px] text-[#4A5568] font-bold mb-3">
                    <Calendar className="w-4 h-4 text-[#FBB503]" />
                    {album.date}
                  </div>
                  <p className="text-sm text-[#4A5568] line-clamp-2 leading-relaxed font-medium">
                    {album.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}