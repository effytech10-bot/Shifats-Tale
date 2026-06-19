import { createAdminClient } from "./supabase/admin";

export async function createNotification({
  studentProfileId,
  type,
  title,
  message,
  relatedEntityType = null,
  relatedEntityId = null,
}: {
  studentProfileId: string;
  type: string;
  title: string;
  message: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}) {
  try {
    const admin = createAdminClient();
    const { data: student, error: studentError } = await admin
      .from("student_profiles")
      .select("profile_id")
      .eq("id", studentProfileId)
      .single();

    if (studentError || !student) {
      console.error("Student profile not found for notification:", studentError);
      return;
    }

    const { error: insertError } = await admin.from("notifications").insert({
      user_id: student.profile_id,
      type,
      title,
      message,
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId,
    });

    if (insertError) {
      console.error("Failed to insert notification:", insertError);
    }
  } catch (err) {
    console.error("Exception occurred while creating notification:", err);
  }
}

export async function createNotificationForProfile({
  profileId,
  type,
  title,
  message,
  relatedEntityType = null,
  relatedEntityId = null,
}: {
  profileId: string;
  type: string;
  title: string;
  message: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}) {
  try {
    const admin = createAdminClient();
    const { error: insertError } = await admin.from("notifications").insert({
      user_id: profileId,
      type,
      title,
      message,
      related_entity_type: relatedEntityType,
      related_entity_id: relatedEntityId,
    });

    if (insertError) {
      console.error("Failed to insert notification for profile:", insertError);
    }
  } catch (err) {
    console.error("Exception occurred while creating notification for profile:", err);
  }
}
