import React, { useState, useMemo } from "react";
import { PageSectionData } from "@/common/services/cms.service";
import { EventItem, EventCategory } from "../types";
import { initialEvents } from "../data/eventsData";
import { EventCard } from "./EventCard";
import { EventRegistrationModal } from "./EventRegistrationModal";

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

  const filteredEvents = useMemo(() => {
    if (activeCategory === "All") return initialEvents;
    return initialEvents.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col items-center gap-12 lg:gap-16">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-2">
            <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[44px] text-[#0a0d12] tracking-[-0.72px] leading-tight">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-base sm:text-lg lg:text-[20px] text-gray-600 leading-relaxed max-w-[720px]">
            {subtitle}
          </p>
        </div>

        {/* Filter Category Pills */}
        <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-1.5 rounded-full flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 shadow-xs max-w-full">
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

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full items-stretch">
            {filteredEvents.map((event) => (
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
