import * as fs from "fs";
import * as path from "path";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// 1. Load environment variables from .env.local manually for the script
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      // Remove surrounding quotes if present
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    });
    console.log("Successfully loaded environment from .env.local");
  } else {
    console.warn("Warning: .env.local file not found. Using system environment variables.");
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || supabaseUrl.includes("placeholder-project")) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL is not set or is using a placeholder.");
  process.exit(1);
}

if (!serviceRoleKey || serviceRoleKey.includes("placeholder-service-role-key")) {
  console.error("Error: SUPABASE_SERVICE_ROLE_KEY is not set or is using a placeholder.");
  process.exit(1);
}

// Create Supabase Admin client
const supabaseAdmin = createSupabaseClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.log(`
Usage:
  npx ts-node scripts/setup-teacher.ts <email> <password> "<full_name>"

Example:
  npx ts-node scripts/setup-teacher.ts teacher@coaching.com SecurePass123 "Teacher Admin"
`);
    process.exit(1);
  }

  const email = args[0].trim().toLowerCase();
  const password = args[1];
  const fullName = args[2].trim();

  console.log(`Setting up Teacher account for email: ${email}...`);

  // Step A: Check if profile already exists
  const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("email", email)
    .maybeSingle();

  if (profileCheckError) {
    console.error("Error checking existing profiles:", profileCheckError.message);
    process.exit(1);
  }

  let userId: string;

  if (!existingProfile) {
    console.log(`User profile does not exist. Creating auth user: ${email}...`);
    // Create new auth user
    const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    });

    if (createUserError) {
      console.error("Failed to create auth user:", createUserError.message);
      process.exit(1);
    }

    if (!newUser.user) {
      console.error("User creation succeeded but user object is empty.");
      process.exit(1);
    }

    userId = newUser.user.id;
    console.log(`Auth user successfully created with ID: ${userId}`);

    // Wait a brief moment for public trigger handle_new_user to finish inserting profile
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } else {
    console.log(`Auth user/profile already exists for ${email}. Proceeding to promote...`);
  }

  // Step B: Call setup_teacher_account RPC function to promote the user to Teacher
  console.log("Promoting user to TEACHER role...");
  const { error: rpcError } = await supabaseAdmin.rpc("setup_teacher_account", {
    email_to_promote: email,
  });

  if (rpcError) {
    console.error("Failed to execute setup_teacher_account RPC function:", rpcError.message);
    process.exit(1);
  }

  // Step C: Verify setup
  const { data: updatedProfile, error: verifyError } = await supabaseAdmin
    .from("profiles")
    .select("id, role, account_status")
    .eq("email", email)
    .single();

  if (verifyError) {
    console.error("Error verifying promoted profile:", verifyError.message);
    process.exit(1);
  }

  console.log("\nSetup Complete!");
  console.log("----------------------------------------");
  console.log(`Email:          ${email}`);
  console.log(`Profile ID:     ${updatedProfile.id}`);
  console.log(`Role:           ${updatedProfile.role}`);
  console.log(`Account Status: ${updatedProfile.account_status}`);
  console.log("----------------------------------------");
  console.log("The Teacher account is now active and ready.");
}

main().catch((err) => {
  console.error("Unhandled error during setup:", err);
  process.exit(1);
});
