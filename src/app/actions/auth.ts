"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches the generated student code for a newly registered user using Service Role.
 * This is needed because the user might not have an active session yet (email confirmation required),
 * so they cannot bypass RLS themselves.
 */
export async function getStudentCodeByUserId(userId: string) {
  if (!userId) return null;

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Get profile ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_user_id", userId)
      .single();

    if (!profile) return null;

    // 2. Get student code
    const { data: studentProfile } = await supabase
      .from("student_profiles")
      .select("student_code")
      .eq("profile_id", profile.id)
      .single();

    return studentProfile?.student_code || null;
  } catch (error) {
    console.error("Error fetching student code:", error);
    return null;
  }
}
