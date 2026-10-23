import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { Hero } from '@/modules/home/components/Hero';
import { MissionVision } from '@/modules/home/components/MissionVision';
import { AcademicPrograms } from '@/modules/home/components/AcademicPrograms';
import { Events } from '@/modules/home/components/Events';
import { Testimonial } from '@/modules/home/components/Testimonial';
import { ImageGallery } from '@/modules/home/components/ImageGallery';
import { FellowshipNetwork } from '@/modules/home/components/FellowshipNetwork';
import { FounderMessage } from '@/modules/home/components/FounderMessage';
import { NewsMedia } from '@/modules/home/components/NewsMedia';
import { usePageContent } from '@/common/hooks/usePageContent';
import HomeSkeleton from '@/modules/home/components/HomeSkeleton';
import { SeoHead, organizationJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('home').catch(() => null);
  return {
    props: { pageContent },
    revalidate: 300,
  };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;

export default function Home({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('home', pageContent);

  return (
    <>
      <SeoHead
        title="International Institute for Law and Politics (IILP)"
        description="The International Institute for Law and Politics (IILP) advances scholarship, fellowship, and leadership in law, governance, human rights, and global policy."
        canonicalPath="/"
        jsonLd={organizationJsonLd()}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
        <Header />

        <main className="flex-grow overflow-x-hidden">
          {isLoading ? (
            <HomeSkeleton />
          ) : (
            <>
              <Hero data={getSection('hero')} />
              <MissionVision
                missionData={getSection('our_mission')}
                visionData={getSection('our_vision')}
              />
              <AcademicPrograms data={getSection('academic_programs')} />
              <Events data={getSection('events')} />
              <Testimonial data={getSection('testimonials')} />
              <ImageGallery data={getSection('image_gallery')} />
              <FellowshipNetwork data={getSection('fellowship_network')} />
              <FounderMessage data={getSection('founder_message')} />
              <NewsMedia data={getSection('news_media')} />
            </>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
