"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPaymentAction } from "@/app/actions/payments";
import { formatCurrency } from "@/lib/currency";
import { Search, Info, HelpCircle, Loader2 } from "lucide-react";

interface Enrollment {
  id: string;
  status: string;
  batch_id: string;
  batch: {
    id: string;
    name: string;
    code: string;
    monthly_fee: number;
  };
}

interface Student {
  id: string;
  student_code: string;
  profile: {
    full_name: string;
    email: string;
    phone: string;
    account_status: string;
  };
  enrollments: Enrollment[];
}

interface PaymentEntryFormProps {
  students: Student[];
}

export function PaymentEntryForm({ students }: PaymentEntryFormProps) {
  const router = useRouter();

  // Search/Selection states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  // Billing Month and Year states (Default to current date)
  const currentDate = new Date();
  const [billingMonth, setBillingMonth] = useState<number>(currentDate.getMonth() + 1);
  const [billingYear, setBillingYear] = useState<number>(currentDate.getFullYear());

  // Payment states
  const [expectedAmount, setExpectedAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [overrideStatus, setOverrideStatus] = useState<string>(""); // "" means auto
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [otherMethodDescription, setOtherMethodDescription] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(currentDate.toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [teacherNote, setTeacherNote] = useState<string>("");
  const [studentNote, setStudentNote] = useState<string>("");

  // Loading, Errors, Confirmations states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const [showOverrideWarning, setShowOverrideWarning] = useState(false);

  // Filter students by query
  const filteredStudents = searchQuery.trim() === ""
    ? []
    : students.filter(s =>
        s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.profile.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Set default fee and enrollment when student changes
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSearchQuery("");
    
    // Auto-select first active enrollment if available
    const activeEnrollments = student.enrollments.filter(e => e.status === "ACTIVE");
    const targetEnrollment = activeEnrollments.length > 0
      ? activeEnrollments[0]
      : student.enrollments[0] || null;

    setSelectedEnrollment(targetEnrollment);
    if (targetEnrollment) {
      setExpectedAmount(Number(targetEnrollment.batch.monthly_fee));
    } else {
      setExpectedAmount(0);
    }
    setPaidAmount(0);
    setDuplicateId(null);
    setErrorMessage(null);
  };

  const handleSelectEnrollment = (enrollmentId: string) => {
    const enr = selectedStudent?.enrollments.find(e => e.id === enrollmentId) || null;
    setSelectedEnrollment(enr);
    if (enr) {
      const defaultFee = Number(enr.batch.monthly_fee);
      setExpectedAmount(defaultFee);
      setShowOverrideWarning(false);
    }
  };

  // Warn if expected amount is modified from standard fee
  const handleExpectedAmountChange = (val: number) => {
    setExpectedAmount(val);
    if (selectedEnrollment && val !== Number(selectedEnrollment.batch.monthly_fee)) {
      setShowOverrideWarning(true);
    } else {
      setShowOverrideWarning(false);
    }
  };

  // Calculate Suggested status and due amount dynamically
  const calculatedDue = overrideStatus === "WAIVED" ? 0 : Math.max(expectedAmount - paidAmount, 0);

  let suggestedStatus = "UNPAID";
  if (paidAmount === 0) suggestedStatus = "UNPAID";
  else if (paidAmount < expectedAmount) suggestedStatus = "PARTIALLY_PAID";
  else suggestedStatus = "PAID";

  const activeStatus = overrideStatus || suggestedStatus;

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateId(null);

    if (!selectedStudent) {
      setErrorMessage("Please select a student.");
      return;
    }
    if (!selectedEnrollment) {
      setErrorMessage("Please select an active enrollment.");
      return;
    }

    if (expectedAmount < 0 || paidAmount < 0) {
      setErrorMessage("Tuition fees and paid amounts cannot be negative.");
      return;
    }

    // Enforce note requirement for exceptional statuses
    if (["WAIVED", "REFUNDED", "CANCELLED"].includes(activeStatus)) {
      if (!teacherNote.trim()) {
        setErrorMessage(`A teacher private note or reason is required for status: ${activeStatus}.`);
        return;
      }
    }

    setLoading(true);

    try {
      const methodField = paymentMethod === "OTHER"
        ? `OTHER: ${otherMethodDescription}`
        : paymentMethod;

      const res = await createPaymentAction({
        studentId: selectedStudent.id,
        enrollmentId: selectedEnrollment.id,
        batchId: selectedEnrollment.batch_id,
        billingMonth,
        billingYear,
        expectedAmount,
        paidAmount,
        status: activeStatus as any,
        paymentMethod: methodField,
        paymentDate: paidAmount > 0 ? paymentDate : undefined,
        referenceNumber,
        teacherNote,
        studentNote,
      });

      if (!res.success) {
        if (res.code === "DUPLICATE" && res.paymentId) {
          setDuplicateId(res.paymentId);
          setErrorMessage(res.message || "A billing record already exists for this student.");
        } else {
          setErrorMessage(res.message || "Failed to record payment.");
        }
      } else {
        router.push("/teacher/payments");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred while saving the payment record.");
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-primary">
      {/* 1. Student Selection */}
      <div className="space-y-2">
        <label className="block text-xs uppercase tracking-wider text-muted font-extrabold">
          Step 1: Select Student Profile
        </label>
        
        {!selectedStudent ? (
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name or ST-XXXX-XXXX registration code..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/60 bg-bg/25 text-xs font-bold focus:border-primary focus:outline-none"
            />
            {filteredStudents.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-border/40 rounded-xl shadow-lg max-h-56 overflow-y-auto divide-y divide-border/10">
                {filteredStudents.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => handleSelectStudent(student)}
                    className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex justify-between items-center text-xs font-bold text-primary"
                  >
                    <div>
                      <span className="block text-primary">{student.profile.full_name}</span>
                      <span className="block text-[10px] text-muted uppercase mt-0.5">{student.student_code}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{student.enrollments.length} Batches</span>
                  </button>
                ))}
              </div>
            )}
            {searchQuery.trim() !== "" && filteredStudents.length === 0 && (
              <p className="text-[10px] text-muted italic mt-1 text-center py-2 border border-dashed border-border/40 rounded-xl">
                No matching students found.
              </p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-border/30 rounded-xl flex justify-between items-center">
            <div>
              <span className="text-sm font-extrabold text-primary block">{selectedStudent.profile.full_name}</span>
              <div className="flex gap-2 text-[10px] text-muted font-bold mt-1">
                <span className="uppercase">{selectedStudent.student_code}</span>
                <span>&bull;</span>
                <span>{selectedStudent.profile.email}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedStudent(null);
                setSelectedEnrollment(null);
                setExpectedAmount(0);
              }}
              className="px-2.5 py-1.5 border border-rose-200 bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 transition-all text-[10px]"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* 2. Enrollment / Batch Selection */}
      {selectedStudent && (
        <div className="space-y-4 pt-2 border-t border-border/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Step 2: Choose Active batch enrollment
              </label>
              {selectedStudent.enrollments.length > 0 ? (
                <select
                  value={selectedEnrollment?.id || ""}
                  onChange={(e) => handleSelectEnrollment(e.target.value)}
                  className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
                >
                  {selectedStudent.enrollments.map(enr => (
                    <option key={enr.id} value={enr.id}>
                      {enr.batch.name} ({enr.batch.code}) - {enr.status}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-[10px] text-rose-600 font-semibold p-2 border border-dashed border-rose-100 rounded-xl">
                  This student has no batch enrollments recorded. Enroll them first.
                </p>
              )}
            </div>

            {/* Billing month / year */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                  Billing Month
                </label>
                <select
                  value={billingMonth}
                  onChange={(e) => setBillingMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
                >
                  {monthNames.map((name, i) => (
                    <option key={i + 1} value={i + 1}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                  Billing Year
                </label>
                <select
                  value={billingYear}
                  onChange={(e) => setBillingYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
                >
                  {Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 1 + i).map(yr => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. Amounts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/10">
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Expected Amount (BDT)
              </label>
              <input
                type="number"
                value={expectedAmount}
                onChange={(e) => handleExpectedAmountChange(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              />
              {showOverrideWarning && (
                <div className="mt-1 flex items-start gap-1 text-[9px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-100 font-semibold">
                  <Info className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>Standard batch fee is {selectedEnrollment ? formatCurrency(selectedEnrollment.batch.monthly_fee) : 0}. You are overriding this for this month only.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Paid Amount (BDT)
              </label>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Outstanding Balance
              </span>
              <div className="px-3 py-2 rounded-xl border border-dashed border-border/60 bg-slate-50/50 text-slate-800 text-sm font-extrabold">
                {formatCurrency(calculatedDue)}
              </div>
            </div>
          </div>

          {/* 4. Status and Confirmation Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/10">
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5 flex items-center gap-1">
                <span>Payment Status</span>
                <span title="Set to auto to calculate based on paid amount, or override to waived/refunded.">
                  <HelpCircle className="h-3.5 w-3.5 text-muted" />
                </span>
              </label>
              <select
                value={overrideStatus}
                onChange={(e) => setOverrideStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none text-xs"
              >
                <option value="">Auto: {suggestedStatus} (Suggested)</option>
                <option value="UNPAID">UNPAID</option>
                <option value="PAID">PAID</option>
                <option value="PARTIALLY_PAID">PARTIALLY PAID</option>
                <option value="WAIVED">WAIVED</option>
                <option value="REFUNDED">REFUNDED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none text-xs"
                  disabled={paidAmount === 0}
                >
                  <option value="CASH">CASH</option>
                  <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  <option value="MOBILE_FINANCIAL_SERVICE">MFS (bKash/Nagad...)</option>
                  <option value="OTHER">OTHER</option>
                </select>
                {paymentMethod === "OTHER" && (
                  <input
                    type="text"
                    value={otherMethodDescription}
                    onChange={(e) => setOtherMethodDescription(e.target.value)}
                    placeholder="Method desc..."
                    className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
                disabled={paidAmount === 0}
              />
            </div>
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Reference / Receipt Number
              </label>
              <input
                type="text"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                placeholder="Offline transaction number, bank ID..."
                className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4 pt-2 border-t border-border/10">
            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Teacher Private Note (Confidential) {["WAIVED", "REFUNDED", "CANCELLED"].includes(activeStatus) && <span className="text-rose-600 font-extrabold">* Required</span>}
              </label>
              <textarea
                rows={2}
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder="Confidential reasons or verification flags..."
                className="w-full p-3 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
                Student Visible Note
              </label>
              <textarea
                rows={2}
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="This message will be visible on the student's payments ledger..."
                className="w-full p-3 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none text-xs font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* Errors & Duplicate redirects */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-xs font-bold space-y-2">
          <p>{errorMessage}</p>
          {duplicateId && (
            <button
              type="button"
              onClick={() => router.push(`/teacher/payments/${duplicateId}`)}
              className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg transition-all text-[10px] uppercase font-black"
            >
              Open and Edit Existing Record
            </button>
          )}
        </div>
      )}

      {/* Form Submission */}
      <div className="pt-4 border-t border-border/10 flex justify-end">
        <button
          type="submit"
          disabled={loading || !selectedStudent || !selectedEnrollment}
          className="px-6 py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            null
          )}
          <span>Confirm and Record Payment</span>
        </button>
      </div>
    </form>
  );
}
