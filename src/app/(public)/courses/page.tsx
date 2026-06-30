import { Metadata } from "next";
import CoursesClient from "./CoursesClient";
import { getPageSection } from "@/features/website-cms/actions/content-actions";

export const metadata: Metadata = {
  title: "Available Courses & Batches | Shifat's Tales",
  description: "Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.",
};

export default async function CoursesPage() {
  const heroSection = await getPageSection("COURSES", "COURSES_HERO");

  return <CoursesClient heroData={heroSection} />;
}
