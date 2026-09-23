import React from "react";
import Head from "next/head";
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
    <>
      <Head>
        <title>Fellowships | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Apply for IILP fellowship programs — Research Fellowships, Junior Fellowships, and Honorary Fellowships advancing law, governance, and human rights scholarship."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <FellowshipHero data={getSection("hero")} />
        <FellowshipCategories
          initialTab={defaultTab}
          data={getSection("pathways_intro") || getSection("categories")}
        />
        <FellowshipApplication
          data={getSection("application_cta") || getSection("application")}
        />
      </main>
      <Footer />
    </div>
    </>
  );
}

