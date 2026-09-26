import React from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

interface PrivacyPolicyHeroProps {
  data?: Partial<PageSectionData>;
}

export function PrivacyPolicyHero({ data }: PrivacyPolicyHeroProps) {
  const badge = data?.badge || "Privacy Policy";
  const title = data?.title || "Your Privacy, Our Priority";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "How IILP collects, uses, and protects your personal information.";
  const bgImage = data?.bgImage || "/images/contact-hero-bg.png";

  return (
    <section
      className="relative w-full overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-end justify-center pb-16 sm:pb-24 lg:pb-[140px] pt-[120px] sm:pt-32 lg:pt-[160px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]"
      data-node-id="150:74268"
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
      <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col items-center gap-4 sm:gap-6 text-center">
        {/* Pill Badge (Figma node 150:74274) */}
        <div
          className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-xs shadow-xs"
          data-node-id="150:74274"
        >
          <span
            className="font-sans font-semibold text-xs sm:text-sm md:text-base text-[#fdfdfd] uppercase tracking-wider leading-[17.6px]"
            data-node-id="150:74276"
          >
            {badge}
          </span>
        </div>

        {/* Title (Figma node 150:74277) */}
        <h1
          className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight sm:tracking-[-0.96px] leading-tight lg:leading-[60px] max-w-[856px]"
          data-node-id="150:74277"
        >
          {title}
        </h1>

        {/* Supporting Description (Figma node 150:74278) */}
        <p
          className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-white/95 leading-relaxed lg:leading-[30px] max-w-[978px]"
          data-node-id="150:74278"
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom Soft White Gradient Fade matching Figma Frame 150:74279 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white pointer-events-none z-10"
        data-node-id="150:74279"
      />
    </section>
  );
}
