import React from "react";
import { notFound, redirect } from "next/navigation";
import { resolveAuthenticatedDestination } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { DashboardPageHeader } from "@/components/dashboard/dashboard-page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ExamActionsPanel } from "./exam-actions-panel";
import { 
  ArrowLeft, 
  Edit, 
  ListTodo, 
  Calendar, 
  Users, 
  Award, 
  Clock, 
  TrendingUp, 
  Percent, 
  FileText 
} from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    examId: string;
  }>;
}

export default async function ExamDetailsPage({ params }: PageProps) {
  const { examId } = await params;
  const { destination } = await resolveAuthenticatedDestination();

  if (destination === "UNAUTHENTICATED") {
    redirect("/login");
  }
  if (destination !== "TEACHER_DASHBOARD") {
    redirect("/");
  }

  const supabase = await createClient();

  // Query exam details
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select("*, batches(id, name, code)")
    .eq("id", examId)
    .single();

  if (examError || !exam) {
    notFound();
  }

  // Query all eligible enrollments (ACTIVE and COMPLETED)
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      student:student_profiles (
        id,
        student_code,
        profile:profiles (
          full_name
        )
      )
    `)
    .eq("batch_id", exam.batch_id)
    .in("status", ["ACTIVE", "COMPLETED"]);

  // Query all entered results for this exam
  const { data: results } = await supabase
    .from("exam_results")
    .select(`
      *,
      student:student_profiles (
        id,
        student_code,
        profile:profiles (
          full_name
        )
      )
    `)
    .eq("exam_id", examId);

  // Statistics calculation
  const enrolledCount = enrollments?.length || 0;
  const enteredCount = results?.length || 0;

  let presentCount = 0;
  let absentCount = 0;
  let passCount = 0;
  let failCount = 0;

  const presentMarks: number[] = [];

  results?.forEach((r) => {
    if (r.attendance_status === "ABSENT") {
      absentCount++;
    } else {
      presentCount++;
      const marks = r.obtained_marks !== null ? Number(r.obtained_marks) : 0;
      presentMarks.push(marks);
      if (marks >= Number(exam.pass_marks)) {
        passCount++;
      } else {
        failCount++;
      }
    }
  });

  const missingCount = Math.max(0, enrolledCount - enteredCount);

  // Average, highest, lowest
  const highestMark = presentMarks.length > 0 ? Math.max(...presentMarks) : 0;
  const lowestMark = presentMarks.length > 0 ? Math.min(...presentMarks) : 0;
  
  const sumMarks = presentMarks.reduce((sum, m) => sum + m, 0);
  const averageMark = presentMarks.length > 0 ? (sumMarks / presentMarks.length).toFixed(2) : "0.00";
  
  const passPercentage = presentCount > 0 ? ((passCount / presentCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 text-xs font-bold text-primary">
      {/* Header bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Link
            href="/teacher/exams"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-bold text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Examinations
          </Link>

          <div className="flex gap-2">
            {exam.status !== "RESULT_PUBLISHED" && (
              <Link
                href={`/teacher/exams/${exam.id}/edit`}
                className="px-3.5 py-1.5 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all flex items-center gap-1.5"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Exam</span>
              </Link>
            )}
            
            {exam.status !== "RESULT_PUBLISHED" && (
              <Link
                href={`/teacher/exams/${exam.id}/results`}
                className="px-4 py-1.5 bg-primary text-white hover:bg-primary-dark text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ListTodo className="h-4 w-4" />
                <span>Enter Marks</span>
              </Link>
            )}
          </div>
        </div>

        <DashboardPageHeader
          title={exam.name}
          description={`Details, publication controls, and performance metrics for examination under batch ${exam.batches?.name}.`}
        />
      </div>

      {/* Main Grid: Details & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Info and Statistics card (spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary dashboard widgets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-center">
              <span className="text-2xl font-extrabold text-slate-700 font-display block leading-none">
                {enrolledCount}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wide mt-2 block">
                Total Enrolled
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center">
              <span className="text-2xl font-extrabold text-emerald-700 font-display block leading-none">
                {passCount}
              </span>
              <span className="text-[9px] uppercase font-bold text-emerald-600/80 tracking-wide mt-2 block">
                Passed
              </span>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
              <span className="text-2xl font-extrabold text-rose-700 font-display block leading-none">
                {failCount}
              </span>
              <span className="text-[9px] uppercase font-bold text-rose-600/80 tracking-wide mt-2 block">
                Failed
              </span>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
              <span className="text-2xl font-extrabold text-amber-700 font-display block leading-none">
                {absentCount}
              </span>
              <span className="text-[9px] uppercase font-bold text-amber-600/80 tracking-wide mt-2 block">
                Absent
              </span>
            </div>
          </div>

          {/* Core attributes & Grade statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Exam Parameters card */}
            <DashboardCard
              title="Exam Configuration"
              description="Basic schedule and mark criteria specifications"
              icon={<Calendar className="h-5 w-5 text-primary" />}
            >
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2 text-primary">
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Subject Batch</span>
                  <span className="font-extrabold mt-0.5 block">{exam.batches?.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Exam Type</span>
                  <span className="font-extrabold mt-0.5 block">{exam.exam_type.replace("_", " ")}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Total Marks</span>
                  <span className="font-extrabold mt-0.5 block text-slate-800">{Number(exam.total_marks)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Pass Marks</span>
                  <span className="font-extrabold mt-0.5 block text-rose-700">{Number(exam.pass_marks)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Exam Date</span>
                  <span className="font-extrabold mt-0.5 block">{exam.exam_date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Start & Duration</span>
                  <span className="font-extrabold mt-0.5 block">
                    {exam.start_time || "N/A"} &bull; {exam.duration ? `${exam.duration} mins` : "N/A"}
                  </span>
                </div>
              </div>

              {exam.description && (
                <div className="border-t border-border/20 pt-3 mt-3 text-xs text-muted leading-relaxed font-medium">
                  <span className="text-[10px] text-muted uppercase font-bold block mb-1">Syllabus / Notes</span>
                  {exam.description}
                </div>
              )}
            </DashboardCard>

            {/* Performance analysis metrics */}
            <DashboardCard
              title="Academic Analysis"
              description="Overall performance values from graded students"
              icon={<TrendingUp className="h-5 w-5 text-primary" />}
            >
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2 text-primary">
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Highest Score</span>
                  <span className="font-extrabold mt-0.5 block text-emerald-700 text-sm font-display">{highestMark}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Lowest Score</span>
                  <span className="font-extrabold mt-0.5 block text-rose-700 text-sm font-display">{lowestMark}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Average Mark</span>
                  <span className="font-extrabold mt-0.5 block text-slate-800 text-sm font-display">{averageMark}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Pass Rate</span>
                  <span className="font-extrabold mt-0.5 block text-emerald-700 text-sm font-display">{passPercentage}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Missing Entries</span>
                  <span className={`font-extrabold mt-0.5 block text-sm font-display ${missingCount > 0 ? "text-amber-600" : "text-emerald-700"}`}>
                    {missingCount}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted uppercase font-bold block">Exam Status</span>
                  <span className="mt-0.5 block">
                    <StatusBadge status={exam.status} />
                  </span>
                </div>
              </div>
            </DashboardCard>

          </div>

          {/* Results spreadsheet details review list */}
          <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold border-b border-border/20 pb-2">Student Gradelist review</h3>
            
            {results && results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-border/20 text-muted uppercase tracking-wider text-[9px] font-extrabold">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Student ID</th>
                      <th className="pb-3 text-center">Attendance</th>
                      <th className="pb-3 text-center">Obtained Marks</th>
                      <th className="pb-3 text-center">Grade</th>
                      <th className="pb-3 text-center">Rank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r: any) => {
                      const student = r.student;
                      const profile = student?.profile;
                      const isAbsent = r.attendance_status === "ABSENT";
                      
                      return (
                        <tr key={r.id} className="border-b border-border/10 last:border-0 hover:bg-slate-50/20 transition-colors">
                          <td className="py-2.5 font-extrabold text-primary">
                            {profile?.full_name || "Student"}
                          </td>
                          <td className="py-2.5 font-display text-primary">
                            {student?.student_code || "N/A"}
                          </td>
                          <td className="py-2.5 text-center">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black border ${
                              isAbsent ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
                            }`}>
                              {r.attendance_status}
                            </span>
                          </td>
                          <td className="py-2.5 text-center font-display font-extrabold">
                            {isAbsent ? "-" : Number(r.obtained_marks)}
                          </td>
                          <td className="py-2.5 text-center font-display font-black text-slate-800">
                            {r.grade || "-"}
                          </td>
                          <td className="py-2.5 text-center font-display font-black text-amber-700">
                            {r.rank !== null ? `#${r.rank}` : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-6 text-xs text-muted font-bold">No results recorded yet for this exam.</p>
            )}
          </div>

        </div>

        {/* Right operations sidebar */}
        <div className="space-y-6">
          <ExamActionsPanel
            examId={exam.id}
            status={exam.status}
            enrolledCount={enrolledCount}
            enteredCount={enteredCount}
            presentCount={presentCount}
            absentCount={absentCount}
            passCount={passCount}
            failCount={failCount}
          />
        </div>

      </div>
    </div>
  );
}
