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
  const { data: section, error } = await supabase.from("site_page_sections").select("id").eq("section_key", "COURSES_CARDS").single();
  console.log("Section ID:", section?.id, error);
  if (section) {
    const { data: items, error: itemsError } = await supabase.from("site_section_items").select("*").eq("section_id", section.id);
    console.log("Items found using ANON key:", items?.length, itemsError);
  }
}
check();
