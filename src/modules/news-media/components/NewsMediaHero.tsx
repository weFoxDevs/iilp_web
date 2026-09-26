import React from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

interface NewsMediaHeroProps {
  data?: Partial<PageSectionData>;
  badge?: string;
  title?: string;
  subtitle?: string;
  bgImage?: string;
}

export default function NewsMediaHero({
  data,
  badge: propBadge,
  title: propTitle,
  subtitle: propSubtitle,
  bgImage: propBgImage,
}: NewsMediaHeroProps) {
  const badge = data?.badge ?? propBadge ?? "News";
  const title = data?.title ?? propTitle ?? "News & Media Center";
  const subtitle =
    data?.subtitle ??
    propSubtitle ??
    "Stay updated with IILP's latest news, press releases, articles, opinion pieces, interviews, videos, and newsletter archives.";
  const bgImage = data?.bgImage || propBgImage || "/assets/fellowship-hero-bg.png";
  return (
    <section className="relative w-full overflow-hidden min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] flex items-end justify-center pb-16 sm:pb-20 lg:pb-[140px] pt-24 lg:pt-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      {/* Background Image with Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src={bgImage}
          alt={title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay with gentle gradient fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/40 to-white/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full flex flex-col items-center gap-6 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3 py-2 bg-white/10 backdrop-blur-xs">
          <span className="font-sans font-semibold text-sm sm:text-base text-[#fdfdfd] uppercase tracking-wider leading-[17.6px]">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight leading-tight lg:leading-[60px] max-w-[856px]">
          {title}
        </h1>

        {/* Description */}
        <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-white leading-relaxed lg:leading-[30px] max-w-[978px]">
          {subtitle}
        </p>
      </div>

      {/* Bottom Soft White Gradient Fade into the content */}
      <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>
  );
}
