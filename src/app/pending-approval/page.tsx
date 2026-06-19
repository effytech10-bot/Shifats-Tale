import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { siteInfo } from "@/data/site";
import { PendingApprovalView } from "./pending-approval-view";

export default async function PendingApprovalPage() {
  // Authoritative server-side verification checks
  const {
    destination,
    profile,
    studentProfile,
  } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination === "TEACHER_DASHBOARD") {
    redirect("/teacher");
  }
  if (destination === "STUDENT_DASHBOARD") {
    redirect("/student");
  }
  if (destination === "ACCOUNT_DISABLED") {
    redirect("/account-disabled");
  }
  if (destination === "INVALID_PROFILE") {
    redirect("/login?error=invalid_profile");
  }

  const studentName = profile?.full_name || "Student";
  const studentCode = studentProfile?.student_code || "N/A";
  const regStatus = studentProfile?.registration_status || "PENDING";
  const regDate = studentProfile?.registered_at
    ? new Date(studentProfile.registered_at).toLocaleDateString()
    : "N/A";

  return (
    <PendingApprovalView
      studentName={studentName}
      studentCode={studentCode}
      registrationStatus={regStatus}
      registrationDate={regDate}
      contactPhone={siteInfo.phone}
      contactEmail={siteInfo.email}
    />
  );
}
