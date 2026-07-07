const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const env = fs.readFileSync(".env.local", "utf8").split("\n").reduce((acc, line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    acc[parts[0].trim()] = parts.slice(1).join("=").trim().replace(/^"|"$/g, "");
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function check() {
  const { data: section } = await supabase.from("vw_public_site_page_sections").select("id").eq("section_key", "COURSES_CARDS").single();
  const { data, error } = await supabase.from("vw_public_site_section_items").select("*, media:media_assets(secure_url)").eq("section_id", section.id);
  console.log(data, error);
}
check();
