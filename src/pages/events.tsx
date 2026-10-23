import React from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { usePageContent } from '@/common/hooks/usePageContent';
import { EventsHero } from '@/modules/events/components/EventsHero';
import { EventsCalendar } from '@/modules/events/components/EventsCalendar';
import { NewsletterArchive } from '@/modules/events/components/NewsletterArchive';
import { PhotoGallery } from '@/modules/events/components/PhotoGallery';
import EventsSkeleton from '@/modules/events/components/EventsSkeleton';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('events').catch(() => null);
  return {
    props: { pageContent },
    revalidate: 300,
  };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;

export default function EventsPage({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('events', pageContent);

  return (
    <>
      <SeoHead
        title="Events & Conferences | International Institute for Law and Politics (IILP)"
        description="Conferences, seminars, workshops, webinars, and policy dialogues organized by IILP to advance knowledge and build capacity in law, governance, and human rights."
        canonicalPath="/events"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Events', url: '/events' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900">
        <Header />

        <main className="flex-grow">
          {isLoading ? (
            <EventsSkeleton />
          ) : (
            <>
              <EventsHero data={getSection('hero')} />
              <EventsCalendar data={getSection('events_calendar')} />
              <NewsletterArchive data={getSection('newsletter_banner')} />
              <PhotoGallery data={getSection('photo_gallery')} />
            </>
          )}
        </main>

        <Footer withCta={true} />
      </div>
    </>
  );
}
