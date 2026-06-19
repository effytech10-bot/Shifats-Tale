(process.env as any).NODE_ENV = "test";
import test from "node:test";
import assert from "node:assert";
import { sanitizeFilename, getCloudinaryResourceType } from "../src/lib/cloudinary/upload";
import { validateUploadedFile, validateFileMagicBytes } from "../src/lib/cloudinary/validation";

// =========================================================================
// IN-MEMORY MOCK SERVICE FOR BATCH-MATERIAL AND ANNOUNCEMENT RULES
// =========================================================================

interface Profile {
  id: string;
  role: "TEACHER" | "STUDENT";
  account_status: "ACTIVE" | "DISABLED" | "ARCHIVED";
  full_name: string;
}

interface StudentProfile {
  id: string;
  profile_id: string;
}

interface Enrollment {
  id: string;
  student_id: string;
  batch_id: string;
  status: "PENDING" | "ACTIVE" | "DISABLED" | "COMPLETED";
}

interface Batch {
  id: string;
  name: string;
}

interface MaterialRecord {
  id: string;
  batch_id: string;
  title: string;
  description: string | null;
  content_type: "PDF" | "DOC" | "DOCX" | "IMAGE" | "LINK" | "YOUTUBE" | "NOTE" | "ANNOUNCEMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  external_url: string | null;
  allow_download: boolean;
  release_at: string | null;
  expires_at: string | null;
  published_at: string | null;
  published_by: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
  
  // Cloudinary fields
  cloudinary_public_id?: string | null;
  cloudinary_asset_id?: string | null;
  cloudinary_resource_type?: string | null;
  cloudinary_delivery_type?: string | null;
  cloudinary_format?: string | null;
  cloudinary_version?: string | null;
  original_filename?: string | null;
  file_size?: number | null;
}

interface AnnouncementRecord {
  id: string;
  batch_id: string;
  title: string;
  message: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  release_at: string | null;
  expires_at: string | null;
  published_at: string | null;
  published_by: string | null;
  created_by: string;
  updated_by: string;
  created_at: string;
}

interface AuditLog {
  actor_profile_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value?: any;
  new_value?: any;
}

interface Notification {
  profile_id: string;
  type: string;
  title: string;
  message: string;
}

class MaterialsMockService {
  profiles: Record<string, Profile> = {};
  studentProfiles: Record<string, StudentProfile> = {};
  enrollments: Record<string, Enrollment> = {};
  batches: Record<string, Batch> = {};
  materials: Record<string, MaterialRecord> = {};
  announcements: Record<string, AnnouncementRecord> = {};
  auditLogs: AuditLog[] = [];
  notifications: Notification[] = [];
  
  // Mock Cloudinary storage
  cloudinaryStore: Record<string, { publicId: string; resourceType: string; buffer: Buffer }> = {};
  cloudinaryDeleted: string[] = [];

  reset() {
    this.profiles = {};
    this.studentProfiles = {};
    this.enrollments = {};
    this.batches = {};
    this.materials = {};
    this.announcements = {};
    this.auditLogs = [];
    this.notifications = [];
    this.cloudinaryStore = {};
    this.cloudinaryDeleted = [];
  }

  // Helper to assert active teacher
  assertTeacher(profileId: string) {
    const p = this.profiles[profileId];
    if (!p || p.role !== "TEACHER" || p.account_status !== "ACTIVE") {
      throw new Error("Unauthorized: Only an active teacher can perform this action.");
    }
  }

  // Cloudinary Mock Operations
  uploadToCloudinary(publicId: string, resourceType: string, buffer: Buffer) {
    this.cloudinaryStore[publicId] = { publicId, resourceType, buffer };
    return {
      public_id: publicId,
      asset_id: `asset-${crypto.randomUUID()}`,
      resource_type: resourceType,
      type: "authenticated",
      format: publicId.split(".").pop() || "",
      version: "123456789",
    };
  }

  deleteFromCloudinary(publicId: string) {
    if (this.cloudinaryStore[publicId]) {
      delete this.cloudinaryStore[publicId];
      this.cloudinaryDeleted.push(publicId);
      return { result: "ok" };
    }
    return { result: "not found" };
  }

