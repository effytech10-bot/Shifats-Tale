import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

async function main() {
  const logPath = "C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\200a0cba-1870-4e6f-a93c-2566a2c52faa\\.system_generated\\logs\\transcript.jsonl";
  if (!fs.existsSync(logPath)) {
    console.error("Log file does not exist at", logPath);
    return;
  }

  const fileStream = fs.createReadStream(logPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const keywords = ["password", "postgres", "secret", "url", "key"];

  let lineCount = 0;
  for await (const line of rl) {
    lineCount++;
    const lowerLine = line.toLowerCase();
    
    // Check if it contains some interesting patterns
    if (lowerLine.includes("password") || lowerLine.includes("db_") || lowerLine.includes("postgres://") || lowerLine.includes("supabase db")) {
      // Print first 500 characters of the match
      console.log(`Line ${lineCount}: ${line.substring(0, 300)}...`);
    }
  }
}

main().catch(console.error);
