"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { generateMonthlyDuesAction } from "@/app/actions/payments";
import { Loader2 } from "lucide-react";

interface GenerateDuesFormProps {
  batchId: string;
  defaultMonth: number;
  defaultYear: number;
}

export function GenerateDuesForm({ batchId, defaultMonth, defaultYear }: GenerateDuesFormProps) {
  const router = useRouter();
  const [month, setMonth] = useState<number>(defaultMonth);
  const [year, setYear] = useState<number>(defaultYear);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ success: boolean; text: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const res = await generateMonthlyDuesAction(batchId, month, year);
      if (res.success) {
        setMessage({
          success: true,
          text: res.message || "Dues generated successfully.",
        });
        router.refresh();
      } else {
        setMessage({
          success: false,
          text: res.message || "Failed to generate dues.",
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        success: false,
        text: "An unexpected error occurred during dues generation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();

  return (
    <form onSubmit={handleGenerate} className="space-y-4 text-xs font-bold text-primary">
      <div>
        <label className="block text-[10px] text-muted uppercase font-bold mb-1.5">
          Select Month
        </label>
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
          disabled={loading}
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
          Select Year
        </label>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-border/60 rounded-xl bg-bg/25 focus:border-primary focus:outline-none"
          disabled={loading}
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - 1 + i).map(yr => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <div className={`p-3 rounded-xl border text-[10px] ${message.success ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
          {message.text}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-primary hover:bg-primary/95 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all"
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        <span>Generate Monthly Dues</span>
      </button>
    </form>
  );
}
