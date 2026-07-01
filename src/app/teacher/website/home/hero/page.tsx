import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import HomeHeroAdmin from "./HomeHeroAdmin";

export const metadata: Metadata = {
  title: "Home Hero Section | Admin",
};

export default async function HomeHeroPage() {
  await requireTeacher();
  const section = await getPageSection("HOME", "HOME_HERO");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Home Hero Section</h1>
        <p className="text-gray-600 mt-1">Manage the hero content at the very top of the home page.</p>
      </div>
      <HomeHeroAdmin initialSectionData={section} />
    </div>
  );
}
