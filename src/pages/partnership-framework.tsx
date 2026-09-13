import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import PartnershipHero from "@/modules/partnerships/components/PartnershipHero";
import PartnershipFrameworkTracks from "@/modules/partnerships/components/PartnershipFrameworkTracks";
import BecomePartnerBanner from "@/modules/partnerships/components/BecomePartnerBanner";

export default function PartnershipFrameworkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <PartnershipHero />
        <PartnershipFrameworkTracks />
        <BecomePartnerBanner />
      </main>
      <Footer />
    </div>
  );
}
