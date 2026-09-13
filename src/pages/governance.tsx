import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";

import GovernanceHero from '@/modules/governance/components/GovernanceHero';
import LeadershipStructure from '@/modules/governance/components/LeadershipStructure';
import FoundingAuthority from '@/modules/governance/components/FoundingAuthority';
import FoundingMembers from '@/modules/governance/components/FoundingMembers';
import GoverningCouncil from '@/modules/governance/components/GoverningCouncil';
import ExecutiveDirectorateBoard from '@/modules/governance/components/ExecutiveDirectorateBoard';
import AcademicSenate from '@/modules/governance/components/AcademicSenate';
import AdvisoryBoard from '@/modules/governance/components/AdvisoryBoard';
import EthicsCommission from '@/modules/governance/components/EthicsCommission';
import YouthLeadershipAssembly from '@/modules/governance/components/YouthLeadershipAssembly';
import GovernanceGetInvolved from '@/modules/governance/components/GovernanceGetInvolved';

export default function GovernancePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <GovernanceHero />
        <LeadershipStructure />
        <FoundingAuthority />
        <FoundingMembers />
        <GoverningCouncil />
        <ExecutiveDirectorateBoard />
        <AcademicSenate />
        <AdvisoryBoard />
        <EthicsCommission />
        <YouthLeadershipAssembly />
        <GovernanceGetInvolved />
      </main>
      <Footer />
    </div>
  );
}
