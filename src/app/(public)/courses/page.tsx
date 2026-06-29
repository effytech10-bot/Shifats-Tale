import { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
  title: "Available Courses & Batches | Shifat's Tales",
  description: "Explore our curriculum programs designed to guide students towards absolute clarity in board and admission exams.",
};

export default function CoursesPage() {
  return <CoursesClient />;
}
