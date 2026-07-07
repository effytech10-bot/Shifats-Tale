const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const env = fs.readFileSync(".env.local", "utf8").split("\n").reduce((acc, line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    acc[parts[0].trim()] = parts.slice(1).join("=").trim().replace(/^"|"$/g, "");
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  // Check if page is published
  const { data: page } = await supabase.from("site_pages").select("*").eq("page_key", "COURSES").single();
  console.log("Page:", page);

  // Check view
  const { data: section } = await supabase.from("vw_public_site_page_sections").select("*").eq("section_key", "COURSES_CARDS").maybeSingle();
  console.log("View Section:", section);
}
check();
