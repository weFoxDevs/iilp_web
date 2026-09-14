import React, { useState } from "react";
import Link from "next/link";
import { initialEvents } from "../data/eventsData";
import { EventItem } from "../types";
import { EventCard } from "./EventCard";
import { EventRegistrationModal } from "./EventRegistrationModal";

interface EventDetailsRelatedProps {
  currentEventId?: string;
}

export function EventDetailsRelated({ currentEventId }: EventDetailsRelatedProps) {
  const [activeTab, setActiveTab] = useState<"Programs" | "News" | "Events">("Events");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const relatedEvents = initialEvents
    .filter((ev) => ev.id !== currentEventId)
    .slice(0, 3);

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
              News &amp; Media Center
            </h2>

            <p className="font-sans text-base sm:text-lg text-gray-600 leading-relaxed">
              Interdisciplinary programs advancing law, governance, human rights,
              and development through rigorous research and scholarship.
            </p>
          </div>

          {/* Right Filter Tabs */}
          <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-1.5 rounded-full flex items-center gap-1.5 self-start md:self-end shadow-xs shrink-0">
            {(["Programs", "News", "Events"] as const).map((tab) => (
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

        {/* Event Cards Grid Matching Frame 148:68286 */}
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
