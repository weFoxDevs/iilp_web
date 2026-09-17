import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import ResearchPublicationsHero from "@/modules/research/components/ResearchPublicationsHero";
import ResearchRepository from "@/modules/research/components/ResearchRepository";
import SubmitResearchBanner from "@/modules/research/components/SubmitResearchBanner";

export default function ResearchPublicationsPage() {
  const { getSection } = usePageContent("research-publications");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <ResearchPublicationsHero data={getSection("hero")} />
        <ResearchRepository data={getSection("research_repository")} />
        <SubmitResearchBanner data={getSection("submit_research_banner")} />
      </main>
      <Footer />
    </div>
  );
}
