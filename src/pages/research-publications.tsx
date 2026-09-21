import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import ResearchPublicationsHero from "@/modules/research/components/ResearchPublicationsHero";
import ResearchRepository from "@/modules/research/components/ResearchRepository";
import SubmitResearchBanner from "@/modules/research/components/SubmitResearchBanner";

export default function ResearchPublicationsPage() {
  const { getSection } = usePageContent("research-publications");

  return (
    <>
      <Head>
        <title>Research &amp; Publications | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Browse IILP's research repository of publications, journals, policy briefs, and working papers advancing law, governance, and human rights scholarship."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <ResearchPublicationsHero data={getSection("hero")} />
        <ResearchRepository data={getSection("research_repository")} />
        <SubmitResearchBanner data={getSection("submit_research_banner")} />
      </main>
      <Footer />
    </div>
    </>
  );
}
