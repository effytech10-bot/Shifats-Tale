import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutEducationAdmin from "./AboutEducationAdmin";

export const metadata = {
  title: "Education Timeline | Teacher CMS",
};

export default async function AboutEducationPage() {
  await requireTeacher();

  // Fetch initial data for the About Education section
  const sectionData = await getPageSection("ABOUT", "ABOUT_EDUCATION");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Education Timeline Setup</h1>
        <p className="text-sm text-gray-500">
          Manage your academic journey and qualifications.
        </p>
      </div>

      <AboutEducationAdmin initialSectionData={sectionData} />
    </div>
  );
}
