import React from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

interface AdmissionHeroProps {
  data?: Partial<PageSectionData>;
}

export default function AdmissionHero({ data }: AdmissionHeroProps) {
  const badge = data?.badge ?? "Academic Admissions \u2022 2026";
  const title = data?.title ?? "Online Admission & Application Form";
  const subtitle =
    data?.subtitle ??
    "Academic Programs \u2022 Certificate Courses \u2022 Diploma Programs \u2022 Professional Training";
  const bgImage = data?.bgImage || "/assets/fellowship-hero-bg.png";

  return (
    <section className="relative w-full min-h-[480px] sm:min-h-[640px] lg:min-h-[720px] overflow-hidden flex flex-col items-center justify-center pt-[130px] sm:pt-[160px] lg:pt-[200px] pb-[100px] sm:pb-[180px] lg:pb-[260px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] text-center isolate">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/25" />
        {/* Soft bottom blend to white */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-4 sm:gap-6 relative z-10">
        {/* Pill Badge */}
        {badge && (
          <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 py-1.5 sm:py-2 backdrop-blur-xs bg-black/15">
            <span className="text-xs sm:text-sm md:text-[16px] font-sans font-semibold tracking-wider text-[#fdfdfd] uppercase leading-[17.6px]">
              {badge}
            </span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-semibold text-white tracking-tight leading-tight sm:leading-[1.2] lg:leading-[60px] max-w-[880px]">
          {title}
        </h1>

        {/* Supporting Description */}
        {subtitle && (
          <p className="text-white/95 text-base sm:text-lg lg:text-[20px] font-sans font-normal leading-relaxed lg:leading-[30px] max-w-[978px] drop-shadow-xs">
            {subtitle}
          </p>
        )}

        {/* Secondary description */}
        <p className="text-white/85 text-xs sm:text-sm md:text-base font-sans font-normal max-w-[820px] leading-relaxed">
          Welcome to the International Institute for Law and Politics (IILP). Join scholars, practitioners, and leaders
          around the world advancing human rights, democratic governance, and evidence-based policy.
        </p>

        {/* Quick CTA to scroll down to Form */}
        <div className="pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("apply");
              if (el) {
                const headerOffset = 90;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
            }}
            className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-7 py-3 rounded-full transition-colors drop-shadow-md cursor-pointer"
          >
            Start Application &darr;
          </button>
        </div>
      </div>
    </section>
  );
}
