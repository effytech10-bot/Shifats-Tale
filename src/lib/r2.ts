import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!;
export const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME!;

if (!accountId || !accessKeyId || !secretAccessKey || !r2BucketName) {
  console.warn("Cloudflare R2 credentials are not fully configured in environment variables.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
  forcePathStyle: true,
  requestChecksumCalculation: "WHEN_REQUIRED",
  responseChecksumValidation: "WHEN_REQUIRED",
});

export async function generateR2UploadUrl(filename: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: r2BucketName,
    Key: filename,
    ContentType: contentType,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

export async function generateR2DownloadUrl(filename: string) {
  const command = new GetObjectCommand({
    Bucket: r2BucketName,
    Key: filename,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
}

export async function deleteR2File(filename: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: r2BucketName,
      Key: filename,
    });
    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error("Failed to delete R2 file:", error);
    return false;
  }
}
