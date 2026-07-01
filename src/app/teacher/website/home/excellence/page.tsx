import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import ExcellenceAdmin from "./ExcellenceAdmin";

export const metadata: Metadata = {
  title: "Celebrating Excellence | Admin",
};

export default async function ExcellencePage() {
  await requireTeacher();
  const section = await getPageSection("HOME", "HOME_TOP_STUDENTS");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Celebrating Excellence (Top of the Month)</h1>
        <p className="text-gray-600 mt-1">Manage the top students for each month shown on the home page.</p>
      </div>
      <ExcellenceAdmin initialSectionData={section} />
    </div>
  );
}
