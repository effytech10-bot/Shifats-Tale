import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { getPageSection, getSectionItems } from "@/features/website-cms/actions/content-actions";

export const metadata: Metadata = {
  title: "Shifat's Tales | Admission & Academic Care",
  description: "Providing quality education to build the future of our students.",
};

export default async function HomePage() {
  const allCourses = await getSectionItems("COURSES_CARDS");
  const homeCoursesSection = await getPageSection("HOME", "HOME_FEATURED_COURSES");
  
  const selectedCourseIds: string[] = homeCoursesSection?.content?.selectedCourseIds || [];
  
  // Filter courses based on selected IDs and preserve the selection order
  const featuredCourses = selectedCourseIds
    .map(id => allCourses.find(c => c.id === id))
    .filter(Boolean);

  // Fallback to all courses if none are selected (for initial state before admin selects any)
  const displayCourses = featuredCourses.length > 0 ? featuredCourses : allCourses.slice(0, 5);

  const allStudents = await getSectionItems("RESULTS_STUDENT_CARDS");
  const homeSuccessSection = await getPageSection("HOME", "HOME_STUDENT_SUCCESS");
  
  const selectedStudentIds: string[] = homeSuccessSection?.content?.selectedStudentIds || [];
  
  // Filter students based on selected IDs and preserve the selection order
  const featuredStudents = selectedStudentIds
    .map(id => allStudents.find(s => s.id === id))
    .filter(Boolean);

  // Fallback to all students if none are selected
  const displayStudents = featuredStudents.length > 0 ? featuredStudents : allStudents.slice(0, 5);

  return <HomeClient 
    displayCourses={displayCourses} 
    headerData={homeCoursesSection} 
    displayStudents={displayStudents}
    successHeaderData={homeSuccessSection}
  />;
}
