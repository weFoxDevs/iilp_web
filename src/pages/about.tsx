import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import AboutHero from '@/modules/about/components/AboutHero';
import InstitutionalProfile from '@/modules/about/components/InstitutionalProfile';
import MissionAndVision from '@/modules/about/components/MissionAndVision';
import StrategicObjectives from '@/modules/about/components/StrategicObjectives';
import InstitutionalValues from '@/modules/about/components/InstitutionalValues';
import GlobalEngagement from '@/modules/about/components/GlobalEngagement';
import AboutFounderMessage from '@/modules/about/components/AboutFounderMessage';
import AboutGallery from '@/modules/about/components/AboutGallery';
import { usePageContent } from '@/common/hooks/usePageContent';
import AboutSkeleton from '@/modules/about/components/AboutSkeleton';
import { SeoHead, organizationJsonLd, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('about').catch(() => null);
  return {
    props: { pageContent },
    revalidate: 600,
  };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;

export default function AboutPage({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('about', pageContent);

  return (
    <>
      <SeoHead
        title="About IILP | International Institute for Law and Politics"
        description="Learn about the International Institute for Law and Politics (IILP) — our mission, vision, institutional values, strategic objectives, and global engagement."
        canonicalPath="/about"
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'About', url: '/about' },
          ]),
        ]}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <AboutSkeleton />
          ) : (
            <>
              <AboutHero data={getSection('hero')} />
              <InstitutionalProfile data={getSection('profile') || getSection('institutional_profile')} />
              <MissionAndVision
                missionData={getSection('our_mission')}
                visionData={getSection('our_vision')}
                data={getSection('mission_vision')}
              />
              <StrategicObjectives data={getSection('objectives') || getSection('strategic_objectives')} />
              <InstitutionalValues data={getSection('values') || getSection('institutional_values')} />
              <GlobalEngagement data={getSection('global_engagement')} />
              <AboutFounderMessage data={getSection('founder_message')} />
              <AboutGallery data={getSection('gallery')} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
