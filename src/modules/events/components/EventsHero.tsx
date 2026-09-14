import React from "react";
import Image from "next/image";

export function EventsHero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-end justify-center pb-24 lg:pb-[140px] pt-32 lg:pt-[160px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      {/* Background Image with Dark & Fade Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/fellowship-hero-bg.png"
          alt="Conferences, Seminars, Workshops, Webinars"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-white/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col items-center gap-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 py-2 bg-white/10 backdrop-blur-xs shadow-xs">
          <span className="font-sans font-semibold text-sm sm:text-base text-[#fdfdfd] uppercase tracking-wider leading-[17.6px]">
            Events &amp; Conferences
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-[-0.96px] leading-tight lg:leading-[60px] max-w-[856px]">
          Conferences · Seminars · Workshops · Webinars
        </h1>

        {/* Description */}
        <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-white leading-relaxed lg:leading-[30px] max-w-[978px]">
          IILP organizes conferences, seminars, workshops, webinars, and policy
          dialogues to advance knowledge, foster dialogue, and build capacity in
          law, governance, and human rights.
        </p>
      </div>

      {/* Bottom Soft White Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>
  );
}
