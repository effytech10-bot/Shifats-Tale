import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutResearchAdmin from "./AboutResearchAdmin";

export const metadata = {
  title: "Research Experience | Teacher CMS",
};

export default async function AboutResearchPage() {
  await requireTeacher();

  // Fetch initial data for the About Research Experience section
  const sectionData = await getPageSection("ABOUT", "ABOUT_RESEARCH_EXP");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Research Experience Setup</h1>
        <p className="text-sm text-gray-500">
          Manage your research projects, focus areas, and outcomes.
        </p>
      </div>

      <AboutResearchAdmin initialSectionData={sectionData} />
    </div>
  );
}
