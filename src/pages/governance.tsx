import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";

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
  const { getSection } = usePageContent('governance');

  return (
    <>
      <Head>
        <title>Governance | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Explore the governance structure of IILP, including the Governing Council, Executive Directorate, Academic Senate, Advisory Board, and Ethics Commission."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <GovernanceHero data={getSection('hero')} />
        <LeadershipStructure data={getSection('structure_intro')} />
        <FoundingAuthority data={getSection('founding_authority')} />
        <FoundingMembers data={getSection('founding_members')} />
        <GoverningCouncil data={getSection('governing_council')} />
        <ExecutiveDirectorateBoard data={getSection('executive_directorate')} />
        <AcademicSenate data={getSection('academic_senate')} />
        <AdvisoryBoard data={getSection('advisory_board')} />
        <EthicsCommission data={getSection('ethics_commission')} />
        <YouthLeadershipAssembly data={getSection('youth_leadership')} />
        <GovernanceGetInvolved data={getSection('get_involved_banner')} />
      </main>
      <Footer />
    </div>
    </>
  );
}
