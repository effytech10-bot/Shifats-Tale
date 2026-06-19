"use client";

import React, { useState } from "react";
import { StudentSidebar } from "./student-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { MobileDashboardNav } from "./mobile-dashboard-nav";

interface StudentShellProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export function StudentShell({
  children,
  userName,
  userEmail,
}: StudentShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-bg-soft text-text overflow-hidden">
      {/* Desktop sidebar */}
      <StudentSidebar className="hidden lg:flex lg:w-64 lg:shrink-0" />

      {/* Mobile sidebar drawer */}
      <MobileDashboardNav
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="STUDENT"
      />

      {/* Main viewport area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Portal Header */}
        <DashboardHeader
          role="STUDENT"
          userName={userName}
          userEmail={userEmail}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Scrollable Main Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-8 focus:outline-none">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
