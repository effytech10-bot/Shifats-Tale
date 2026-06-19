import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { StudentShell } from "@/components/dashboard/student-shell";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authoritative server-side status resolution
  const { destination, profile } = await resolveAuthenticatedDestination();

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

  const userName = profile?.full_name || "Student";
  const userEmail = profile?.email || "";

  return (
    <StudentShell userName={userName} userEmail={userEmail}>
      {children}
    </StudentShell>
  );
}
