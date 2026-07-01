import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import MeetTeacherAdmin from "./MeetTeacherAdmin";

export const metadata: Metadata = {
  title: "Meet Teacher Section | Admin",
};

export default async function MeetTeacherPage() {
  await requireTeacher();
  const section = await getPageSection("HOME", "HOME_TEACHER");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Meet Teacher Section</h1>
        <p className="text-gray-600 mt-1">Manage the teacher profile and methodology displayed on the home page.</p>
      </div>
      <MeetTeacherAdmin initialSectionData={section} />
    </div>
  );
}
