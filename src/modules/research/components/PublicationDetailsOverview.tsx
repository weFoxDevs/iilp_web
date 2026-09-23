import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicationItem } from "@/common/services/publications.service";

const defaultResearchAreas = [
  "Provide strategic advice on institutional growth and long-term development.",
  "Support the advancement of academic excellence and research quality.",
  "Strengthen the Institute's international reputation and visibility.",
  "Facilitate connections with universities, research institutions, international organizations, and professional networks.",
  "Advise on governance, policy development, and institutional strategy.",
  "Support international collaboration and partnership-building efforts.",
  "Contribute expertise on emerging global legal, political, and humanitarian issues.",
];

interface PublicationDetailsOverviewProps {
  publication?: PublicationItem | null;
}

export default function PublicationDetailsOverview({ publication }: PublicationDetailsOverviewProps) {
  const overviewText =
    publication?.overview ||
    publication?.description ||
    "The Department of Law and International Legal Studies is dedicated to advancing rigorous scholarship and education in law, legal systems, and international legal frameworks. It examines how laws shape societies, govern relations between states, protect individuals, and provide the foundation for justice and order in the global community.";

  const purposeText =
    publication?.purpose ||
    "To advance legal scholarship, foster critical thinking, and equip students and researchers with the knowledge and analytical tools necessary to navigate and contribute to the development of local, national, and international legal systems in service of justice, human rights, and good governance.";

  const areasList =
    Array.isArray(publication?.researchAreas) && publication.researchAreas.length > 0
      ? publication.researchAreas
      : defaultResearchAreas;

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-[80px]">
        {/* Left Column: Content Sections */}
        <div className="flex-1 w-full flex flex-col gap-12 lg:gap-[80px]">
          {/* 1. Overview */}
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <div className="flex flex-col gap-4 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Overview
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[24px] text-[#0a0d12]">
                Research Overview
              </h2>
            </div>
            <p className="font-sans text-base sm:text-[20px] text-[#0a0d12]/70 leading-relaxed sm:leading-[30px] whitespace-pre-line">
              {overviewText}
            </p>
          </div>

          {/* 2. Purpose */}
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <div className="flex flex-col gap-4 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Purpose
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[24px] text-[#0a0d12]">
                Department Mission &amp; Academic Scope
              </h2>
            </div>
            <p className="font-sans text-base sm:text-[20px] text-[#0a0d12]/70 leading-relaxed sm:leading-[30px] whitespace-pre-line">
              {purposeText}
            </p>
          </div>

          {/* 3. Areas of Focus */}
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <div className="flex flex-col gap-4 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Areas of Focus
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[24px] text-[#0a0d12]">
                Key Research Areas
              </h2>
            </div>

            {/* Checkmark List */}
            <div className="flex flex-col gap-4">
              {areasList.map((area, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="relative shrink-0 w-6 h-6 mt-0.5">
                    <Image
                      src="/assets/checkmark-circle-sky.svg"
                      alt="Check"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <p className="flex-1 font-sans text-base sm:text-[18px] text-[#00506b] leading-[28px]">
                    {area}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action Sidebars */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-8 lg:gap-[80px]">
          {/* Card 1: Submit Your Research */}
          <div className="bg-[#00506b] border border-[#b0ebff] rounded-2xl p-6 sm:p-[30px] flex flex-col gap-6 shadow-xs">
            <div className="flex flex-col gap-4 text-white">
              <h3 className="font-serif font-bold text-xl sm:text-[24px] text-white">
                Submit Your Research
              </h3>
              <p className="font-sans text-base sm:text-[18px] text-white/90 leading-[28px]">
                Share your original research, scholarly work, and academic
                contributions with the IILP research community.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full">
              <Link
                href="/contact"
                className="flex-1 inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-5 py-3.5 rounded-full transition-colors whitespace-nowrap drop-shadow-xs text-center"
              >
                Submit Research
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#f9fafb] hover:bg-white text-[#4a5565] border border-[#e5e7eb] font-sans font-semibold text-sm sm:text-base px-5 py-3.5 rounded-full transition-colors whitespace-nowrap drop-shadow-xs text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Card 2: Full Document Download if available */}
          {publication?.documentUrl && (
            <div className="bg-[#e6f9ff] border border-[#00bfff] rounded-2xl p-6 sm:p-[30px] flex flex-col gap-4 shadow-xs">
              <h3 className="font-serif font-bold text-xl text-[#000080]">
                Full Publication Document
              </h3>
              <p className="font-sans text-sm text-[#00506b] leading-relaxed">
                Access and download the complete working paper, citations, and reference appendices.
              </p>
              <a
                href={publication.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#000080] hover:bg-[#000060] text-white font-sans font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Full Paper (PDF)
              </a>
            </div>
          )}

          {/* Card 3: Explore All Publications */}
          <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 sm:p-[30px] flex flex-col gap-6 shadow-xs">
            <div className="flex flex-col gap-4">
              <h3 className="font-serif font-bold text-xl sm:text-[24px] text-[#000080]">
                Explore All Publications
              </h3>
              <p className="font-sans text-base sm:text-[18px] text-[#00506b] leading-[28px]">
                Discover policy briefs, monographs, and scholarly archives across all five departments.
              </p>
            </div>
            <div>
              <Link
                href="/publications"
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors whitespace-nowrap drop-shadow-xs"
              >
                View Repository
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
