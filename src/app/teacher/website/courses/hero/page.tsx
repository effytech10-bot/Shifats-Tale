import React from "react";
import { createClient } from "@/lib/supabase/server";
import { requireTeacher } from "@/lib/auth-guards";
import { CoursesHeroForm } from "./hero-form";

export const metadata = {
  title: "Courses Hero - Website Admin",
};

export default async function CoursesHeroAdminPage() {
  await requireTeacher();
  const supabase = await createClient();

  // Fetch the raw base table section because Admin needs all fields (including DRAFT ones)
  // vw_public_site_page_sections only shows PUBLISHED.
  
  // First, find the page id
  const { data: page } = await supabase
    .from("site_pages")
    .select("id")
    .eq("page_key", "COURSES")
    .single();

  let initialData = null;
  if (page) {
    const { data: section } = await supabase
      .from("site_page_sections")
      .select("*")
      .eq("page_id", page.id)
      .eq("section_key", "COURSES_HERO")
      .maybeSingle();
      
    if (section) {
      initialData = section;
      
      // If there's a mediaId, fetch the secure URL to preview it
      if (section.content && typeof section.content === 'object' && 'mediaId' in section.content) {
        const { data: media } = await supabase
          .from("media_assets")
          .select("secure_url")
          .eq("id", section.content.mediaId as string)
          .maybeSingle();
          
        if (media) {
          initialData.mediaUrl = media.secure_url;
        }
      }
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-primary font-display tracking-tight">
          Courses Hero Section
        </h1>
        <p className="text-sm text-muted font-medium mt-1">
          Update the main banner, title, and description of the Courses page.
        </p>
      </div>

      <CoursesHeroForm initialData={initialData} />
    </div>
  );
}
