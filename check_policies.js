const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const env = fs.readFileSync(".env.local", "utf8").split("\n").reduce((acc, line) => {
  const parts = line.split("=");
  if (parts.length >= 2) {
    acc[parts[0].trim()] = parts.slice(1).join("=").trim().replace(/^"|"$/g, "");
  }
  return acc;
}, {});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: policies, error } = await supabase.from("pg_policies").select("*").eq("tablename", "site_section_items");
  console.log("Policies:", policies, error);
}
check();
