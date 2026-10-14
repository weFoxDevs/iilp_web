import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import { fetchPublicLeadershipMembers } from "@/common/services/leadership.service";

import GovernanceHero from '@/modules/governance/components/GovernanceHero';
import LeadershipStructure from '@/modules/governance/components/LeadershipStructure';
import FoundingAuthority from '@/modules/governance/components/FoundingAuthority';
import FoundingMembers, {
  FoundingMemberItem,
} from '@/modules/governance/components/FoundingMembers';
import GoverningCouncil from '@/modules/governance/components/GoverningCouncil';
import ExecutiveDirectorateBoard from '@/modules/governance/components/ExecutiveDirectorateBoard';
import AcademicSenate from '@/modules/governance/components/AcademicSenate';
import AdvisoryBoard from '@/modules/governance/components/AdvisoryBoard';
import EthicsCommission from '@/modules/governance/components/EthicsCommission';
import YouthLeadershipAssembly from '@/modules/governance/components/YouthLeadershipAssembly';
import GovernanceGetInvolved from '@/modules/governance/components/GovernanceGetInvolved';
import GovernanceSkeleton from '@/modules/governance/components/GovernanceSkeleton';

export default function GovernancePage() {
  const { getSection, isLoading: isContentLoading } = usePageContent('governance');
  const [leadershipMembers, setLeadershipMembers] = useState<FoundingMemberItem[]>([]);
  const [isLeadershipLoading, setIsLeadershipLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchPublicLeadershipMembers({ limit: 4, page: 1 })
      .then((members) => {
        if (active) {
          setLeadershipMembers(members);
        }
      })
      .catch((err) => {
        console.warn('Failed to load leadership members:', err);
      })
      .finally(() => {
        if (active) {
          setIsLeadershipLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const isLoading = isContentLoading || isLeadershipLoading;

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
          {isLoading ? (
            <GovernanceSkeleton />
          ) : (
            <>
              <GovernanceHero data={getSection('hero')} />
              <LeadershipStructure data={getSection('structure_intro')} />
              <FoundingAuthority data={getSection('founding_authority')} />
              <FoundingMembers
                data={getSection('founding_members')}
                initialMembers={leadershipMembers}
              />
              <GoverningCouncil data={getSection('governing_council')} />
              <ExecutiveDirectorateBoard data={getSection('executive_directorate')} />
              <AcademicSenate data={getSection('academic_senate')} />
              <AdvisoryBoard data={getSection('advisory_board')} />
              <EthicsCommission data={getSection('ethics_commission')} />
              <YouthLeadershipAssembly data={getSection('youth_leadership')} />
              <GovernanceGetInvolved data={getSection('get_involved_banner')} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
