const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    });
    console.log("Loaded environment variables.");
  }
}

loadEnv();

let dbUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("No database URL found in env.");
  process.exit(1);
}

// Percent-encode the password if it contains special characters
if (dbUrl.includes("effy@Tech-S-A-S1") && !dbUrl.includes("effy%40Tech-S-A-S1")) {
  dbUrl = dbUrl.replace("effy@Tech-S-A-S1", "effy%40Tech-S-A-S1");
}

console.log("Using Database URL:", dbUrl.replace(/:[^:]+@/, ":****@"));

// Read the migration file
const migrationFilePath = path.resolve(process.cwd(), "supabase/migrations/20260706000000_create_testimonials.sql");
if (!fs.existsSync(migrationFilePath)) {
  console.error("Migration file not found at:", migrationFilePath);
  process.exit(1);
}

const migrationSql = fs.readFileSync(migrationFilePath, "utf-8");

// Split by semicolon, but ignore semicolons inside quotes or comments if possible.
// In our migration, simple split by semicolon works as long as we're careful.
// Let's split using a custom marker in the sql, or a robust splitter.
// To be extremely simple and robust, let's write a custom splitter that handles strings.
function splitStatements(sql) {
  const statements = [];
  let current = "";
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inComment = false;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    const nextChar = sql[i + 1];
    
    if (inComment) {
      if (char === "\n") {
        inComment = false;
      }
      continue;
    }
    
    if (char === "-" && nextChar === "-") {
      inComment = true;
      i++;
      continue;
    }
    
    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      current += char;
      continue;
    }
    
    if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += char;
      continue;
    }
    
    if (char === ";" && !inSingleQuote && !inDoubleQuote) {
      if (current.trim()) {
        statements.push(current.trim() + ";");
      }
      current = "";
      continue;
    }
    
    current += char;
  }
  
  if (current.trim()) {
    statements.push(current.trim());
  }
  
  return statements;
}

const statements = splitStatements(migrationSql);
const tempFilePath = path.resolve(process.cwd(), "temp_statement.sql");

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i].trim();
  if (!statement) continue;
  
  console.log(`Executing statement ${i + 1}/${statements.length}...`);
  
  // Write statement to temp file
  fs.writeFileSync(tempFilePath, statement, "utf-8");
  
  try {
    const output = execSync(`npx supabase db query --db-url "${dbUrl}" -f "${tempFilePath}"`, { encoding: "utf-8" });
    if (output.includes("Error") && !output.includes("warning")) {
      console.error(`Error in statement ${i + 1}:`, output);
      fs.unlinkSync(tempFilePath);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Execution failed for statement ${i + 1}:`, err.message);
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
    process.exit(1);
  }
}

if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
console.log("Migration executed successfully!");
