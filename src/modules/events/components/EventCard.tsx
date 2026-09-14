import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EventItem } from "../types";

interface EventCardProps {
  event: EventItem;
  onRegister: (event: EventItem) => void;
}

export function EventCard({ event, onRegister }: EventCardProps) {
  const getBadgeStyles = (mode: EventItem["mode"]) => {
    switch (mode) {
      case "Hybrid":
        return {
          bg: "bg-[#cafff6]",
          text: "text-[#0b7b69]",
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          ),
        };
      case "Online":
        return {
          bg: "bg-[#e0f2fe]",
          text: "text-[#0284c7]",
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="3" rx="2" />
              <line x1="8" x2="16" y1="21" y2="21" />
              <line x1="12" x2="12" y1="17" y2="21" />
            </svg>
          ),
        };
      case "Onsite":
        return {
          bg: "bg-[#f3e8ff]",
          text: "text-[#7e22ce]",
          icon: (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          ),
        };
    }
  };

  const badge = getBadgeStyles(event.mode);

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-[16px] overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group h-full">
      {/* Card Header Image Area */}
      <div className="relative h-[180px] w-full overflow-hidden flex flex-col justify-between">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top-Right Date Tag */}
        <div className="relative z-10 self-end p-3">
          <div className="bg-white size-[54px] rounded-lg shadow-md flex flex-col items-center justify-center leading-tight">
            <span className="text-[11px] font-bold text-gray-800 tracking-wider">
              {event.month}
            </span>
            <span className="text-[20px] font-semibold text-gray-950">
              {event.day}
            </span>
          </div>
        </div>

        {/* Bottom Location Frosted Banner */}
        <div className="relative z-10 w-full bg-[#564aa9]/75 backdrop-blur-md px-4 py-2 flex items-center justify-between text-white text-[12px] font-medium border-t border-white/10">
          {event.venues.map((venue, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="bg-white/20 p-1 rounded-full flex items-center justify-center size-5">
                {venue.type === "campus" ? (
                  <svg
                    width="12"
                    height="12"
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
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="12" x="3" y="4" rx="2" />
                    <line x1="8" x2="16" y1="20" y2="20" />
                    <line x1="12" x2="12" y1="16" y2="20" />
                  </svg>
                )}
              </span>
              <span>{venue.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-6">
        <div className="flex flex-col gap-4">
          {/* Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold ${badge.bg} ${badge.text}`}
            >
              {badge.icon}
              {event.mode}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-[22px] sm:text-[24px] text-[#1f2a37] leading-[1.3] line-clamp-2 transition-colors">
            <Link
              href={`/events/${event.id}`}
              className="hover:text-[#00bfff] transition-colors"
            >
              {event.title}
            </Link>
          </h3>

          {/* Description */}
          <p className="font-sans text-[15px] sm:text-[16px] text-gray-600 leading-[24px] line-clamp-2">
            {event.description}
          </p>

          {/* Meta Info: Time & Seats */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#e6f9ff] border border-[#b0ebff] flex items-center justify-center text-[#00bfff]">
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
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </span>
                <span className="text-[13px] font-semibold text-gray-900">
                  {event.time}
                </span>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Seats
              </span>
              <span className="text-[14px] font-semibold text-gray-900">
                {event.seats}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => onRegister(event)}
          className={`w-full py-2.5 px-5 rounded-full font-sans font-semibold text-[14px] transition-all cursor-pointer shadow-xs ${
            event.isPopular
              ? "bg-[#00bfff] hover:bg-sky-400 text-white shadow-sky-200"
              : "bg-white hover:bg-[#00bfff] text-gray-700 hover:text-white border border-gray-200 hover:border-[#00bfff]"
          }`}
        >
          Register
        </button>
      </div>
    </div>
  );
}
