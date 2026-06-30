import { Metadata } from "next";
import { requireTeacher } from "@/lib/auth-guards";
import { getPageSection } from "@/features/website-cms/actions/content-actions";
import ContactFAQAdmin from "./ContactFAQAdmin";

export const metadata: Metadata = {
  title: "Contact FAQ | Admin",
};

export default async function ContactFAQPage() {
  await requireTeacher();
  const section = await getPageSection("CONTACT", "CONTACT_FAQ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#08132E]">Contact Page FAQ</h1>
        <p className="text-gray-600 mt-1">Manage the frequently asked questions displayed on the contact page.</p>
      </div>
      <ContactFAQAdmin initialSectionData={section} />
    </div>
  );
}