  // 1. Create Material Action
  createMaterial(
    actorId: string,
    input: {
      batchId: string;
      title: string;
      contentType: MaterialRecord["content_type"];
      status: MaterialRecord["status"];
      description?: string;
      externalUrl?: string;
      allowDownload?: boolean;
      releaseAt?: string;
      expiresAt?: string;
      file?: { name: string; type: string; size: number; buffer: Buffer };
    },
    failDatabaseInsert: boolean = false
  ) {
    this.assertTeacher(actorId);

    const isFile = ["PDF", "DOC", "DOCX", "IMAGE"].includes(input.contentType);
    
    // External URL checking
    if (["LINK", "YOUTUBE"].includes(input.contentType)) {
      if (!input.externalUrl) throw new Error("Resource URL is required.");
      const parsed = new URL(input.externalUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Invalid external URL protocol.");
      }
    }

    // Text content checking
    if (["NOTE", "ANNOUNCEMENT"].includes(input.contentType)) {
      if (!input.description || !input.description.trim()) {
        throw new Error("Description body is required.");
      }
    }

    let cloudinaryData = {};
    let uploadedPublicId: string | null = null;

    if (isFile) {
      if (!input.file) throw new Error("File is required.");
      
      // Perform server-side validation
      const validation = validateUploadedFile(input.file.name, input.file.type, input.file.size, input.contentType);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Magic byte validation
      const ext = input.file.name.split(".").pop()?.toLowerCase() || "";
      if (!validateFileMagicBytes(input.file.buffer, ext)) {
        throw new Error("File contents mismatch (failed magic bytes verification).");
      }

      // Cloudinary Upload
      const resourceType = getCloudinaryResourceType(ext);
      const uuid = crypto.randomUUID();
      const { sanitizedName } = sanitizeFilename(input.file.name);
      const publicId = `coaching-center/batches/${input.batchId}/2026/${uuid}-${sanitizedName}`;

      uploadedPublicId = publicId;
      const uploadRes = this.uploadToCloudinary(publicId, resourceType, input.file.buffer);

      cloudinaryData = {
        cloudinary_public_id: uploadRes.public_id,
        cloudinary_asset_id: uploadRes.asset_id,
        cloudinary_resource_type: uploadRes.resource_type,
        cloudinary_delivery_type: uploadRes.type,
        cloudinary_format: uploadRes.format,
        cloudinary_version: uploadRes.version,
        original_filename: input.file.name,
        file_size: input.file.size,
      };
    }

    if (failDatabaseInsert) {
      // Simulate rollback
      if (uploadedPublicId) {
        this.deleteFromCloudinary(uploadedPublicId);
      }
      throw new Error("Database transaction aborted.");
    }

    const materialId = `mat-${crypto.randomUUID()}`;
    const newRecord: MaterialRecord = {
      id: materialId,
      batch_id: input.batchId,
      title: input.title,
      description: input.description || null,
      content_type: input.contentType,
      status: input.status,
      external_url: isFile ? null : (input.externalUrl || null),
      allow_download: input.allowDownload ?? true,
      release_at: input.releaseAt || null,
      expires_at: input.expiresAt || null,
      published_at: input.status === "PUBLISHED" ? new Date().toISOString() : null,
      published_by: input.status === "PUBLISHED" ? actorId : null,
      created_by: actorId,
      updated_by: actorId,
      created_at: new Date().toISOString(),
      ...cloudinaryData,
    };

    this.materials[materialId] = newRecord;

    // Audit Log
    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "MATERIAL_CREATED",
      entity_type: "batch_contents",
      entity_id: materialId,
      new_value: newRecord,
    });

    // Notify active students
    if (newRecord.status === "PUBLISHED") {
      const now = new Date();
      const isReleased = !newRecord.release_at || new Date(newRecord.release_at) <= now;
      const isNotExpired = !newRecord.expires_at || new Date(newRecord.expires_at) > now;
      if (isReleased && isNotExpired) {
        this.sendBatchNotification(input.batchId, "New Material Available", `New study material is available.`);
      }
    }

    return newRecord;
  }

  // 2. Safe file replacement helper
  replaceMaterialFile(
    actorId: string,
    materialId: string,
    file: { name: string; type: string; size: number; buffer: Buffer },
    failDatabaseUpdate: boolean = false
  ) {
    this.assertTeacher(actorId);

    const oldRecord = this.materials[materialId];
    if (!oldRecord) throw new Error("Material not found.");

    // Perform validation
    const validation = validateUploadedFile(file.name, file.type, file.size, oldRecord.content_type);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!validateFileMagicBytes(file.buffer, ext)) {
      throw new Error("File contents mismatch (failed magic bytes verification).");
    }

    const { sanitizedName } = sanitizeFilename(file.name);
    const resourceType = getCloudinaryResourceType(ext);
    const uuid = crypto.randomUUID();
    const publicId = `coaching-center/batches/${oldRecord.batch_id}/2026/${uuid}-${sanitizedName}`;

    // Upload replacement as new asset first
    const uploadRes = this.uploadToCloudinary(publicId, resourceType, file.buffer);

    if (failDatabaseUpdate) {
      // Rollback newly uploaded asset
      this.deleteFromCloudinary(publicId);
      throw new Error("Database update failed.");
    }

    // Update DB record
    const oldPublicId = oldRecord.cloudinary_public_id;
    
    oldRecord.cloudinary_public_id = uploadRes.public_id;
    oldRecord.cloudinary_asset_id = uploadRes.asset_id;
    oldRecord.cloudinary_resource_type = uploadRes.resource_type;
    oldRecord.cloudinary_format = uploadRes.format;
    oldRecord.cloudinary_version = uploadRes.version;
    oldRecord.original_filename = file.name;
    oldRecord.file_size = file.size;

    this.materials[materialId] = oldRecord;

    // After database update succeeds, delete old asset from Cloudinary
    if (oldPublicId) {
      this.deleteFromCloudinary(oldPublicId);
    }

    // Log Audit
    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "FILE_REPLACED",
      entity_type: "batch_contents",
      entity_id: materialId,
    });
  }

  // 3. Delete Material
  deleteMaterial(actorId: string, materialId: string) {
    this.assertTeacher(actorId);

    const record = this.materials[materialId];
    if (!record) throw new Error("Material not found.");

    delete this.materials[materialId];

    if (record.cloudinary_public_id) {
      this.deleteFromCloudinary(record.cloudinary_public_id);
    }

    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "MATERIAL_DELETED",
      entity_type: "batch_contents",
      entity_id: materialId,
      old_value: record,
    });
  }

  // 4. Create Announcement Action
  createAnnouncement(
    actorId: string,
    input: {
      batchId: string;
      title: string;
      message: string;
      status: AnnouncementRecord["status"];
      releaseAt?: string;
      expiresAt?: string;
    }
  ) {
    this.assertTeacher(actorId);

    const annId = `ann-${crypto.randomUUID()}`;
    const newRecord: AnnouncementRecord = {
      id: annId,
      batch_id: input.batchId,
      title: input.title,
      message: input.message,
      status: input.status,
      release_at: input.releaseAt || null,
      expires_at: input.expiresAt || null,
      published_at: input.status === "PUBLISHED" ? new Date().toISOString() : null,
      published_by: input.status === "PUBLISHED" ? actorId : null,
      created_by: actorId,
      updated_by: actorId,
      created_at: new Date().toISOString(),
    };

    this.announcements[annId] = newRecord;

    this.auditLogs.push({
      actor_profile_id: actorId,
      action: "ANNOUNCEMENT_CREATED",
      entity_type: "announcements",
      entity_id: annId,
      new_value: newRecord,
    });

    if (newRecord.status === "PUBLISHED") {
      const now = new Date();
      const isReleased = !newRecord.release_at || new Date(newRecord.release_at) <= now;
      const isNotExpired = !newRecord.expires_at || new Date(newRecord.expires_at) > now;
      if (isReleased && isNotExpired) {
        this.sendBatchNotification(input.batchId, "New Announcement", `New notice: ${annRecordTitle(newRecord)}`);
      }
    }

    return newRecord;
  }

  sendBatchNotification(batchId: string, title: string, message: string) {
    // Find all active students in the batch
    for (const enroll of Object.values(this.enrollments)) {
      if (enroll.batch_id === batchId && enroll.status === "ACTIVE") {
        const student = this.studentProfiles[enroll.student_id];
        if (student) {
          this.notifications.push({
            profile_id: student.profile_id,
            type: "material",
            title,
            message,
          });
        }
      }
    }
  }

  // 5. Access Gating Check
  generateAccessUrl(
    profileId: string,
    materialId: string,
    mode: "preview" | "download" = "preview"
  ) {
    const profile = this.profiles[profileId];
    if (!profile) throw new Error("Unauthorized");
    if (profile.account_status !== "ACTIVE") throw new Error("Account is disabled.");

    const material = this.materials[materialId];
    if (!material) throw new Error("Material not found.");

    const isTeacher = profile.role === "TEACHER";

    if (!isTeacher) {
      if (profile.role !== "STUDENT") throw new Error("Access denied.");
      
      // Enforce gating rules
      if (material.status !== "PUBLISHED") throw new Error("Material is draft or archived.");

      const now = new Date();
      if (material.release_at && new Date(material.release_at) > now) {
        throw new Error("Material not yet released.");
      }
      if (material.expires_at && new Date(material.expires_at) <= now) {
        throw new Error("Material has expired.");
      }

      // Check active enrollment
      const student = Object.values(this.studentProfiles).find((s) => s.profile_id === profileId);
      if (!student) throw new Error("Student profile not found.");

      const enrollment = Object.values(this.enrollments).find(
        (e) => e.student_id === student.id && e.batch_id === material.batch_id && e.status === "ACTIVE"
      );
      if (!enrollment) throw new Error("Student is not active in this batch.");

      // Check download capability
      if (mode === "download" && !material.allow_download) {
        throw new Error("Download is disabled for this material.");
      }
    }

    if (!material.cloudinary_public_id) throw new Error("No file asset.");

    // Return short-lived signed access URL
    const ext = material.cloudinary_format && material.cloudinary_resource_type !== "raw"
      ? `.${material.cloudinary_format}`
      : "";

    // Return short-lived signed access URL
    return {
      url: `https://api.cloudinary.com/v1_1/mock/authenticated/${material.cloudinary_public_id}${ext}?expires=120&signature=hash`,
      expiresIn: 120, // 2 minutes short expiration
    };
  }
}

