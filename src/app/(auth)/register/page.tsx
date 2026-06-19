import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { RegisterView } from "./register-view";

export default async function RegisterPage() {
  // Authoritative server-side status resolution
  const { destination } = await resolveAuthenticatedDestination();

  // If already authenticated, redirect immediately based on role/status
  if (destination === "TEACHER_DASHBOARD") {
    redirect("/teacher");
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

  // If unauthenticated or invalid profile, show the register form
  return <RegisterView />;
}
