import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a client-side Supabase browser client.
 * Uses only public environment variables. Safe to call in client components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Singleton browser client instance
export const supabase = createClient();

