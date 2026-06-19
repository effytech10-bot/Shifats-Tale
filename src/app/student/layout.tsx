import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { StudentShell } from "@/components/dashboard/student-shell";
import { createClient } from "@/lib/supabase/server";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative server-side status resolution
  const { destination, profile, studentProfile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination === "TEACHER_DASHBOARD") {
    redirect("/teacher");
  }
  if (destination === "PENDING_APPROVAL") {
    redirect("/pending-approval");
  }
  if (destination === "ACCOUNT_DISABLED") {
    redirect("/account-disabled");
  }
  if (destination === "INVALID_PROFILE") {
    redirect("/login?error=invalid_profile");
  }

  const supabase = await createClient();
  let activeBatches: any[] = [];

  if (studentProfile) {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        batch:batches (
          id,
          name,
          code,
          subject,
          academic_level
        )
      `)
      .eq("student_id", studentProfile.id)
      .eq("status", "ACTIVE");

    activeBatches = enrollments?.map((e: any) => e.batch).filter(Boolean) || [];
  }

  const userName = profile?.full_name || "Student";
  const userEmail = profile?.email || "";

  return (
    <StudentShell userName={userName} userEmail={userEmail} activeBatches={activeBatches}>
      {children}
    </StudentShell>
  );
}

