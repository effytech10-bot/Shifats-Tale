"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { albumsData } from "@/data/albums";
import { Calendar, Image as ImageIcon, Search, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import InnerPageHero from "@/components/layout/InnerPageHero";

export default function GalleryClient({ heroData, albumsData: dynamicAlbums }: { heroData?: any, albumsData?: any }) {
  const [hoveredAlbum, setHoveredAlbum] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Gallery" },
  ];

  const categories = ["All", "Events", "Classroom", "Awards", "Study Material", "Farewell"];

  const actualAlbumsData = dynamicAlbums?.content?.albums || albumsData;

  const filteredAlbums = actualAlbumsData.filter((album: any) => {
    const matchesCategory = selectedCategory === "All" || album.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      album.title.toLowerCase().includes(searchLower) || 
      album.date.toLowerCase().includes(searchLower) || 
      album.description.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

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
          eyebrow={heroData?.eyebrow || "Our Gallery"}
          title={
            <>
              <span className="block text-white">{heroData?.title || "Memories &"}</span>
              <span className="block text-accent mt-1">{heroData?.subtitle || "Moments"}</span>
            </>
          }
          description={heroData?.description || "Explore our curated albums of events, classroom sessions, and premium study materials."}
          breadcrumbs={breadcrumbs}
          imageSrc={heroData?.mediaUrl || "/images/gallery-classroom.png"}
        />

      <div className="mt-8">
        
        {/* Filter Bar */}
        <div className="mb-12 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-[#E8DDBF] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-2 sm:gap-3 min-w-max px-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === cat 
                      ? "bg-[#010E62] text-white shadow-md border border-[#010E62]" 
                      : "bg-[#FFFCF7] text-[#4A5568] border border-[#E8DDBF] hover:bg-[#FBB503]/10 hover:text-[#010E62] hover:border-[#FBB503]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" />
            <input 
              type="text" 
              placeholder="Search by name, date or year..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#FFFCF7] border border-[#E8DDBF] rounded-xl text-sm font-medium text-[#010E62] placeholder:text-[#718096] focus:outline-none focus:ring-2 focus:ring-[#FBB503]/50 focus:border-[#FBB503] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredAlbums.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full py-20 text-center flex flex-col items-center"
              >
                <Camera className="w-12 h-12 text-[#E8DDBF] mb-4" />
                <h3 className="text-xl font-bold text-[#010E62]">No albums found</h3>
                <p className="text-[#4A5568] mt-2">Try adjusting your filters or search query.</p>
              </motion.div>
            ) : (
              filteredAlbums.map((album: any, index: number) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ delay: index * 0.05 }}
              layout
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
            </motion.div>
          )))}
          </AnimatePresence>
        </div>
      </div>
    </div>
    </div>
  );
}