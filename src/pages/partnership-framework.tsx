import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import PartnershipHero from "@/modules/partnerships/components/PartnershipHero";
import PartnershipFrameworkTracks from "@/modules/partnerships/components/PartnershipFrameworkTracks";
import BecomePartnerBanner from "@/modules/partnerships/components/BecomePartnerBanner";

export default function PartnershipFrameworkPage() {
  const { getSection } = usePageContent("partnerships");

  return (
    <>
      <Head>
        <title>Partnership Framework | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Explore IILP's partnership framework and collaboration tracks with governments, universities, civil society organizations, and international institutions."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <PartnershipHero data={getSection("hero")} />
        <PartnershipFrameworkTracks data={getSection("tracks_intro")} />
        <BecomePartnerBanner data={getSection("become_partner_banner")} />
      </main>
      <Footer />
    </div>
    </>
  );
}
