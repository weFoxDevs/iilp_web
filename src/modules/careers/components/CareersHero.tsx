import React from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

interface CareersHeroProps {
  data?: Partial<PageSectionData>;
}

export function CareersHero({ data }: CareersHeroProps) {
  const badge = data?.badge || "CAREERS";
  const title = data?.title || "Careers / Work With Us";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "Join the International Institute for Law and Politics team and contribute to advancing global justice, governance, and human rights scholarship.";
  const bgImage = data?.bgImage || "/images/contact-hero-bg.png";

  return (
    <section
      className="relative w-full overflow-hidden min-h-[520px] lg:min-h-[580px] flex items-end justify-center pb-24 lg:pb-[140px] pt-32 lg:pt-[160px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]"
      data-node-id="155:77146"
    >
      {/* Background Image with Dark & Fade Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Figma Gradients: Dark top overlay & subtle gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white/70" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col items-center gap-5 sm:gap-6 text-center">
        {/* Pill Badge (Figma node 155:77152) */}
        <div
          className="inline-flex items-center border border-[#e6f9ff] rounded-full px-4 py-2 bg-white/10 backdrop-blur-xs shadow-xs"
          data-node-id="155:77152"
        >
          <span
            className="font-sans font-semibold text-sm sm:text-base text-[#fdfdfd] uppercase tracking-wider leading-[17.6px]"
            data-node-id="155:77154"
          >
            {badge}
          </span>
        </div>

        {/* Title (Figma node 155:77155) */}
        <h1
          className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-[-0.96px] leading-tight lg:leading-[60px] max-w-[856px]"
          data-node-id="155:77155"
        >
          {title}
        </h1>

        {/* Supporting Description (Figma node 155:77156) */}
        <p
          className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-white/95 leading-relaxed lg:leading-[30px] max-w-[978px]"
          data-node-id="155:77156"
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom Soft White Gradient Fade matching Figma Frame 155:77157 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white pointer-events-none z-10"
        data-node-id="155:77157"
      />
    </section>
  );
}
