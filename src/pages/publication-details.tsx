import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import PublicationDetailsHero from "@/modules/research/components/PublicationDetailsHero";
import PublicationDetailsOverview from "@/modules/research/components/PublicationDetailsOverview";
import ReadMoreResearch from "@/modules/research/components/ReadMoreResearch";
import { CallToAction } from "@/common/components/CallToAction";

export default function PublicationDetailsPage() {
  return (
    <>
      <Head>
        <title>Publication Details | IILP Research &amp; Publications</title>
        <meta
          name="description"
          content="Read IILP's detailed research publication including overview, abstract, and related research papers in law, governance, and human rights."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <PublicationDetailsHero />
        <PublicationDetailsOverview />
        <ReadMoreResearch />
      </main>
      <Footer />
    </div>
    </>
  );
}

