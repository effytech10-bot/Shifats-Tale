import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection, getSectionItems } from "@/features/website-cms/actions/content-actions";
import HomeSuccessAdmin from "./HomeSuccessAdmin";

export const metadata: Metadata = {
  title: "Student Success Stories | Home Admin",
};

export default async function HomeSuccessPage() {
  await requireTeacher();

  // Fetch all available students from the Results page
  const allStudents = await getSectionItems("RESULTS_STUDENTS");

  // Fetch the current featured success settings for the Home page
  const section = await getPageSection("HOME", "HOME_STUDENT_SUCCESS");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Home Page Student Success</h1>
        <p className="text-gray-600 mt-1">Select which student success stories should appear in the 3D carousel on the Home Page.</p>
      </div>

      <HomeSuccessAdmin 
        allItems={allStudents} 
        initialSectionData={section} 
        sectionId={section?.id} 
      />
    </div>
  );
}
