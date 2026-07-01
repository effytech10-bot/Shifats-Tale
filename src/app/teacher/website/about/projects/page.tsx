import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutProjectsAdmin from "./AboutProjectsAdmin";

export const metadata = {
  title: "Projects Portfolio | Teacher CMS",
};

export default async function AboutProjectsPage() {
  await requireTeacher();

  // Fetch initial data for the About Projects section
  const sectionData = await getPageSection("ABOUT", "ABOUT_PROJECTS");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-primary mb-2">Projects Grid Setup</h1>
        <p className="text-sm text-gray-500">
          Manage your project portfolio, including featured projects and category filters.
        </p>
      </div>

      <AboutProjectsAdmin initialSectionData={sectionData} />
    </div>
  );
}