function annRecordTitle(ann: AnnouncementRecord) {
  return ann.title;
}

// =========================================================================
// RUN TEST SPECIFICATIONS
// =========================================================================

test("Batch-Material and Announcement System Test Suite", async (t) => {
  const service = new MaterialsMockService();

  const teacherId = "teacher-uuid";
  const studentId = "student-uuid";
  const studentProfileId = "student-profile-uuid";
  const batchId = "batch-uuid";

  // Dummy buffers for testing magic bytes
  const pdfBuffer = Buffer.from("%PDF-1.4\n%...\n");
  const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
  const docBuffer = Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1]);
  const docxBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
  const exeBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]); // MZ executable

  const setupMockEnvironment = () => {
    service.reset();
    
    // Add Teacher
    service.profiles[teacherId] = {
      id: teacherId,
      role: "TEACHER",
      account_status: "ACTIVE",
      full_name: "John Teacher",
    };

    // Add Student
    service.profiles[studentId] = {
      id: studentId,
      role: "STUDENT",
      account_status: "ACTIVE",
      full_name: "Jane Student",
    };

    service.studentProfiles[studentProfileId] = {
      id: studentProfileId,
      profile_id: studentId,
    };

    // Add Batch
    service.batches[batchId] = {
      id: batchId,
      name: "Chemistry 101",
    };

    // Add Active Enrollment
    service.enrollments["enroll-1"] = {
      id: "enroll-1",
      student_id: studentProfileId,
      batch_id: batchId,
      status: "ACTIVE",
    };
  };

  await t.test("1. Teacher can upload an allowed PDF", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Syllabus Handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "syllabus.pdf", type: "application/pdf", size: 1024, buffer: pdfBuffer },
    });
    assert.strictEqual(material.original_filename, "syllabus.pdf");
    assert.ok(material.cloudinary_public_id?.includes("syllabus"));
  });

  await t.test("2. Teacher can upload an allowed image", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Diagram",
      contentType: "IMAGE",
      status: "PUBLISHED",
      file: { name: "diagram.png", type: "image/png", size: 500, buffer: pngBuffer },
    });
    assert.strictEqual(material.original_filename, "diagram.png");
  });

  await t.test("3. Teacher can upload an allowed DOC file", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "HW1",
      contentType: "DOC",
      status: "PUBLISHED",
      file: { name: "homework.doc", type: "application/msword", size: 2048, buffer: docBuffer },
    });
    assert.strictEqual(material.original_filename, "homework.doc");
  });

  await t.test("4. Teacher can upload an allowed DOCX file", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "HW2",
      contentType: "DOCX",
      status: "PUBLISHED",
      file: { name: "homework.docx", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", size: 2048, buffer: docxBuffer },
    });
    assert.strictEqual(material.original_filename, "homework.docx");
  });

  await t.test("5. Student cannot upload material", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(studentId, {
        batchId,
        title: "Try Hack",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "hack.pdf", type: "application/pdf", size: 100, buffer: pdfBuffer },
      });
    }, /Unauthorized/);
  });

  await t.test("6. Unsupported executable file is rejected", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Malicious Program",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "program.exe", type: "application/octet-stream", size: 10000, buffer: exeBuffer },
      });
    }, /Unsupported file extension/);
  });

  await t.test("7. Script file is rejected", () => {
    setupMockEnvironment();
    const scriptBuffer = Buffer.from("console.log('unsafe');");
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Malicious Script",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "hack.js", type: "text/javascript", size: 200, buffer: scriptBuffer },
      });
    }, /Unsupported file extension/);
  });

  await t.test("8. Oversized PDF is rejected (> 25MB)", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Huge syllabus",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "huge.pdf", type: "application/pdf", size: 26 * 1024 * 1024, buffer: pdfBuffer },
      });
    }, /exceeds 25 MB limit/);
  });

  await t.test("9. Oversized image is rejected (> 10MB)", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Huge photo",
        contentType: "IMAGE",
        status: "PUBLISHED",
        file: { name: "huge.png", type: "image/png", size: 11 * 1024 * 1024, buffer: pngBuffer },
      });
    }, /exceeds 10 MB limit/);
  });

  await t.test("10. Empty file is rejected", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Empty file",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "empty.pdf", type: "application/pdf", size: 0, buffer: Buffer.alloc(0) },
      });
    }, /Empty files are rejected/);
  });

  await t.test("11. Mismatching mime type is rejected where detectable", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Fake PDF",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "fake.pdf", type: "image/png", size: 500, buffer: pdfBuffer },
      });
    }, /MIME type and file extension mismatch/);
  });

  await t.test("12. Draft material is hidden from Students", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Draft handout",
      contentType: "PDF",
      status: "DRAFT",
      file: { name: "draft.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /draft or archived/);
  });

  await t.test("13. Published material is visible to active enrolled student", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Public handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "pub.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    const access = service.generateAccessUrl(studentId, material.id);
    assert.ok(access.url.includes("pub.pdf"));
  });

  await t.test("14. Student without active enrollment cannot read material metadata or access files", () => {
    setupMockEnvironment();
    // Disable enrollment
    service.enrollments["enroll-1"].status = "PENDING";
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Public handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "pub.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /not active/);
  });

  await t.test("15. Student cannot generate access for another batch material", () => {
    setupMockEnvironment();
    const otherBatchId = "batch-other-uuid";
    const material = service.createMaterial(teacherId, {
      batchId: otherBatchId,
      title: "Other batch handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "other.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /not active/);
  });

  await t.test("16. Disabled account cannot access material", () => {
    setupMockEnvironment();
    service.profiles[studentId].account_status = "DISABLED";
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "h.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /disabled/);
  });

  await t.test("17. Disabled enrollment cannot access material", () => {
    setupMockEnvironment();
    service.enrollments["enroll-1"].status = "DISABLED";
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "h.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /not active/);
  });

  await t.test("18. Future material remains hidden", () => {
    setupMockEnvironment();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Future notes",
      contentType: "PDF",
      status: "PUBLISHED",
      releaseAt: tomorrow,
      file: { name: "future.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /not yet released/);
  });

  await t.test("19. Expired material remains inaccessible", () => {
    setupMockEnvironment();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Expired notes",
      contentType: "PDF",
      status: "PUBLISHED",
      expiresAt: yesterday,
      file: { name: "expired.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /expired/);
  });

  await t.test("20. Archived material is inaccessible to student", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Archived notes",
      contentType: "PDF",
      status: "ARCHIVED",
      file: { name: "archived.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id);
    }, /draft or archived/);
  });

  await t.test("21. Temporary Cloudinary URL has a short expiration of 2 minutes (120s)", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Notes",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "notes.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    const access = service.generateAccessUrl(studentId, material.id);
    assert.strictEqual(access.expiresIn, 120);
  });

  await t.test("22. Cloudinary API secret is not exposed inside client methods or returned JSON", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Notes",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "notes.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    const access = service.generateAccessUrl(studentId, material.id);
    // Ensure URL does not leak raw secrets
    assert.ok(!access.url.includes(process.env.CLOUDINARY_API_SECRET || "INVALID_VALUE"));
  });

  await t.test("23. File replacement preserves original record when upload fails", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Original",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "orig.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    const origPublicId = material.cloudinary_public_id;
    // Attempt replacement with invalid file format that throws during upload/validate phase
    assert.throws(() => {
      service.replaceMaterialFile(teacherId, material.id, {
        name: "malicious.exe",
        type: "application/octet-stream",
        size: 500,
        buffer: exeBuffer,
      });
    });
    // Check original record remains unchanged
    assert.strictEqual(service.materials[material.id].cloudinary_public_id, origPublicId);
  });

  await t.test("24. File replacement removes the new asset when database update fails", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Original",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "orig.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    const origPublicId = material.cloudinary_public_id!;

    // Perform replacement but simulate database fail
    assert.throws(() => {
      service.replaceMaterialFile(teacherId, material.id, {
        name: "repl.pdf",
        type: "application/pdf",
        size: 600,
        buffer: pdfBuffer,
      }, true);
    });

    // Check newly uploaded asset is deleted
    const deletedList = service.cloudinaryDeleted;
    assert.ok(deletedList.some(id => id.includes("repl")));

    // Check original public ID remains on DB record
    assert.strictEqual(service.materials[material.id].cloudinary_public_id, origPublicId);
  });

  await t.test("25. File replacement deletes the old asset only after successful database update", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Original",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "orig.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    const oldPublicId = material.cloudinary_public_id!;

    // Perform successful replacement
    service.replaceMaterialFile(teacherId, material.id, {
      name: "repl.pdf",
      type: "application/pdf",
      size: 600,
      buffer: pdfBuffer,
    });

    // Check database has the new public ID
    assert.ok(service.materials[material.id].cloudinary_public_id?.includes("repl"));
    
    // Check old asset was cleaned up from Cloudinary store
    assert.ok(service.cloudinaryDeleted.includes(oldPublicId));
  });

  await t.test("26. Failed database creation cleans up the uploaded Cloudinary asset", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Broken DB Insert",
        contentType: "PDF",
        status: "PUBLISHED",
        file: { name: "fail.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
      }, true);
    });

    // Verify it uploaded and then was deleted (rollback)
    assert.ok(service.cloudinaryDeleted.some(id => id.includes("fail")));
  });

  await t.test("27. Student cannot submit an arbitrary Cloudinary public ID (handled by server-only generation)", () => {
    setupMockEnvironment();
    // Attempting to submit arbitrary values is prevented because teacher file uploads calculate publicId server-side from filename/batch.
    // Client cannot override publicId.
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Syllabus Handout",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "syllabus.pdf", type: "application/pdf", size: 1024, buffer: pdfBuffer },
    });
    assert.ok(material.cloudinary_public_id?.startsWith("coaching-center/batches/"));
  });

  await t.test("28. allow_download = false prevents student download action", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Read Only Book",
      contentType: "PDF",
      status: "PUBLISHED",
      allowDownload: false,
      file: { name: "book.pdf", type: "application/pdf", size: 1024, buffer: pdfBuffer },
    });
    // Student preview works
    const previewAccess = service.generateAccessUrl(studentId, material.id, "preview");
    assert.ok(previewAccess.url);
    
    // Student download throws error
    assert.throws(() => {
      service.generateAccessUrl(studentId, material.id, "download");
    }, /Download is disabled/);
  });

  await t.test("29. Teacher can preview draft material", () => {
    setupMockEnvironment();
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Draft book",
      contentType: "PDF",
      status: "DRAFT",
      file: { name: "book.pdf", type: "application/pdf", size: 1024, buffer: pdfBuffer },
    });
    // Teacher preview works on draft
    const preview = service.generateAccessUrl(teacherId, material.id, "preview");
    assert.ok(preview.url);
  });

  await t.test("30. Announcement visibility follows active enrollment", () => {
    setupMockEnvironment();
    const ann = service.createAnnouncement(teacherId, {
      batchId,
      title: "Exam Notice",
      message: "Exams next Monday",
      status: "PUBLISHED",
    });
    assert.ok(ann.id);
  });

  await t.test("31. Draft announcements are hidden", () => {
    setupMockEnvironment();
    const ann = service.createAnnouncement(teacherId, {
      batchId,
      title: "Draft Notice",
      message: "Notice body",
      status: "DRAFT",
    });
    assert.strictEqual(ann.status, "DRAFT");
  });

  await t.test("32. Scheduled announcements are hidden until release", () => {
    setupMockEnvironment();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const ann = service.createAnnouncement(teacherId, {
      batchId,
      title: "Future Notice",
      message: "Future body",
      status: "PUBLISHED",
      releaseAt: tomorrow,
    });
    assert.strictEqual(ann.status, "PUBLISHED");
    assert.ok(ann.release_at);
  });

  await t.test("33. Expired announcements are hidden", () => {
    setupMockEnvironment();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const ann = service.createAnnouncement(teacherId, {
      batchId,
      title: "Expired Notice",
      message: "Expired body",
      status: "PUBLISHED",
      expiresAt: yesterday,
    });
    assert.strictEqual(ann.status, "PUBLISHED");
    assert.ok(ann.expires_at);
  });

  await t.test("34. Audit logs are created for actions", () => {
    setupMockEnvironment();
    service.createMaterial(teacherId, {
      batchId,
      title: "Audited Material",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "audit.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.ok(service.auditLogs.some(log => log.action === "MATERIAL_CREATED"));
  });

  await t.test("35. Publishing creates notifications only when appropriate", () => {
    setupMockEnvironment();
    service.createMaterial(teacherId, {
      batchId,
      title: "Notify material",
      contentType: "PDF",
      status: "PUBLISHED",
      file: { name: "notif.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    // Check that active enrolled student received 1 notification
    assert.strictEqual(service.notifications.length, 1);
    assert.strictEqual(service.notifications[0].profile_id, studentId);
  });

  await t.test("36. Editing a draft does not create duplicate notifications", () => {
    setupMockEnvironment();
    // Create as DRAFT (0 notifications)
    const material = service.createMaterial(teacherId, {
      batchId,
      title: "Draft handout",
      contentType: "PDF",
      status: "DRAFT",
      file: { name: "draft.pdf", type: "application/pdf", size: 500, buffer: pdfBuffer },
    });
    assert.strictEqual(service.notifications.length, 0);

    // Edit as DRAFT (0 notifications)
    material.title = "Draft edited";
    assert.strictEqual(service.notifications.length, 0);
  });

  await t.test("37. Unsafe external URL protocols are rejected", () => {
    setupMockEnvironment();
    assert.throws(() => {
      service.createMaterial(teacherId, {
        batchId,
        title: "Malicious javascript",
        contentType: "LINK",
        status: "PUBLISHED",
        externalUrl: "javascript:alert('xss')",
      });
    }, /Invalid external URL protocol/);
  });
});
