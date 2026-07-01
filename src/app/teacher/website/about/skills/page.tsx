import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutSkillsAdmin from "./AboutSkillsAdmin";

export const metadata = {
  title: "Technical Skills | Teacher CMS",
};

export default async function AboutSkillsPage() {
  await requireTeacher();

  // Fetch initial data for the About Skills section
  const sectionData = await getPageSection("ABOUT", "ABOUT_SKILLS");

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-primary mb-2">Technical Skills Setup</h1>
        <p className="text-gray-500 text-sm">
          Manage your programming languages, frameworks, engineering software, and other technical skills.
        </p>
      </div>

      <AboutSkillsAdmin initialSectionData={sectionData} />
    </div>
  );
}
