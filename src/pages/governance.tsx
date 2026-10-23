import React from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { usePageContent } from '@/common/hooks/usePageContent';
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
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';
import { fetchPublicLeadershipMembers, LeadershipMemberItem } from '@/common/services/leadership.service';

export const getStaticProps = (async () => {
  const [pageContent, leadershipMembers] = await Promise.all([
    fetchPageContent('governance').catch(() => null),
    fetchPublicLeadershipMembers({ limit: 4, page: 1 }).catch(() => [] as LeadershipMemberItem[]),
  ]);
  return {
    props: {
      pageContent,
      initialMembers: Array.isArray(leadershipMembers) ? leadershipMembers : [],
    },
    revalidate: 3600,
  };
}) satisfies GetStaticProps<{
  pageContent: PageContentResponse | null;
  initialMembers: LeadershipMemberItem[];
}>;

export default function GovernancePage({
  pageContent,
  initialMembers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('governance', pageContent);

  return (
    <>
      <SeoHead
        title="Governance | International Institute for Law and Politics"
        description="Explore the governance structure of IILP, including the Governing Council, Executive Directorate, Academic Senate, Advisory Board, and Ethics Commission."
        canonicalPath="/governance"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Governance', url: '/governance' },
        ])}
      />

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
                initialMembers={initialMembers as FoundingMemberItem[]}
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
