import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import PublicationDetailsHero from "@/modules/research/components/PublicationDetailsHero";
import PublicationDetailsOverview from "@/modules/research/components/PublicationDetailsOverview";
import ReadMoreResearch from "@/modules/research/components/ReadMoreResearch";
import { CallToAction } from "@/common/components/CallToAction";

export default function PublicationDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <PublicationDetailsHero />
        <PublicationDetailsOverview />
        <ReadMoreResearch />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

