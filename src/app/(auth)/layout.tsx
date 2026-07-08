import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-soft text-text flex flex-col justify-between selection:bg-accent selection:text-primary relative py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header - Brand Logo & Back link */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1 bg-primary text-white rounded-xl group-hover:bg-primary-dark transition-colors shadow-sm">
            <Image src="/images/logo_transparent.png" alt="Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-wide font-display text-primary block leading-none">
              SHIFAT'S TALES
            </span>
            <span className="text-[10px] uppercase font-bold text-accent tracking-widest mt-1 block">
              ACADEMIC CARE
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-muted hover:text-primary hover:bg-bg/40 px-3 py-2 rounded-xl transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Site</span>
        </Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center my-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer info */}
      <div className="text-center text-[11px] font-semibold text-muted tracking-tight">
        &copy; {new Date().getFullYear()} Shifat's Tales &bull; Coaching Management Portal
      </div>
    </div>
  );
}
