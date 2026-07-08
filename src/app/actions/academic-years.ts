"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Fetches the distinct academic years (academic_level) from the batches table.
 * Used for the student registration dropdown.
 */
export async function getDistinctAcademicYears() {
  const supabase = await createClient();

  // We use a simple select and distinct to get unique years.
  // Note: Since 'academic_level' is a free text field previously, 
  // we filter out invalid ones if necessary, but returning distinct is fine.
  
  // Wait, Supabase RPC or raw query is needed for true DISTINCT in some versions,
  // but we can just fetch all academic_levels and deduplicate in JS since batches count isn't massive.
  
  const { data, error } = await supabase
    .from("batches")
    .select("academic_level");

  if (error || !data) {
    console.error("Error fetching academic years:", error);
    return [];
  }

  // Deduplicate and filter out empty values
  const uniqueYears = Array.from(new Set(data.map(b => b.academic_level).filter(Boolean)));
  
  // Sort descending so newer years are at the top
  uniqueYears.sort((a, b) => b.localeCompare(a));

  return uniqueYears;
}
