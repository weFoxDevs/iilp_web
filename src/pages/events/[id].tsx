import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { initialEvents } from "@/modules/events/data/eventsData";
import { EventDetailsHero } from "@/modules/events/components/EventDetailsHero";
import { EventDetailsContent } from "@/modules/events/components/EventDetailsContent";
import { PhotoGallery } from "@/modules/events/components/PhotoGallery";
import { EventDetailsRelated } from "@/modules/events/components/EventDetailsRelated";
import {
  fetchPublicEventBySlug,
  transformApiEventToEventItem,
} from "@/common/services/events.service";
import { EventItem } from "@/modules/events/types";

interface EventDetailPageProps {
  defaultSlug?: string;
}

export default function EventDetailPage({ defaultSlug }: EventDetailPageProps = {}) {
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const rawKey =
      (router.query.id as string) ||
      (router.query.slug as string) ||
      defaultSlug ||
      "summit-2026-1";

    const key = rawKey.trim();
    let isMounted = true;
    setIsLoading(true);

    async function loadEvent() {
      try {
        const apiEvent = await fetchPublicEventBySlug(key);
        if (!isMounted) return;

        if (apiEvent) {
          setEvent(transformApiEventToEventItem(apiEvent));
        } else {
          const fallback =
            initialEvents.find(
              (item) => item.id === key || item.slug === key
            ) ||
            initialEvents[0] ||
            null;
          setEvent(fallback);
        }
      } catch (err) {
        if (!isMounted) return;
        const fallback =
          initialEvents.find(
            (item) => item.id === key || item.slug === key
          ) ||
          initialEvents[0] ||
          null;
        setEvent(fallback);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [router.isReady, router.query.id, router.query.slug, defaultSlug]);

  const pageTitle = event
    ? `${event.title} — IILP Events & Conferences`
    : "Event Details — IILP";
  const pageDescription =
    event?.shortSummary ||
    event?.description ||
    "International conferences, webinars, workshops, and policy dialogues hosted by the Institute for International Law & Policy.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900">
        <Header />

        <main className="flex-grow">
          {isLoading ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading event details...</p>
            </div>
          ) : !event ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00698c] flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Event Not Found
              </h2>
              <p className="text-gray-600 text-sm max-w-md">
                The event you requested could not be located. It may have expired, been rescheduled, or unpublished.
              </p>
              <Link
                href="/events"
                className="mt-2 px-6 py-2.5 bg-[#00bfff] hover:bg-[#009ecc] text-white text-sm font-semibold rounded-full shadow-xs transition-colors"
              >
                Back to All Events
              </Link>
            </div>
          ) : (
            <>
              {/* Hero Section */}
              <EventDetailsHero
                badge={event.category || "Event"}
                title={event.title}
                subtitle={event.shortSummary || event.description}
                bgImage={event.image || "/assets/fellowship-hero-bg.png"}
              />

              {/* Event Content & Sticky Registration Action Card */}
              <EventDetailsContent event={event} />

              {/* Photo Gallery / Visual Media Section */}
              <PhotoGallery />

              {/* Related Events / Stay Updated Section */}
              <EventDetailsRelated
                currentEventId={event.id}
                initialRelatedEvents={event.relatedEvents}
              />
            </>
          )}
        </main>

        {/* Footer with "Join the IILP Community Today" CTA */}
        <Footer withCta={true} />
      </div>
    </>
  );
}
