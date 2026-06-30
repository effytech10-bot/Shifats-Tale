import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import ContactInfoAdmin from "./ContactInfoAdmin";

export const metadata: Metadata = {
  title: "Contact Info | Admin",
};

export default async function ContactInfoPage() {
  await requireTeacher();
  const section = await getPageSection("CONTACT", "CONTACT_INFO");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Contact Page Information</h1>
        <p className="text-gray-600 mt-1">Manage the address, location details, and map links for the contact page.</p>
      </div>
      <ContactInfoAdmin initialSectionData={section} />
    </div>
  );
}
