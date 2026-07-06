import { cloudinary } from "./config";
import { UploadApiResponse } from "cloudinary";
if (process.env.NODE_ENV !== "test" && !process.env.NODE_TEST_CONTEXT) {
  require("server-only");
}

export function sanitizeFilename(filename: string): { sanitizedName: string; extension: string } {
  // Remove control characters, path traversal elements, directory separators, repeated whitespaces
  const name = filename || "file";
  
  // Extract extension
  const parts = name.split(".");
  const ext = parts.length > 1 ? parts.pop() || "" : "";
  let nameWithoutExt = parts.join(".");

  // Remove directory traversals, null bytes, unsafe chars
  nameWithoutExt = nameWithoutExt
    .replace(/\.\./g, "")
    .replace(/[\\/]/g, "")
    .replace(/\0/g, "")
    .replace(/[^\w\s-]/gi, "") // Keep letters, digits, underscores, spaces, hyphens
    .replace(/\s+/g, "_")      // Normalize whitespaces to single underscore
    .trim();

  return {
    sanitizedName: nameWithoutExt || "unnamed",
    extension: ext.toLowerCase(),
  };
}

export function generatePublicId(batchId: string, filename: string): string {
  const uuid = crypto.randomUUID();
  const { sanitizedName } = sanitizeFilename(filename);
  
  return `shifats-tales/${uuid}-${sanitizedName}`;
}

export function getCloudinaryResourceType(extension: string): "image" | "raw" {
  const ext = extension.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "pdf"].includes(ext)) {
    return "image";
  }
  return "raw";
}

export async function uploadPrivateAsset(
  fileBuffer: Buffer,
  publicId: string,
  resourceType: "image" | "raw"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: resourceType,
        type: "authenticated", // Private delivery mode
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Unknown error during Cloudinary upload"));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}
