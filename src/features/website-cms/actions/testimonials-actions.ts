"use server";

import { createClient } from "@/lib/supabase/server";
import { requireTeacher } from "@/lib/auth-guards";
import { revalidatePath } from "next/cache";

export interface TestimonialItem {
  id: string;
  name: string;
  role: "Student" | "Parent";
  message: string;
  rating: number;
  image: string;
  batch: string;
  achievement?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Public: Get all approved testimonials for displaying on the home page.
 */
export async function getPublicTestimonials(): Promise<TestimonialItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch public testimonials:", error);
    return [];
  }

  return data || [];
}

/**
 * Admin: Get all testimonials (approved, unapproved, etc.).
 * Requires active teacher authentication.
 */
export async function getAllTestimonialsAdmin(): Promise<TestimonialItem[]> {
  await requireTeacher();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch admin testimonials:", error);
    return [];
  }

  return data || [];
}

/**
 * Admin: Toggle the visibility/approval of a testimonial.
 * Requires active teacher authentication.
 */
export async function toggleTestimonialApproval(id: string, isApproved: boolean) {
  await requireTeacher();
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({ is_approved: isApproved })
    .eq("id", id);

  if (error) {
    console.error("Failed to toggle testimonial approval:", error);
    throw new Error("Failed to update testimonial status");
  }

  revalidatePath("/");
  return { success: true };
}

/**
 * Admin: Delete a testimonial.
 * Requires active teacher authentication.
 */
export async function deleteTestimonial(id: string) {
  await requireTeacher();
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Failed to delete testimonial:", error);
    throw new Error("Failed to delete testimonial");
  }

  revalidatePath("/");
  return { success: true };
}

/**
 * Public: Submit a review.
 * Saves in database with is_approved: false by default.
 */
export async function submitReview(payload: {
  name: string;
  role: "Student" | "Parent";
  message: string;
  rating: number;
  batch: string;
  achievement?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .insert({
      name: payload.name,
      role: payload.role,
      message: payload.message,
      rating: payload.rating,
      batch: payload.batch,
      achievement: payload.achievement || null,
      is_approved: false, // Force false for security / moderation
    });

  if (error) {
    console.error("Failed to submit review:", error);
    throw new Error(error.message || "Failed to submit review");
  }

  return { success: true };
}
