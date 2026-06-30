import { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { getPageSection, getSectionItems } from "@/features/website-cms/actions/content-actions";

export const metadata: Metadata = {
  title: "Courses & Batches | Shifat's Tales",
  description: "Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.",
};

export default async function CoursesPage() {
  const heroData = await getPageSection("COURSES", "COURSES_HERO");
  const courseItems = await getSectionItems("COURSES_CARDS");

  return <CoursesClient heroData={heroData} courseItems={courseItems} />;
}
