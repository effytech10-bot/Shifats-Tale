const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const env = fs.readFileSync(".env.local", "utf8").split("\n").reduce((acc, line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join("=").trim().replace(/^"|"$/g, "");
    acc[key] = value;
  }
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCourses() {
  console.log("Checking database for COURSES_CARDS...");
  const { data: section } = await supabase.from("site_page_sections").select("id").eq("section_key", "COURSES_CARDS").single();
  if (!section) return console.log("Section not found");

  const { data: items } = await supabase.from("site_section_items").select("title, status").eq("section_id", section.id).order("sort_order");
  console.log(`Found ${items.length} courses:`);
  items.forEach(i => console.log(`- ${i.title} [${i.status}]`));
}
checkCourses();
