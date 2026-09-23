import React from "react";
import Image from "next/image";
import { PublicationItem } from "@/common/services/publications.service";

interface PublicationDetailsHeroProps {
  publication?: PublicationItem | null;
}

export default function PublicationDetailsHero({ publication }: PublicationDetailsHeroProps) {
  const category = publication?.category || "Policy Briefs";
  const title =
    publication?.title ||
    "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026";
  const description =
    publication?.description ||
    "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.";
  const bgImage =
    publication?.image && !publication.image.includes("faculty-member")
      ? publication.image
      : "/assets/department-details-hero.png";

  return (
    <section className="relative w-full min-h-[620px] lg:h-[750px] overflow-hidden flex flex-col items-center justify-end pb-[160px] sm:pb-[200px] lg:pb-[240px] pt-[160px] sm:pt-[180px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] text-center isolate">
      {/* Background Image with Dark & Gradient Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark linear gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-transparent" />
        {/* Soft bottom blend to white */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-4 sm:gap-6 relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 py-1.5 sm:py-2 backdrop-blur-xs bg-black/15">
          <span className="text-xs sm:text-sm md:text-[16px] font-sans font-semibold tracking-wider text-[#fdfdfd] uppercase leading-[17.6px]">
            {category}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-semibold text-white tracking-[-0.96px] leading-tight sm:leading-[1.2] lg:leading-[60px] max-w-[856px]">
          {title}
        </h1>

        {/* Supporting Text */}
        <p className="text-white/95 text-base sm:text-lg lg:text-[20px] font-sans font-normal leading-relaxed lg:leading-[30px] max-w-[978px] drop-shadow-xs">
          {description}
        </p>

        {/* Author / Date Meta pill */}
        {publication && (
          <div className="flex items-center gap-3 mt-2 text-white/90 text-sm font-sans">
            <span className="font-semibold">{publication.authorName}</span>
            <span>·</span>
            <span>{publication.field}</span>
            <span>·</span>
            <span>{publication.publicationDate}</span>
          </div>
        )}
      </div>
    </section>
  );
}
