import React, { useState, useMemo, useEffect } from "react";
import { PageSectionData } from "@/common/services/cms.service";
import { EventItem, EventCategory } from "../types";
import { initialEvents } from "../data/eventsData";
import { EventCard } from "./EventCard";
import { EventRegistrationModal } from "./EventRegistrationModal";
import {
  fetchPublicEvents,
  transformApiEventToEventItem,
} from "@/common/services/events.service";

const categories: EventCategory[] = [
  "All",
  "Conferences",
  "Seminars",
  "Workshops",
  "Webinars",
  "Policy Dialogues",
];

interface EventsCalendarProps {
  data?: Partial<PageSectionData>;
}

export function EventsCalendar({ data }: EventsCalendarProps = {}) {
  const badge = data?.badge || "Calendar";
  const title = data?.title || "Upcoming Events";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "Latest developments from IILP and upcoming conferences, seminars, and workshops.";

  const [activeCategory, setActiveCategory] = useState<EventCategory>("All");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [eventsList, setEventsList] = useState<EventItem[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      setIsLoading(true);
      try {
        const res = await fetchPublicEvents({
          category: activeCategory !== "All" ? activeCategory : undefined,
          limit: 50,
        });
        if (isMounted && res && res.items) {
          const transformed = res.items.map(transformApiEventToEventItem);
          setEventsList(transformed);
        }
      } catch (err) {
        console.warn("[EventsCalendar] Using initial events fallback:", err);
        if (isMounted) {
          const fallback =
            activeCategory === "All"
              ? initialEvents
              : initialEvents.filter((item) => item.category === activeCategory);
          setEventsList(fallback);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col items-center gap-10 sm:gap-12 lg:gap-16">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-2">
            <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif font-medium text-2xl sm:text-4xl md:text-5xl lg:text-[44px] text-[#0a0d12] tracking-tight leading-tight">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-base sm:text-lg lg:text-[20px] text-gray-600 leading-relaxed max-w-[720px]">
            {subtitle}
          </p>
        </div>

        {/* Filter Category Pills */}
        <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-1.5 rounded-2xl sm:rounded-full flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 shadow-xs max-w-full">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1e2939] text-white shadow-sm"
                    : "bg-white hover:bg-gray-50 text-[#4a5565] hover:text-gray-900 border border-[#e5e7eb]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading events...</p>
          </div>
        ) : eventsList.length > 0 ? (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
            {eventsList.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onRegister={(ev) => setSelectedEvent(ev)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="size-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-2xl text-gray-900">
              No Events Found
            </h3>
            <p className="text-gray-500 text-sm max-w-md">
              There are currently no scheduled events in the{" "}
              <strong>{activeCategory}</strong> category. Please check back
              soon or browse all upcoming events.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#00bfff] hover:bg-sky-400 text-white font-semibold text-sm transition-colors cursor-pointer"
            >
              View All Events
            </button>
          </div>
        )}
      </div>

      {/* Interactive Registration Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  );
}
