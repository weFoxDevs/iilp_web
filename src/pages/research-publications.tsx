import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { CallToAction } from "@/common/components/CallToAction";
import ResearchPublicationsHero from "@/modules/research/components/ResearchPublicationsHero";
import ResearchRepository from "@/modules/research/components/ResearchRepository";
import SubmitResearchBanner from "@/modules/research/components/SubmitResearchBanner";

export default function ResearchPublicationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <ResearchPublicationsHero />
        <ResearchRepository />
        <SubmitResearchBanner />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
