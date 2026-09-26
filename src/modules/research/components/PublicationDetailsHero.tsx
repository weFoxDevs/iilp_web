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

  const isRemoteImage = bgImage.startsWith("http://") || bgImage.startsWith("https://");

  return (
    <section className="relative w-full min-h-[460px] sm:min-h-[560px] lg:min-h-[640px] overflow-hidden flex flex-col items-center justify-center pt-[120px] sm:pt-[170px] pb-[100px] sm:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[200px] text-center isolate">
      {/* Background Image with Dark & Gradient Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          unoptimized={isRemoteImage}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark linear gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/30" />
        {/* Soft bottom blend to white */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 sm:gap-6 relative z-10 w-full">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff]/80 rounded-full px-3.5 sm:px-4 py-1.5 backdrop-blur-md bg-black/25 shadow-xs">
          <span className="text-xs sm:text-sm font-sans font-semibold tracking-wider text-white uppercase">
            {category}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[46px] font-serif font-semibold text-white tracking-tight sm:tracking-[-0.02em] leading-tight sm:leading-[1.2] lg:leading-[56px] max-w-[980px] drop-shadow-sm">
          {title}
        </h1>

        {/* Supporting Text */}
        <p className="text-white/95 text-base sm:text-lg lg:text-[19px] font-sans font-normal leading-relaxed lg:leading-[30px] max-w-[920px] drop-shadow-xs">
          {description}
        </p>

        {/* Author / Date Meta pill */}
        {publication && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-2 text-white/95 text-xs sm:text-sm font-sans bg-black/25 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl sm:rounded-full border border-white/15 text-center">
            <span className="font-semibold text-white">{publication.authorName}</span>
            {publication.authorRole && (
              <>
                <span className="text-white/50">·</span>
                <span className="text-white/90">{publication.authorRole}</span>
              </>
            )}
            {publication.field && (
              <>
                <span className="text-white/50">·</span>
                <span className="text-white/90">{publication.field}</span>
              </>
            )}
            {publication.publicationDate && (
              <>
                <span className="text-white/50">·</span>
                <span className="text-white/90">{publication.publicationDate}</span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
