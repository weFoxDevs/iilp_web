import React from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

interface ContactHeroProps {
  data?: Partial<PageSectionData>;
}

export function ContactHero({ data }: ContactHeroProps) {
  const badge = data?.badge || "Contact Us";
  const title = data?.title || "Contact IILP";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "We welcome inquiries from students, scholars, partner institutions, policymakers, and media organizations. Reach out to our dedicated team below.";
  const bgImage = data?.bgImage || "/images/contact-hero-bg.png";

  return (
    <section className="relative w-full overflow-hidden min-h-[440px] sm:min-h-[520px] lg:min-h-[580px] flex items-end justify-center pb-16 sm:pb-24 lg:pb-[140px] pt-24 sm:pt-32 lg:pt-[160px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
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
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-xs shadow-xs">
          <span className="font-sans font-semibold text-xs sm:text-base text-[#fdfdfd] uppercase tracking-wider leading-tight sm:leading-[17.6px]">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-[-0.96px] leading-tight lg:leading-[60px] max-w-[856px]">
          {title}
        </h1>

        {/* Supporting Description */}
        <p className="font-sans font-normal text-sm sm:text-base md:text-lg lg:text-[20px] text-white/95 leading-relaxed lg:leading-[30px] max-w-[978px]">
          {subtitle}
        </p>
      </div>

      {/* Bottom Soft White Gradient Fade matching Figma Frame 150:72260 */}
      <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>
  );
}
