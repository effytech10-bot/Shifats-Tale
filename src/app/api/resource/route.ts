import { NextRequest, NextResponse } from "next/server";
import { generateR2DownloadUrl } from "@/lib/r2";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
  }

  try {
    const downloadUrl = await generateR2DownloadUrl(key);
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    console.error("Error resolving resource URL:", error);
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 });
  }
}
