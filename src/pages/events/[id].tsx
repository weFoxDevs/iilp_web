import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { initialEvents } from "@/modules/events/data/eventsData";
import { EventDetailsHero } from "@/modules/events/components/EventDetailsHero";
import { EventDetailsContent } from "@/modules/events/components/EventDetailsContent";
import { PhotoGallery } from "@/modules/events/components/PhotoGallery";
import { EventDetailsRelated } from "@/modules/events/components/EventDetailsRelated";

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const event =
    initialEvents.find((item) => item.id === id) || initialEvents[0];

  return (
    <>
      <Head>
        <title>{event.title} — IILP Events &amp; Conferences</title>
        <meta name="description" content={event.description} />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900">
        <Header />

        <main className="flex-grow">
          {/* Hero Section (Frame 148:68114) */}
          <EventDetailsHero
            badge="Event"
            title={event.title}
            subtitle={event.description}
          />

          {/* Event Content & Sticky Registration Action Card (Frame 148:68126) */}
          <EventDetailsContent event={event} />

          {/* Photo Gallery / Visual Media Section (Frame 148:68233) */}
          <PhotoGallery />

          {/* Related Events / Stay Updated Section (Frame 148:68286) */}
          <EventDetailsRelated currentEventId={event.id} />
        </main>

        {/* Footer with "Join the IILP Community Today" CTA (Frame 147:65936 & 147:65953) */}
        <Footer withCta={true} />
      </div>
    </>
  );
}
