import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import PartnershipHero from "@/modules/partnerships/components/PartnershipHero";
import PartnershipFrameworkTracks from "@/modules/partnerships/components/PartnershipFrameworkTracks";
import BecomePartnerBanner from "@/modules/partnerships/components/BecomePartnerBanner";

export default function PartnershipFrameworkPage() {
  const { getSection } = usePageContent("partnerships");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <PartnershipHero data={getSection("hero")} />
        <PartnershipFrameworkTracks data={getSection("tracks_intro")} />
        <BecomePartnerBanner data={getSection("become_partner_banner")} />
      </main>
      <Footer />
    </div>
  );
}
