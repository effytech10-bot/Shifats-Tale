import { z } from "zod";

export const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  code: z.string().min(1, "Batch code is required"),
  subject: z.string().min(1, "Subject is required"),
  academicLevel: z.string().min(1, "Academic level is required"),
  description: z.string().optional().nullable().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable().or(z.literal("")),
  monthlyFee: z.coerce.number().nonnegative("Monthly fee must be non-negative"),
  admissionFee: z.coerce.number().nonnegative("Admission fee must be non-negative").default(0),
  capacity: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().positive("Capacity must be positive").nullable().optional()
  ),
  status: z.enum(["DRAFT", "OPEN", "RUNNING", "COMPLETED", "ARCHIVED", "CANCELLED"]),
  admissionOpen: z.boolean().default(false),
  scheduleDays: z.string().optional().nullable().or(z.literal("")),
  scheduleTime: z.string().optional().nullable().or(z.literal("")),
  coverImageUrl: z.string().optional().nullable().or(z.literal("")),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: "End date cannot be before start date",
    path: ["endDate"],
  }
);
export type BatchFormInput = z.infer<typeof batchSchema>;
