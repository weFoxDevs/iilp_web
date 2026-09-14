import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { EventsHero } from "@/modules/events/components/EventsHero";
import { EventsCalendar } from "@/modules/events/components/EventsCalendar";
import { NewsletterArchive } from "@/modules/events/components/NewsletterArchive";
import { PhotoGallery } from "@/modules/events/components/PhotoGallery";

export default function EventsPage() {
  return (
    <>
      <Head>
        <title>Events &amp; Conferences — Institute for International Law &amp; Policy (IILP)</title>
        <meta
          name="description"
          content="Conferences, seminars, workshops, webinars, and policy dialogues organized by IILP to advance knowledge and build capacity in law, governance, and human rights."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900">
        <Header />

        <main className="flex-grow">
          {/* Hero Section (Frame 147:65673) */}
          <EventsHero />

          {/* Upcoming Events Calendar & Grid (Frame 147:65681) */}
          <EventsCalendar />

          {/* Newsletter Archive Banner (Frame 147:65856) */}
          <NewsletterArchive />

          {/* Photo Gallery / Visual Media Section (Frame 147:65883) */}
          <PhotoGallery />
        </main>

        {/* Footer with "Join the IILP Community Today" CTA (Frame 147:65936 & 147:65953) */}
        <Footer withCta={true} />
      </div>
    </>
  );
}
