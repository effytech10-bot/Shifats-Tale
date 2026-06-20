"use client";

import React, { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Standard error reporting (could hook into Sentry or custom logger in production)
    // Redact any possible secrets before printing
    const msg = error.message || "";
    const cleanMsg = msg.replace(/[a-zA-Z0-9-_]{20,}/g, "[REDACTED_TOKEN_OR_KEY]");
    console.error("Route runtime error occurred:", {
      message: cleanMsg,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
          <AlertOctagon className="h-8 w-8 stroke-1.5" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black font-display tracking-tight text-white">
            Something went wrong
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            An unexpected error occurred while rendering this page. Our team has been notified.
          </p>
        </div>

        {error.digest && (
          <div className="bg-slate-950/80 rounded-xl px-4 py-2 border border-slate-800 text-[10px] font-mono text-slate-500 tracking-wider">
            Diagnostic ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-xs font-bold rounded-xl transition-all active:scale-98"
          >
            <Home className="h-3.5 w-3.5 text-slate-400" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
