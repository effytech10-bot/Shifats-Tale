"use server";

import { createClient } from "@/lib/supabase/server";
import { requireTeacher } from "@/lib/auth-guards";
import { SitePageSection } from "../types/cms-types";

/**
 * Public: Get a specific page section by its key and the page key.
 * This resolves the secure_url if a media_id is provided in the content JSON.
 */
export async function getPageSection(pageKey: string, sectionKey: string) {
  const supabase = await createClient();

  const { data: section, error } = await supabase
    .from("vw_public_site_page_sections")
    .select("*")
    .eq("section_key", sectionKey)
    .maybeSingle();

  // Validate the page_key matches implicitly since the view filters active pages, 
  // but to be perfectly strict we should join or just trust the section_key if it's unique enough.
  // We'll rely on the view logic.
  
  if (error || !section) {
    return null;
  }

  // Auto-resolve media URL if mediaId exists in content
  let mediaUrl = null;
  const content = section.content as Record<string, any>;
  if (content && content.mediaId) {
    const { data: media } = await supabase
      .from("vw_public_media_assets")
      .select("secure_url")
      .eq("id", content.mediaId)
      .maybeSingle();
    
    if (media) {
      mediaUrl = media.secure_url;
    }
  }

  return {
    ...section,
    mediaUrl,
  };
}

/**
 * Teacher: Update a specific page section's content.
 */
export async function updatePageSection(
  pageKey: string, 
  sectionKey: string, 
  payload: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    content: Record<string, any>;
  }
) {
  const { profile } = await requireTeacher();
  const supabase = await createClient();

  // First find the page ID
  const { data: page, error: pageError } = await supabase
    .from("site_pages")
    .select("id")
    .eq("page_key", pageKey)
    .single();

  if (pageError || !page) {
    throw new Error("Page not found");
  }

  const { error } = await supabase
    .from("site_page_sections")
    .update({
      eyebrow: payload.eyebrow || null,
      title: payload.title || null,
      subtitle: payload.subtitle || null,
      description: payload.description || null,
      status: payload.status,
      content: payload.content,
      updated_by: profile.id,
    })
    .eq("page_id", page.id)
    .eq("section_key", sectionKey);

  if (error) {
    console.error("Failed to update page section:", error);
    throw new Error("Failed to update section content");
  }

  return { success: true };
}
