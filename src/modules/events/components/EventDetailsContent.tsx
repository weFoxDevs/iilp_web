import React, { useState } from "react";
import { EventItem } from "../types";
import { EventRegistrationModal } from "./EventRegistrationModal";

interface EventDetailsContentProps {
  event: EventItem;
}

export function EventDetailsContent({ event }: EventDetailsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isHtml = /<[a-z][\s\S]*>/i.test(event.description || "");

  const defaultHighlights = [
    {
      title: "Keynote Addresses",
      description:
        "Thought leaders, international jurists, and policy practitioners deliver insightful opening keynotes on critical issues shaping global governance.",
    },
    {
      title: "Interactive Panel Discussions",
      description:
        "High-level dialogue between scholars, judicial experts, and civil society delegates exploring emerging regulatory frameworks and comparative law.",
    },
    {
      title: "Scholarly Research & Briefings",
      description:
        "Faculty fellows and visiting researchers share empirical findings, policy briefs, and statutory recommendations.",
    },
    {
      title: "Audience Q&A & Working Groups",
      description:
        "Engage directly with panelists during dedicated discussion periods and breakout sessions designed to develop actionable policy outcomes.",
    },
    {
      title: "Networking & Collaborative Exchange",
      description:
        "Connect with fellow participants, ambassadors, and academic peers to foster ongoing cross-border research partnerships.",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-[120px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
        {/* Left Column: Event Description & Dynamic Highlights */}
        <div className="w-full lg:max-w-[845px] flex flex-col gap-8">
          {/* Summary Lead Block */}
          {event.shortSummary && (
            <p className="font-sans font-normal text-lg sm:text-xl text-[#00485c] leading-relaxed border-l-4 border-[#00bfff] pl-4 italic bg-[#e6f9ff]/40 py-3.5 rounded-r-xl">
              {event.shortSummary}
            </p>
          )}

          {/* Dynamic Event Description */}
          {isHtml ? (
            <div
              className="prose prose-lg max-w-none font-sans text-gray-700 leading-relaxed [&>h2]:font-serif [&>h2]:text-2xl sm:[&>h2]:text-[26px] [&>h2]:font-bold [&>h2]:text-gray-950 [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[#00bfff] [&>blockquote]:pl-4 [&>blockquote]:italic"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          ) : (
            <div className="flex flex-col gap-4">
              {event.description
                .split("\n\n")
                .map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="font-sans text-gray-700 text-base sm:text-lg lg:text-[18px] leading-relaxed"
                  >
                    {paragraph.trim()}
                  </p>
                ))}
            </div>
          )}

          {/* Key Program Highlights */}
          <div className="flex flex-col gap-6 pt-6 border-t border-gray-100">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-gray-950">
              Event Highlights &amp; Structure:
            </h2>

            <div className="flex flex-col gap-5">
              {defaultHighlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <span className="size-2 rounded-full bg-[#00bfff] shrink-0 mt-2.5" />
                  <p className="font-sans text-base sm:text-[16px] text-gray-700 leading-relaxed">
                    <strong className="text-gray-950 font-semibold">
                      {item.title}:{" "}
                    </strong>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Location Details */}
          <div className="flex flex-col gap-4 pt-6 border-t border-gray-100">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-950">
              Venue &amp; Access Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.venues.map((venue, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col gap-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-[#e6f9ff] text-[#00698c]">
                      {venue.type === "online" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="20" height="14" x="2" y="3" rx="2" />
                          <line x1="8" x2="16" y1="21" y2="21" />
                          <line x1="12" x2="12" y1="17" y2="21" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      )}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {venue.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider pl-7">
                    {venue.type === "online" ? "Virtual Access" : "In-Person Campus Venue"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Event Registration Action Card */}
        <div className="w-full lg:w-[480px] lg:max-w-[490px] shrink-0 lg:sticky lg:top-28">
          <div className="bg-[#00485c] text-white rounded-[24px] p-8 sm:p-10 shadow-2xl flex flex-col gap-6 border border-white/10">
            {/* Venue Tag */}
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
              <span className="p-1.5 rounded-full bg-white/15 flex items-center justify-center size-6 text-[#cafff6]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>{event.venues.map((v) => v.name).join(" / ")}</span>
            </div>

            {/* Event Mode Badge & Title */}
            <div className="flex flex-col gap-3">
              <span className="bg-[#cafff6] text-[#0b7b69] px-3 py-1 rounded-md text-xs font-semibold w-fit uppercase tracking-wider">
                {event.mode}
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-[26px] text-white leading-snug">
                {event.title}
              </h3>
            </div>

            {/* Date, Time & Seats Row */}
            <div className="flex flex-col gap-3 py-4 border-y border-white/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-white/15 flex items-center justify-center text-[#cafff6]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                      Schedule
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {event.fullDate} · {event.time}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[12px] font-medium text-white/70 uppercase tracking-wider">
                  Available Seats
                </span>
                <span className="text-sm font-semibold text-[#cafff6]">
                  {event.seats}
                </span>
              </div>
            </div>

            {/* Register CTA Button */}
            {event.isRegistrationOpen !== false ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 px-6 bg-[#00bfff] hover:bg-sky-400 text-white font-sans font-semibold text-base rounded-full shadow-lg shadow-sky-900/30 text-center transition-all cursor-pointer hover:shadow-sky-400/20"
              >
                Register Now
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="w-full py-4 px-6 bg-gray-500 text-gray-200 font-sans font-semibold text-base rounded-full text-center cursor-not-allowed opacity-80"
              >
                Registrations Closed
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal Dialog */}
      <EventRegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
