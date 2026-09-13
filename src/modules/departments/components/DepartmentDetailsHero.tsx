import React from "react";
import Image from "next/image";

export default function DepartmentDetailsHero() {
  return (
    <section className="relative w-full min-h-[620px] lg:h-[750px] overflow-hidden flex flex-col items-center justify-end pb-[160px] sm:pb-[200px] lg:pb-[240px] pt-[160px] sm:pt-[180px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] text-center isolate">
      {/* Background Image with Dark and Soft Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/department-details-hero.png"
          alt="Department of Law and International Legal Studies"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark linear gradient overlay matching Figma: from-[rgba(0,0,0,0.45)] to-[rgba(255,255,255,0.6)] */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-transparent" />
        {/* Bottom soft fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-4 sm:gap-6 relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 py-1.5 sm:py-2 backdrop-blur-xs bg-black/15">
          <span className="text-xs sm:text-sm md:text-[16px] font-sans font-semibold tracking-wider text-[#fdfdfd] uppercase leading-[17.6px]">
            Departments
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-serif font-semibold text-white tracking-[-0.96px] leading-tight sm:leading-[1.2] lg:leading-[60px] max-w-[856px]">
          Department of Law and International Legal Studies
        </h1>

        {/* Subtitle */}
        <p className="text-white/95 text-base sm:text-lg lg:text-[20px] font-sans font-normal leading-relaxed lg:leading-[30px] max-w-[978px] drop-shadow-xs">
          The Department of Law and International Legal Studies is dedicated to
          advancing rigorous scholarship and education in international law, legal theory,
          and global governance.
        </p>
      </div>
    </section>
  );
}
