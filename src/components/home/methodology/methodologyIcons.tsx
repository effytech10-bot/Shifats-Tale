"use client";

import React from "react";
import {
  UserCheck,
  Users,
  ClipboardList,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Award,
  GraduationCap,
  Target,
  ShieldCheck,
  Star,
} from "lucide-react";

export interface BenefitItem {
  id?: string;
  title: string;
  description: string;
  iconName: string;
}

export const getMethodologyIcon = (iconName: string, className: string = "h-6 w-6") => {
  switch (iconName) {
    case "UserCheck":
      return <UserCheck className={className} />;
    case "Users":
      return <Users className={className} />;
    case "ClipboardList":
      return <ClipboardList className={className} />;
    case "NotebookTabs":
    case "BookOpen":
      return <BookOpen className={className} />;
    case "MessageCircle":
      return <MessageCircle className={className} />;
    case "Cpu":
    case "Lightbulb":
      return <Lightbulb className={className} />;
    default:
      return <UserCheck className={className} />;
  }
};

/**
 * Large low-opacity SVG watermark graphics rendered in the bottom right of methodology cards
 */
export const MethodologyWatermark = ({ iconName, className }: { iconName: string; className?: string }) => {
  const baseClass = className || "w-24 h-24 absolute -bottom-4 -right-4 pointer-events-none transition-all duration-500";
  
  switch (iconName) {
    case "Users":
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="35" cy="35" r="14" />
          <path d="M15 75 C15 55 25 50 35 50 C45 50 55 55 55 75" />
          <circle cx="65" cy="40" r="11" />
          <path d="M50 75 C50 60 58 55 65 55 C72 55 80 60 80 75" />
        </svg>
      );
    case "ClipboardList":
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="25" y="20" width="50" height="65" rx="6" />
          <path d="M40 20 V15 A5 5 0 0 1 60 15 V20" />
          <path d="M35 40 H65 M35 55 H65 M35 70 H50" strokeDasharray="3 3" />
          <circle cx="70" cy="70" r="12" fill="currentColor" fillOpacity="0.1" />
          <path d="M65 70 L68 73 L75 66" strokeWidth="2" />
        </svg>
      );
    case "UserCheck":
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="45" cy="35" r="16" />
          <path d="M20 80 C20 58 30 52 45 52 C60 52 70 58 70 80" />
          <circle cx="75" cy="40" r="10" />
          <path d="M70 40 L73 43 L80 36" strokeWidth="2" />
        </svg>
      );
    case "NotebookTabs":
    case "BookOpen":
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 30 C35 25 50 30 50 30 V80 C50 80 35 75 20 80 Z" />
          <path d="M80 30 C65 25 50 30 50 30 V80 C50 80 65 75 80 80 Z" />
        </svg>
      );
    case "MessageCircle":
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M50 20 C30 20 15 33 15 50 C15 60 21 68 30 74 L25 88 L42 81 C45 82 47 82 50 82 C70 82 85 69 85 50 C85 33 70 20 50 20 Z" />
        </svg>
      );
    case "Cpu":
    case "Lightbulb":
    default:
      return (
        <svg className={baseClass} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="45" r="20" />
          <path d="M40 65 H60 M43 72 H57" />
          <path d="M50 15 V10 M25 25 L20 20 M75 25 L80 20 M15 45 H10 M85 45 H90" strokeDasharray="2 2" />
          <circle cx="55" cy="75" r="15" fill="currentColor" fillOpacity="0.08" />
          <path d="M48 75 L53 80 L63 70" strokeWidth="2" />
        </svg>
      );
  }
};
