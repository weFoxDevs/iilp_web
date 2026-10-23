import React from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import AdmissionHero from '@/modules/admissions/components/AdmissionHero';
import AdmissionCategories from '@/modules/admissions/components/AdmissionCategories';
import AdmissionApplicationSection from '@/modules/admissions/components/AdmissionApplicationSection';
import { usePageContent } from '@/common/hooks/usePageContent';
import FellowshipsSkeleton from '@/modules/fellowships/components/FellowshipsSkeleton';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const [applyContent, admissionsContent] = await Promise.all([
    fetchPageContent('apply').catch(() => null),
    fetchPageContent('admissions').catch(() => null),
  ]);
  return {
    props: { applyContent, admissionsContent },
    revalidate: 600,
  };
}) satisfies GetStaticProps<{
  applyContent: PageContentResponse | null;
  admissionsContent: PageContentResponse | null;
}>;

interface ApplyPageProps extends InferGetStaticPropsType<typeof getStaticProps> {
  defaultTab?: 'diploma' | 'certificate' | 'training' | 'short-course';
}

export default function ApplyPage({ applyContent, admissionsContent, defaultTab = 'diploma' }: ApplyPageProps) {
  const { getSection: getApplySection, isLoading } = usePageContent('apply', applyContent);
  const { getSection: getAdmissionsSection } = usePageContent('admissions', admissionsContent);
  const getSection = (key: string) => getApplySection(key) || getAdmissionsSection(key);
  const [selectedProgramType, setSelectedProgramType] = React.useState<string | undefined>(undefined);

  return (
    <>
      <SeoHead
        title="Online Admission & Application Form | International Institute for Law and Politics (IILP)"
        description="Apply online for IILP Academic Programs, Certificate Courses, Diploma Programs, and Professional Training in law, governance, human rights, and international policy."
        canonicalPath="/apply"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Apply', url: '/apply' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <FellowshipsSkeleton />
          ) : (
            <>
              <AdmissionHero data={getSection('hero')} />
              <AdmissionCategories
                initialTab={defaultTab}
                data={getSection('pathways_intro') || getSection('categories')}
                onSelectProgramType={(type) => setSelectedProgramType(type)}
              />
              <AdmissionApplicationSection
                data={getSection('application_cta') || getSection('application')}
                initialProgramType={selectedProgramType}
              />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
