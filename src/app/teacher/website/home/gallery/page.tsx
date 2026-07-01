import { getPageSection } from "@/features/website-cms/actions/content-actions";
import HomeGalleryAdmin from "./HomeGalleryAdmin";
import { albumsData } from "@/data/albums";

export default async function HomeGalleryAdminPage() {
  const sectionData = await getPageSection("HOME", "HOME_GALLERY");
  
  // Get all albums from the gallery to let admin select which ones to show on Home
  const albumsSection = await getPageSection("GALLERY", "GALLERY_ALBUMS");
  const allAlbums = albumsSection?.content?.albums || albumsData;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Home Gallery (Captured Moments)</h1>
        <p className="text-gray-500">Manage the Captured Moments section on the home page. Select which albums to feature.</p>
      </div>

      <HomeGalleryAdmin 
        initialSectionData={sectionData} 
        allAlbums={allAlbums} 
      />
    </div>
  );
}
