import React, { useState } from "react";
import { EventItem } from "../types";
import { EventRegistrationModal } from "./EventRegistrationModal";

interface EventDetailsContentProps {
  event: EventItem;
}

export function EventDetailsContent({ event }: EventDetailsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const highlights = [
    {
      title: "Keynote Speakers",
      description:
        "Renowned industry leaders and academics will kick off the event with thought-provoking insights into emerging legal frameworks, international human rights law, and institutional governance.",
    },
    {
      title: "Panel Discussions",
      description:
        "Explore dynamic discussions on current legal trends, ethical implications of AI in judicial review, climate displacement, and multilateral treaties with perspectives from diverse international delegates.",
    },
    {
      title: "Research Presentations",
      description:
        "Distinguished faculty and fellows will present their latest empirical research and policy briefs. Topics range from non-refoulement obligations to regional constitutional safeguards.",
    },
    {
      title: "Workshops and Demos",
      description:
        "Hands-on interactive breakout sessions designed for scholars and practitioners. Examine case studies, treaty drafting techniques, and comparative statutory analysis.",
    },
    {
      title: "Networking Opportunities",
      description:
        "Dedicated networking receptions offer attendees the opportunity to connect with peers, ambassadors, professors, and legal practitioners, fostering international mentorship and joint research.",
    },
    {
      title: "Tech & Policy Showcase",
      description:
        "A showcase of innovative projects, open legal databases, and digital human rights monitoring platforms. Attendees can experience firsthand the modern tools shaping global policy analysis.",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-[120px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
        {/* Left Column: Event Description & Highlights */}
        <div className="w-full lg:max-w-[845px] flex flex-col gap-8">
          <p className="font-sans text-gray-700 text-base sm:text-lg lg:text-[18px] leading-relaxed">
            Join us for an exciting day of innovation, discovery, and collaboration
            at the Institute for International Law &amp; Policy&apos;s Annual
            Symposium. This year&apos;s convening brings together leading
            researchers, legal scholars, policy advocates, and students to explore
            the latest developments in international jurisprudence, human rights
            safeguards, and practical applications that shape the global order.
          </p>

          <div className="flex flex-col gap-6 pt-4">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-gray-950">
              Event Highlights:
            </h2>

            <div className="flex flex-col gap-6">
              {highlights.map((item, idx) => (
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
              <span className="bg-[#cafff6] text-[#0b7b69] px-3 py-1 rounded-md text-xs font-semibold w-fit">
                {event.mode}
              </span>
              <h3 className="font-serif font-bold text-2xl sm:text-[26px] text-white leading-snug">
                {event.title}
              </h3>
            </div>

            {/* Time & Seats Row */}
            <div className="flex items-center justify-between py-4 border-y border-white/15">
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
                    Time
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {event.time}
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                  Seats
                </span>
                <span className="text-base font-semibold text-white">
                  {event.seats}
                </span>
              </div>
            </div>

            {/* Register CTA Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 px-6 bg-[#00bfff] hover:bg-sky-400 text-white font-sans font-semibold text-base rounded-full shadow-lg shadow-sky-900/30 text-center transition-all cursor-pointer hover:shadow-sky-400/20"
            >
              Register Now
            </button>
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
