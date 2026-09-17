import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import LeadershipDirectoryHero from "@/modules/leadership-directory/components/LeadershipDirectoryHero";
import InstitutionalLeadership from "@/modules/leadership-directory/components/InstitutionalLeadership";
import JoinTeamBanner from "@/modules/leadership-directory/components/JoinTeamBanner";

export default function LeadershipDirectoryPage() {
  const { getSection } = usePageContent("leadership-directory");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <LeadershipDirectoryHero data={getSection("hero")} />
        <InstitutionalLeadership data={getSection("institutional_leadership")} />
        <JoinTeamBanner data={getSection("join_team_banner")} />
      </main>
      <Footer />
    </div>
  );
}
