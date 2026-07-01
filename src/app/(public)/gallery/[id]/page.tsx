import React from "react";
import Link from "next/link";
import { albumsData } from "@/data/albums";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AlbumDetailsClient from "./AlbumDetailsClient";

export default async function AlbumDetailsPage({ params }: { params: { id: string } }) {
  const albumsSection = await getPageSection("GALLERY", "GALLERY_ALBUMS");
  const albums = albumsSection?.content?.albums || albumsData;
  const album = albums.find((a: any) => a.id === params.id);

  if (!album) {
    return (
      <div className="bg-[#FFFCF2] min-h-screen pt-28 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#010E62]">Album not found</h2>
          <Link href="/gallery" className="text-[#FBB503] font-medium mt-4 inline-block hover:underline">
            Return to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return <AlbumDetailsClient album={album} />;
}