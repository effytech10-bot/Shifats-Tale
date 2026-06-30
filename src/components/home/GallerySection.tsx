"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { albumsData } from "@/data/albums";
import { Camera, Calendar, Image as ImageIcon, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function GallerySection() {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);

  // Show only top 4 albums for the home page preview
  const previewAlbums = albumsData.slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-[#FFFCF7] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#010E62]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-[#FBB503]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBB503]/10 border border-[#FBB503]/20 text-[#010E62] text-xs font-bold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Our Gallery</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#010E62] tracking-tight mb-4">
            Captured <span className="text-[#FBB503]">Moments</span>
          </h2>
          <p className="text-[#4A5568] max-w-2xl mx-auto text-lg leading-relaxed">
            Explore our curated albums of events, interactive classroom sessions, and premium study materials.
          </p>
        </div>

        {/* Albums Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {previewAlbums.map((album, index) => (
            <motion.div 
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/gallery/${album.id}`} className="block group">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#010E62]/90 via-[#010E62]/10 to-transparent opacity-80" />
                      
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <ImageIcon className="w-3.5 h-3.5 text-[#010E62]" />
                        <span className="text-[11px] font-extrabold text-[#010E62]">{album.images.length}</span>
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <div className="inline-block px-3 py-1 bg-[#FBB503] text-[#010E62] text-[11px] font-extrabold rounded-md shadow-sm uppercase tracking-wider">
                          {album.category}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Album Info */}
                  <div className="px-1 relative z-20 text-center sm:text-left">
                    <h3 className="text-lg font-extrabold text-[#010E62] group-hover:text-[#FBB503] transition-colors mb-1.5 leading-tight">
                      {album.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-[#E8DDBF] text-[#010E62] font-extrabold text-sm uppercase tracking-widest rounded-xl hover:bg-[#FBB503] hover:text-[#010E62] hover:border-[#FBB503] transition-all shadow-sm hover:shadow-lg group"
          >
            <span>View All Albums</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}