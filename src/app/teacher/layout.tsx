import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { TeacherShell } from "@/components/dashboard/teacher-shell";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative server-side status resolution
  const { destination, profile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination === "STUDENT_DASHBOARD") {
    redirect("/student");
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

  const userName = profile?.full_name || "Teacher";
  const userEmail = profile?.email || "";

  return (
    <TeacherShell userName={userName} userEmail={userEmail}>
      {children}
    </TeacherShell>
  );
}
