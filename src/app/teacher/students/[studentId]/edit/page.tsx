import React from "react";
import { notFound, redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { StudentEditForm } from "./student-edit-form";

interface PageProps {
  params: Promise<{
    studentId: string;
  }>;
}

export default async function TeacherStudentEditPage({ params }: PageProps) {
  const { studentId } = await params;
  const { profile, destination } = await resolveAuthenticatedDestination();

  if (destination !== "TEACHER_DASHBOARD" || !profile) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Fetch Student Profile details
  const { data: student, error } = await supabase
    .from("student_profiles")
    .select(`
      id,
      profile_id,
      student_code,
      academic_level,
      institution,
      guardian_name,
      guardian_phone,
      address,
      date_of_birth,
      registration_status,
      profile:profiles (
        id,
        full_name,
        phone,
        account_status
      )
    `)
    .eq("id", studentId)
    .single();

  if (error || !student) {
    console.error("DEBUG [TeacherStudentEditPage]: Fetching student_profile failed:", { studentId, error, student });
    notFound();
  }

  // Fetch teacher note using the RPC helper since column-level privileges are restricted
  const { data: teacherNote } = await supabase.rpc("get_student_teacher_note", {
    student_uuid: studentId
  });

  const studentProfileObj = (student.profile as any) || {};

  const initialData = {
    fullName: studentProfileObj.full_name || "",
    phone: studentProfileObj.phone || "",
    academicLevel: student.academic_level || "",
    institution: student.institution || "",
    guardianName: student.guardian_name || "",
    guardianPhone: student.guardian_phone || "",
    address: student.address || "",
    dateOfBirth: student.date_of_birth,
    registrationStatus: student.registration_status as "PENDING" | "APPROVED" | "REJECTED",
    accountStatus: studentProfileObj.account_status as "ACTIVE" | "DISABLED" | "ARCHIVED",
    teacherNote: teacherNote,
    studentCode: student.student_code,
  };

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        title={`Edit Student: ${studentProfileObj.full_name}`}
        description="Modify student demographics, parent contacts, registration status, class settings, and check Student ID overrides."
      />

      <StudentEditForm studentId={studentId} initialData={initialData} />
    </div>
  );
}
