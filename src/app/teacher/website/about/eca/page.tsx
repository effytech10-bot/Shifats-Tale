import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import AboutECAAdmin from "./AboutECAAdmin";

export const metadata = {
  title: "ECA Portfolio | Teacher CMS",
};

export default async function AboutECAPage() {
  await requireTeacher();

  // Fetch initial data for the About ECA section
  const sectionData = await getPageSection("ABOUT", "ABOUT_ECA");

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-primary mb-2">Extra Curricular Activities</h1>
        <p className="text-gray-500 text-sm">
          Manage your volunteer experiences, club leadership roles, and other activities.
        </p>
      </div>

      <AboutECAAdmin initialSectionData={sectionData} />
    </div>
  );
}
