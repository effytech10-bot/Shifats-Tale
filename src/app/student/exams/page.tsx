import React from "react";
import { redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { Calendar, Eye, GraduationCap, Clock, Award } from "lucide-react";
import Link from "next/link";

export default async function StudentExamsPage() {
  const { destination, studentProfile } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (!studentProfile) {
    redirect("/");
  }

  const supabase = await createClient();

  // Query active enrollments for student
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("batch_id")
    .eq("student_id", studentProfile.id)
    .eq("status", "ACTIVE");

  const activeBatchIds = enrollments?.map((e) => e.batch_id) || [];

  if (activeBatchIds.length === 0) {
    return (
      <div className="space-y-8 text-xs font-bold text-primary">
        <DashboardPageHeader
          title="My Examinations"
          description="View upcoming class tests, weekly exams schedules, and view published marks."
        />
        <div className="p-8 bg-white border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center">
          <GraduationCap className="h-10 w-10 text-muted stroke-1 mb-4" />
          <h3 className="text-sm font-extrabold text-primary">No Active Enrollments</h3>
          <p className="text-xs text-muted max-w-sm font-medium mt-1 leading-relaxed">
            You must be enrolled actively in at least one batch to view scheduled examinations.
          </p>
        </div>
      </div>
    );
  }

  // Fetch exams for these active batches, excluding DRAFT status
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*, batches(id, name, code)")
    .in("batch_id", activeBatchIds)
    .neq("status", "DRAFT")
    .order("exam_date", { ascending: false });

  if (error) {
    console.error("Failed to query exams for student:", error);
  }

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      <DashboardPageHeader
        title="My Examinations"
        description="View scheduled tests, assignments deadlines, and access published grading sheets."
      />

      <div className="bg-white border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        {exams && exams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-semibold">
              <thead>
                <tr className="bg-slate-50/50 border-b border-border/30 text-muted uppercase tracking-wider font-extrabold text-[10px]">
                  <th className="py-4 px-6">Examination Name</th>
                  <th className="py-4 px-6">Class Batch</th>
                  <th className="py-4 px-6">Type & Date</th>
                  <th className="py-4 px-6 text-center">Marks Config</th>
                  <th className="py-4 px-6 text-center">Status</th>
                  <th className="py-4 px-6 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-primary">
                {exams.map((exam) => {
                  const isPublished = exam.status === "RESULT_PUBLISHED";

                  return (
                    <tr key={exam.id} className="hover:bg-slate-50/30 transition-colors">
                      {/* Exam name */}
                      <td className="py-4 px-6">
                        <span className="font-extrabold text-slate-800 text-sm block">{exam.name}</span>
                        {exam.description && (
                          <span className="text-[10px] text-muted font-normal block mt-0.5 line-clamp-1">
                            {exam.description}
                          </span>
                        )}
                      </td>

                      {/* Batch */}
                      <td className="py-4 px-6 text-slate-700">
                        {exam.batches?.name} ({exam.batches?.code})
                      </td>

                      {/* Type and date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-extrabold block text-slate-800">{exam.exam_type.replace("_", " ")}</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted font-bold mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>{exam.exam_date}</span>
                        </div>
                      </td>

                      {/* Marks */}
                      <td className="py-4 px-6 text-center">
                        <span className="font-extrabold block text-slate-800">Total: {Number(exam.total_marks)}</span>
                        <span className="text-[10px] text-muted font-bold block mt-0.5">Pass: {Number(exam.pass_marks)}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                          isPublished
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {isPublished ? "GRADED" : exam.status}
                        </span>
                      </td>

                      {/* Result visibility link */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        {isPublished ? (
                          <Link
                            href={`/student/batches/${exam.batch_id}/exams/${exam.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white hover:bg-primary-dark text-[10px] font-bold rounded-lg transition-all"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View Score</span>
                          </Link>
                        ) : (
                          <span className="text-[10px] text-muted font-normal italic">
                            Result has not been published yet.
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Award className="h-10 w-10 text-muted/50 stroke-1 mb-3" />
            <h4 className="text-sm font-bold text-primary">No exams scheduled</h4>
            <p className="text-xs text-muted font-medium mt-1 max-w-xs leading-relaxed">
              No exams or tests are configured for your active batches yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
