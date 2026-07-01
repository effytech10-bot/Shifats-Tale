import React from "react";
import { Metadata } from "next";
import {
  profileData,
  metricsData,
  educationData,
  researchExperienceData,
  researchThesisData,
  publicationsData,
  skillCategoriesData,
  projectsData,
  trainingData,
  ecaData,
} from "@/data/about";
import { getPageSection } from "@/features/website-cms/actions/content-actions";

import { AboutHero } from "@/components/about/AboutHero";
import { AboutMetrics } from "@/components/about/AboutMetrics";
import { EducationTimeline } from "@/components/about/EducationTimeline";
import { ResearchExperienceSection } from "@/components/about/ResearchExperienceSection";
import { PublicationsSection } from "@/components/about/PublicationsSection";
import { ProjectsGrid } from "@/components/about/ProjectsGrid";
import { IndustrialTrainingBanner } from "@/components/about/IndustrialTrainingBanner";
import TechnicalSkillsSection from "@/components/about/TechnicalSkillsSection";
import ECASection from "@/components/about/ECASection";

export const metadata: Metadata = {
  title: "About Md. Zia Uddin Azad Sifat | Academic & Professional Portfolio | Shifat's Tales",
  description: "Explore the academic portfolio, research publications, engineering projects, and teaching background of Md. Zia Uddin Azad Sifat (Shifat Sir), CEO at Shifat's Tales.",
};

export default async function AboutPage() {
  const aboutHeroSection = await getPageSection("ABOUT", "ABOUT_HERO");
  const aboutMetricsSection = await getPageSection("ABOUT", "ABOUT_METRICS");
  const aboutEducationSection = await getPageSection("ABOUT", "ABOUT_EDUCATION");
  const aboutResearchSection = await getPageSection("ABOUT", "ABOUT_RESEARCH_EXP");
  const aboutPublicationsSection = await getPageSection("ABOUT", "ABOUT_PUBLICATIONS");
  const aboutTrainingSection = await getPageSection("ABOUT", "ABOUT_TRAINING");
  const aboutProjectsSection = await getPageSection("ABOUT", "ABOUT_PROJECTS");

  return (
    <div className="relative pt-20 pb-0 bg-bg-soft text-text flex flex-col min-h-screen selection:bg-accent selection:text-primary overflow-x-hidden">
      {/* Global Background Noise / Pattern */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none mix-blend-overlay z-0" />
      
      {/* 1. About Hero Section */}
      <AboutHero profileData={aboutHeroSection?.content || profileData} />

      {/* 2. Summary Metrics Strip */}
      <AboutMetrics metrics={aboutMetricsSection?.content?.metrics || metricsData} />

      {/* 3. Education Timeline */}
      <EducationTimeline education={aboutEducationSection?.content?.education || educationData} />

      {/* New Section: Research Experience */}
      <ResearchExperienceSection researchData={aboutResearchSection?.content?.researchData || researchExperienceData} />

      {/* New Section: Research Publications */}
      <PublicationsSection publications={aboutPublicationsSection?.content?.publications || publicationsData} />

      {/* 7. Industrial Training Banner */}
      <IndustrialTrainingBanner training={aboutTrainingSection?.content?.training || trainingData} />

      {/* 6. Projects Grid */}
      <ProjectsGrid projects={aboutProjectsSection?.content?.projects || projectsData} />

      {/* 8. Technical Skills */}
      <TechnicalSkillsSection skills={skillCategoriesData} />

      {/* 9. Extra Curricular Activities */}
      <ECASection ecaItems={ecaData} />

    </div>
  );
}
