"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveDraftResultsAction } from "@/app/actions/exams";
import { 
  Loader2, 
  Search, 
  Filter, 
  Check, 
  AlertTriangle, 
  Sparkles, 
  Undo2, 
  UserCheck, 
  BookOpen, 
  FileText,
  XCircle 
} from "lucide-react";
import Link from "next/link";
import { calculateGrade, calculatePassFailStatus } from "@/lib/exams/grading";

interface Student {
  enrollmentId: string;
  studentId: string;
  studentCode: string;
  fullName: string;
  enrollmentStatus: string;
}

interface ResultRecord {
  studentId: string;
  enrollmentId: string;
  attendanceStatus: "PRESENT" | "ABSENT";
  obtainedMarks: number | null;
  remarks: string;
}

interface Props {
  examId: string;
  exam: {
    name: string;
    total_marks: number;
    pass_marks: number;
    status: string;
    batch_id: string;
  };
  students: Student[];
  initialResults: ResultRecord[];
}

export function ResultsEntrySheet({ examId, exam, students, initialResults }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Toggle for completed enrollments
  const [includeCompleted, setIncludeCompleted] = useState(true);

  // In-memory state of results
  const [results, setResults] = useState<Record<string, ResultRecord>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Filter and Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "ENTERED" | "MISSING" | "ABSENT" | "PASS" | "FAIL">("ALL");

  // Initialize state from initialResults and students list
  useEffect(() => {
    const initialMap: Record<string, ResultRecord> = {};
    
    // Seed from active/completed students
    students.forEach((student) => {
      const match = initialResults.find((r) => r.studentId === student.studentId);
      if (match) {
        initialMap[student.studentId] = {
          studentId: student.studentId,
          enrollmentId: student.enrollmentId,
          attendanceStatus: match.attendanceStatus,
          obtainedMarks: match.obtainedMarks !== null ? Number(match.obtainedMarks) : null,
          remarks: match.remarks || "",
        };
      } else {
        initialMap[student.studentId] = {
          studentId: student.studentId,
          enrollmentId: student.enrollmentId,
          attendanceStatus: "PRESENT",
          obtainedMarks: null,
          remarks: "",
        };
      }
    });

    setResults(initialMap);
    setIsDirty(false);
  }, [students, initialResults]);

  // Warning before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved marks changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Update a single cell or student result
  const handleUpdateResult = (
    studentId: string,
    updates: Partial<Omit<ResultRecord, "studentId" | "enrollmentId">>
  ) => {
    setResults((prev) => {
      const updated = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          ...updates,
        },
      };

      // Recalculate marks bounds immediately on input
      if (updates.obtainedMarks !== undefined && updates.obtainedMarks !== null) {
        if (updates.obtainedMarks > exam.total_marks) {
          setErrorMsg(`Obtained marks cannot exceed examination limit of ${exam.total_marks}`);
        } else if (updates.obtainedMarks < 0) {
          setErrorMsg("Obtained marks cannot be negative.");
        } else {
          setErrorMsg(null);
        }
      }

      setIsDirty(true);
      return updated;
    });
  };

  // Keyboard navigation utility
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    studentId: string,
    field: "marks" | "remarks",
    index: number,
    filteredList: Student[]
  ) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const nextIndex = e.key === "ArrowDown" ? index + 1 : index - 1;
      if (nextIndex >= 0 && nextIndex < filteredList.length) {
        const targetStudent = filteredList[nextIndex];
        const inputId = `${field}-${targetStudent.studentId}`;
        const targetElement = document.getElementById(inputId);
        if (targetElement) {
          (targetElement as HTMLInputElement).focus();
          (targetElement as HTMLInputElement).select();
        }
      }
    }
  };

  // Bulk Editing Actions
  const handleBulkSetAttendance = (status: "PRESENT" | "ABSENT") => {
    setResults((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[id] = {
          ...updated[id],
          attendanceStatus: status,
          obtainedMarks: status === "ABSENT" ? null : updated[id].obtainedMarks,
        };
      });
      setIsDirty(true);
      return updated;
    });
    setSuccessMsg(`Bulk updated all students to ${status.toLowerCase()}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleBulkSetMarks = (val: number) => {
    if (val < 0 || val > exam.total_marks) {
      setErrorMsg(`Bulk marks must be between 0 and ${exam.total_marks}.`);
      return;
    }
    setResults((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        if (updated[id].attendanceStatus === "PRESENT") {
          updated[id] = {
            ...updated[id],
            obtainedMarks: val,
          };
        }
      });
      setIsDirty(true);
      return updated;
    });
    setSuccessMsg(`Bulk assigned ${val} marks to all present students.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Save Draft Action
  const handleSaveDraft = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validate all marks before sending
    const records = Object.values(results);
    const invalid = records.find(
      (r) =>
        r.attendanceStatus === "PRESENT" &&
        r.obtainedMarks !== null &&
        (r.obtainedMarks < 0 || r.obtainedMarks > exam.total_marks)
    );

    if (invalid) {
      setErrorMsg(`Please correct invalid marks. Scores must be between 0 and ${exam.total_marks}.`);
      return;
    }

    startTransition(async () => {
      try {
        const payload = records.map((r) => ({
          studentId: r.studentId,
          enrollmentId: r.enrollmentId,
          attendanceStatus: r.attendanceStatus,
          obtainedMarks: r.obtainedMarks,
          remarks: r.remarks,
        }));

        const res = await saveDraftResultsAction(examId, payload);
        if (res.success) {
          setIsDirty(false);
          setSuccessMsg("Draft results saved successfully!");
          router.refresh();
          setTimeout(() => setSuccessMsg(null), 4000);
        } else {
          setErrorMsg(res.message || "Failed to save draft results.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "An unexpected error occurred.");
      }
    });
  };

  // Filter students based on UI selections
  const filteredStudents = students.filter((student) => {
    // 1. Gating completed enrollment toggle
    if (!includeCompleted && student.enrollmentStatus === "COMPLETED") {
      return false;
    }

    // 2. Search query matching
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 3. Status Filters (Entered, missing, absent, pass, fail)
    const record = results[student.studentId];
    if (!record) return true;

    if (filterType === "ALL") return true;
    if (filterType === "ENTERED") return record.attendanceStatus === "PRESENT" && record.obtainedMarks !== null;
    if (filterType === "ABSENT") return record.attendanceStatus === "ABSENT";
    if (filterType === "MISSING") return record.attendanceStatus === "PRESENT" && record.obtainedMarks === null;
    
    if (filterType === "PASS") {
      return record.attendanceStatus === "PRESENT" && record.obtainedMarks !== null && record.obtainedMarks >= exam.pass_marks;
    }
    if (filterType === "FAIL") {
      return record.attendanceStatus === "ABSENT" || record.obtainedMarks === null || record.obtainedMarks < exam.pass_marks;
    }

    return true;
  });

  return (
    <div className="space-y-6 w-full text-xs font-bold text-primary">
      {/* Alert Banners */}
      {isDirty && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-center gap-2">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-600 shrink-0" />
          <span>You have unsaved changes in this marks sheet. Click "Save Draft Marks" to avoid losing your changes.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-150 text-rose-700 rounded-xl">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-2">
          <Check className="h-4.5 w-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control panel & filters bar */}
      <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm space-y-4">
        {/* Bulk Editing Tools */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/20 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[10px] text-muted uppercase">Bulk Operations:</span>
            <button
              onClick={() => handleBulkSetAttendance("PRESENT")}
              className="px-3 py-1.5 bg-slate-50 border border-border/60 hover:bg-slate-100 rounded-lg text-[10px] text-slate-700 flex items-center gap-1"
            >
              <UserCheck className="h-3 w-3" />
              <span>Mark All Present</span>
            </button>
            <button
              onClick={() => handleBulkSetAttendance("ABSENT")}
              className="px-3 py-1.5 bg-slate-50 border border-border/60 hover:bg-slate-100 rounded-lg text-[10px] text-slate-700 flex items-center gap-1"
            >
              <XCircle className="h-3 w-3 text-rose-600" />
              <span>Mark All Absent</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted uppercase">Set Present Marks:</span>
            <input
              type="number"
              placeholder="Marks"
              className="w-16 px-2 py-1 rounded-lg border border-border/60 bg-bg/20 text-xs font-bold text-center"
              id="bulk-marks-input"
            />
            <button
              onClick={() => {
                const el = document.getElementById("bulk-marks-input") as HTMLInputElement;
                if (el && el.value !== "") {
                  handleBulkSetMarks(Number(el.value));
                }
              }}
              className="px-3 py-1.5 bg-primary text-white hover:bg-primary-dark rounded-lg text-[10px]"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Search, filters toggle, list toggles */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search by student code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/60 bg-bg/20 text-xs font-bold focus:border-primary focus:outline-none placeholder:text-muted/70 text-primary"
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                filterType === "ALL" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-border/60 hover:bg-slate-100"
              }`}
            >
              All Students ({students.length})
            </button>
            <button
              onClick={() => setFilterType("ENTERED")}
              className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                filterType === "ENTERED" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-border/60 hover:bg-slate-100"
              }`}
            >
              Entered
            </button>
            <button
              onClick={() => setFilterType("MISSING")}
              className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                filterType === "MISSING" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-border/60 hover:bg-slate-100"
              }`}
            >
              Missing Marks
            </button>
            <button
              onClick={() => setFilterType("ABSENT")}
              className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                filterType === "ABSENT" ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-600 border-border/60 hover:bg-slate-100"
              }`}
            >
              Absent
            </button>
            <button
              onClick={() => setFilterType("PASS")}
              className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                filterType === "PASS" ? "bg-emerald-700 border-emerald-700 text-white" : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50"
              }`}
            >
              Passing
            </button>
            <button
              onClick={() => setFilterType("FAIL")}
              className={`px-3 py-1.5 rounded-lg text-[10px] border transition-all ${
                filterType === "FAIL" ? "bg-rose-700 border-rose-700 text-white" : "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/50"
              }`}
            >
              Failing
            </button>
          </div>

          {/* Toggle completed enrollments */}
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="checkbox"
              id="includeCompletedCheck"
              checked={includeCompleted}
              onChange={(e) => setIncludeCompleted(e.target.checked)}
              className="rounded border-border text-primary focus:ring-primary h-4 w-4"
            />
            <label htmlFor="includeCompletedCheck" className="text-[10px] text-slate-700 cursor-pointer">
              Show Completed Enrollments
            </label>
          </div>
        </div>
      </div>

      {/* Spreadsheet sheet */}
      <div className="bg-white border border-border/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs font-semibold">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border/30 text-muted uppercase tracking-wider font-extrabold text-[10px]">
                <th className="py-4 px-6 w-1/4">Student Details</th>
                <th className="py-4 px-6 text-center w-36">Enrollment Status</th>
                <th className="py-4 px-6 text-center w-40">Attendance</th>
                <th className="py-4 px-6 text-center w-36">Obtained Marks</th>
                <th className="py-4 px-6 text-center w-24">Grade</th>
                <th className="py-4 px-6 w-1/3">Remarks</th>
                <th className="py-4 px-6 text-center w-24">Save State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-primary">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const record = results[student.studentId] || {
                    studentId: student.studentId,
                    enrollmentId: student.enrollmentId,
                    attendanceStatus: "PRESENT",
                    obtainedMarks: null,
                    remarks: "",
                  };

                  const isAbsent = record.attendanceStatus === "ABSENT";
                  const initialRecord = initialResults.find((r) => r.studentId === student.studentId);
                  
                  // Row Save State check
                  let isRowDirty = false;
                  if (initialRecord) {
                    isRowDirty =
                      record.attendanceStatus !== initialRecord.attendanceStatus ||
                      record.obtainedMarks !== (initialRecord.obtainedMarks !== null ? Number(initialRecord.obtainedMarks) : null) ||
                      record.remarks !== (initialRecord.remarks || "");
                  } else {
                    isRowDirty = record.attendanceStatus !== "PRESENT" || record.obtainedMarks !== null || record.remarks !== "";
                  }

                  // Recalculate grade local rendering
                  let calculatedLocalGrade = "-";
                  let passFail = "-";
                  if (record.attendanceStatus === "ABSENT") {
                    calculatedLocalGrade = "F";
                    passFail = "ABSENT";
                  } else if (record.obtainedMarks !== null) {
                    const percentage = (record.obtainedMarks / exam.total_marks) * 100;
                    calculatedLocalGrade = calculateGrade(percentage);
                    passFail = calculatePassFailStatus(record.obtainedMarks, exam.pass_marks, "PRESENT");
                  }

                  return (
                    <tr key={student.studentId} className="hover:bg-slate-50/20 transition-colors">
                      {/* Name & ID Code */}
                      <td className="py-3 px-6">
                        <span className="font-extrabold text-slate-800 text-sm block">{student.fullName}</span>
                        <span className="text-[10px] text-muted font-bold block mt-0.5">
                          ID: <span className="font-display uppercase font-bold">{student.studentCode}</span>
                        </span>
                      </td>

                      {/* Enrollment status */}
                      <td className="py-3 px-6 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                          student.enrollmentStatus === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}>
                          {student.enrollmentStatus}
                        </span>
                      </td>

                      {/* Attendance status dropdown */}
                      <td className="py-3 px-6 text-center">
                        <select
                          value={record.attendanceStatus}
                          onChange={(e) =>
                            handleUpdateResult(student.studentId, {
                              attendanceStatus: e.target.value as any,
                            })
                          }
                          className="px-2 py-1 rounded-lg border border-border/60 bg-bg/20 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                        >
                          <option value="PRESENT">PRESENT</option>
                          <option value="ABSENT">ABSENT</option>
                        </select>
                      </td>

                      {/* Obtained marks input */}
                      <td className="py-3 px-6 text-center">
                        <input
                          id={`marks-${student.studentId}`}
                          type="number"
                          step="0.01"
                          disabled={isAbsent}
                          value={record.obtainedMarks === null ? "" : record.obtainedMarks}
                          onChange={(e) => {
                            const val = e.target.value === "" ? null : Number(e.target.value);
                            handleUpdateResult(student.studentId, { obtainedMarks: val });
                          }}
                          onKeyDown={(e) => handleKeyDown(e, student.studentId, "marks", index, filteredStudents)}
                          placeholder="Marks"
                          className={`w-24 px-2 py-1 rounded-lg border text-xs font-bold text-center focus:border-primary focus:outline-none ${
                            isAbsent
                              ? "bg-slate-100 text-slate-400 border-border/40 cursor-not-allowed"
                              : record.obtainedMarks !== null && record.obtainedMarks > exam.total_marks
                              ? "bg-rose-50 border-rose-500 text-rose-700"
                              : "bg-bg/20 text-primary border-border/60"
                          }`}
                        />
                      </td>

                      {/* Local calculated grade indicator */}
                      <td className="py-3 px-6 text-center font-display font-extrabold text-sm whitespace-nowrap">
                        <span className={passFail === "PASS" ? "text-emerald-700" : passFail === "ABSENT" ? "text-slate-400" : "text-rose-700"}>
                          {calculatedLocalGrade} <span className="text-[10px] font-bold">({passFail})</span>
                        </span>
                      </td>

                      {/* Remarks input */}
                      <td className="py-3 px-6">
                        <input
                          id={`remarks-${student.studentId}`}
                          type="text"
                          value={record.remarks}
                          onChange={(e) => handleUpdateResult(student.studentId, { remarks: e.target.value })}
                          onKeyDown={(e) => handleKeyDown(e, student.studentId, "remarks", index, filteredStudents)}
                          placeholder="e.g. Good performance / Absent"
                          className="w-full px-3 py-1 rounded-lg border border-border/60 bg-bg/20 text-xs font-bold focus:border-primary focus:outline-none text-primary"
                        />
                      </td>

                      {/* Save state */}
                      <td className="py-3 px-6 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                          isRowDirty
                            ? "bg-amber-50 text-amber-700 border border-amber-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {isRowDirty ? "Unsaved" : "Saved"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted font-bold">
                    No enrolled student records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Save Panel controls */}
      <div className="flex justify-between items-center bg-slate-50 p-4 border border-border/40 rounded-2xl shadow-sm">
        <Link
          href={`/teacher/exams`}
          className="px-4 py-2 border border-border/80 bg-white hover:bg-slate-50 text-xs font-bold text-muted rounded-xl transition-all"
        >
          Back to list
        </Link>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to discard all unsaved edits?")) {
                router.refresh();
              }
            }}
            disabled={!isDirty}
            className="px-4 py-2.5 border border-border/60 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 disabled:opacity-50"
          >
            Discard Edits
          </button>
          
          <button
            onClick={handleSaveDraft}
            disabled={isPending || !isDirty}
            className="px-6 py-2.5 primary-btn text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Draft...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save Draft Marks</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
