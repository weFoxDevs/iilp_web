import React from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { usePageContent } from '@/common/hooks/usePageContent';
import LeadershipDirectoryHero from '@/modules/leadership-directory/components/LeadershipDirectoryHero';
import InstitutionalLeadership from '@/modules/leadership-directory/components/InstitutionalLeadership';
import JoinTeamBanner from '@/modules/leadership-directory/components/JoinTeamBanner';
import LeadershipDirectorySkeleton from '@/modules/leadership-directory/components/LeadershipDirectorySkeleton';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';
import { fetchPublicLeadershipMembers, LeadershipMemberItem } from '@/common/services/leadership.service';

export const getStaticProps = (async () => {
  const [pageContent, leadershipMembers] = await Promise.all([
    fetchPageContent('leadership-directory').catch(() => null),
    fetchPublicLeadershipMembers().catch(() => [] as LeadershipMemberItem[]),
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

export default function LeadershipDirectoryPage({
  pageContent,
  initialMembers,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('leadership-directory', pageContent);

  return (
    <>
      <SeoHead
        title="Leadership Directory | International Institute for Law and Politics"
        description="Meet the leadership team of IILP — institutional leaders, directors, and senior staff driving law, politics, and global policy research."
        canonicalPath="/leadership-directory"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Leadership Directory', url: '/leadership-directory' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <LeadershipDirectorySkeleton />
          ) : (
            <>
              <LeadershipDirectoryHero data={getSection('hero')} />
              <InstitutionalLeadership
                data={getSection('institutional_leadership')}
                members={initialMembers}
              />
              <JoinTeamBanner data={getSection('join_team_banner')} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
