import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import LeadershipDirectoryHero from "@/modules/leadership-directory/components/LeadershipDirectoryHero";
import InstitutionalLeadership from "@/modules/leadership-directory/components/InstitutionalLeadership";
import JoinTeamBanner from "@/modules/leadership-directory/components/JoinTeamBanner";

export default function LeadershipDirectoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <LeadershipDirectoryHero />
        <InstitutionalLeadership />
        <JoinTeamBanner />
      </main>
      <Footer />
    </div>
  );
}
