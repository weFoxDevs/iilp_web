import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import FellowshipHero from "@/modules/fellowships/components/FellowshipHero";
import FellowshipCategories from "@/modules/fellowships/components/FellowshipCategories";
import FellowshipApplication from "@/modules/fellowships/components/FellowshipApplication";
import { usePageContent } from "@/common/hooks/usePageContent";

interface FellowshipsPageProps {
  defaultTab?: "research" | "junior" | "honorary";
}

export default function FellowshipsPage({
  defaultTab = "research",
}: FellowshipsPageProps) {
  const { getSection } = usePageContent("fellowships");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <FellowshipHero data={getSection("hero")} />
        <FellowshipCategories
          initialTab={defaultTab}
          data={getSection("pathways_intro")}
        />
        <FellowshipApplication data={getSection("application_cta")} />
      </main>
      <Footer />
    </div>
  );
}

