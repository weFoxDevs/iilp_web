import React, { useState, useEffect } from "react";
import Link from "next/link";
import { initialEvents } from "../data/eventsData";
import { EventItem } from "../types";
import { EventCard } from "./EventCard";
import { EventRegistrationModal } from "./EventRegistrationModal";
import {
  fetchPublicEvents,
  transformApiEventToEventItem,
} from "@/common/services/events.service";

interface EventDetailsRelatedProps {
  currentEventId?: string;
  initialRelatedEvents?: EventItem[];
}

export function EventDetailsRelated({
  currentEventId,
  initialRelatedEvents,
}: EventDetailsRelatedProps) {
  const [activeTab, setActiveTab] = useState<"Programs" | "News" | "Events">("Events");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [eventsList, setEventsList] = useState<EventItem[]>(() => {
    if (initialRelatedEvents && initialRelatedEvents.length > 0) {
      return initialRelatedEvents;
    }
    return initialEvents.filter((ev) => ev.id !== currentEventId).slice(0, 3);
  });

  useEffect(() => {
    if (initialRelatedEvents && initialRelatedEvents.length > 0) {
      setEventsList(initialRelatedEvents);
      return;
    }

    let isMounted = true;
    async function loadRelated() {
      try {
        const res = await fetchPublicEvents({ limit: 4 });
        if (isMounted && res?.items && res.items.length > 0) {
          const transformed = res.items
            .map(transformApiEventToEventItem)
            .filter((ev) => ev.id !== currentEventId)
            .slice(0, 3);
          if (transformed.length > 0) {
            setEventsList(transformed);
          }
        }
      } catch (err) {
        console.warn("[EventDetailsRelated] Using fallback related events:", err);
      }
    }

    loadRelated();
    return () => {
      isMounted = false;
    };
  }, [currentEventId, initialRelatedEvents]);

  const relatedEvents = eventsList.slice(0, 3);

  return (
    <section className="bg-white py-16 lg:py-[120px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-12 lg:gap-16">
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex flex-col items-start gap-4 max-w-[650px]">
            <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5 bg-transparent">
              <span className="font-sans font-semibold text-sm uppercase tracking-wider text-[#0a0d12]">
                Stay Updated
              </span>
            </div>

            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[40px] text-[#0a0d12] tracking-[-0.72px] leading-tight">
              More Upcoming Events
            </h2>

            <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
              Explore conferences, specialized workshops, and academic seminars across all departments.
            </p>
          </div>

          {/* Right Filter Tabs */}
          <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-1.5 rounded-full flex items-center gap-1.5 self-start md:self-end shadow-xs shrink-0">
            {(["Events", "Programs", "News"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#1e2939] text-white shadow-sm"
                    : "bg-white hover:bg-gray-50 text-[#4a5565] border border-[#e5e7eb]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        {activeTab === "Events" ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full items-stretch">
            {/* Left: Wide Event Card */}
            {relatedEvents[0] && (
              <div className="w-full h-full flex flex-col">
                <EventCard
                  event={relatedEvents[0]}
                  onRegister={(item) => setSelectedEvent(item)}
                />
              </div>
            )}

            {/* Right: Two Event Cards Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full items-stretch">
              {relatedEvents.slice(1, 3).map((ev) => (
                <div key={ev.id} className="w-full h-full flex flex-col">
                  <EventCard
                    event={ev}
                    onRegister={(item) => setSelectedEvent(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl text-center gap-3">
            <h3 className="font-serif font-bold text-xl text-gray-900">
              Discover IILP {activeTab}
            </h3>
            <p className="text-gray-600 text-sm max-w-md">
              Visit our {activeTab.toLowerCase()} hub to explore current initiatives, research publications, and announcements.
            </p>
            <Link
              href={activeTab === "News" ? "/news" : "/fellowships"}
              className="mt-2 px-6 py-2 bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold rounded-full shadow-xs transition-colors"
            >
              Explore {activeTab}
            </Link>
          </div>
        )}

        {/* View All Events Link */}
        <div className="flex justify-center pt-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gray-300 hover:border-gray-900 text-gray-900 font-semibold text-sm transition-all hover:bg-gray-50"
          >
            <span>Browse All Events &amp; Conferences</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
