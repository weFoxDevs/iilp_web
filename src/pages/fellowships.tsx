import React from 'react';
import type { GetStaticProps } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import FellowshipHero from '@/modules/fellowships/components/FellowshipHero';
import FellowshipCategories from '@/modules/fellowships/components/FellowshipCategories';
import FellowshipApplication from '@/modules/fellowships/components/FellowshipApplication';
import { usePageContent } from '@/common/hooks/usePageContent';
import FellowshipsSkeleton from '@/modules/fellowships/components/FellowshipsSkeleton';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('fellowships').catch(() => null);
  return {
    props: { pageContent },
    revalidate: 600,
  };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;

interface FellowshipsPageProps {
  pageContent?: PageContentResponse | null;
  defaultTab?: 'research' | 'junior' | 'honorary';
}

export default function FellowshipsPage({ pageContent = null, defaultTab = 'research' }: FellowshipsPageProps) {
  const { getSection, isLoading } = usePageContent('fellowships', pageContent);

  return (
    <>
      <SeoHead
        title="Fellowships | International Institute for Law and Politics"
        description="Apply for IILP fellowship programs — Research Fellowships, Junior Fellowships, and Honorary Fellowships advancing law, governance, and human rights scholarship."
        canonicalPath="/fellowships"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Fellowships', url: '/fellowships' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <FellowshipsSkeleton />
          ) : (
            <>
              <FellowshipHero data={getSection('hero')} />
              <FellowshipCategories
                initialTab={defaultTab}
                data={getSection('pathways_intro') || getSection('categories')}
              />
              <FellowshipApplication
                data={getSection('application_cta') || getSection('application')}
              />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
