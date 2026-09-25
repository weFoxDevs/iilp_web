import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicationItem } from "@/common/services/publications.service";

const defaultResearchAreas = [
  "Comprehensive analysis of contemporary international legal protection frameworks.",
  "Critical evaluation of state practice and compliance with human rights treaties.",
  "Assessment of equitable responsibility-sharing models across regional actors.",
  "Development of actionable policy protocols to safeguard vulnerable populations.",
  "Strategic recommendations for international tribunals and multilateral bodies.",
];

interface PublicationDetailsOverviewProps {
  publication?: PublicationItem | null;
}

export default function PublicationDetailsOverview({ publication }: PublicationDetailsOverviewProps) {
  const overviewText =
    publication?.overview?.trim() ||
    publication?.description?.trim() ||
    "This research publication examines emerging legal, policy, and institutional frameworks to address contemporary global challenges, providing evidence-based analysis and strategic recommendations for academic scholars and policymakers alike.";

  const purposeText =
    publication?.purpose?.trim() ||
    "To advance rigorous scholarship, foster critical analysis, and equip researchers, policymakers, and civil society with the evidence-based insights necessary to address key challenges in global legal and political governance.";

  const areasList =
    Array.isArray(publication?.researchAreas) && publication.researchAreas.length > 0
      ? publication.researchAreas
      : defaultResearchAreas;

  return (
    <section className="bg-white py-16 lg:py-[120px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[200px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-[70px]">
        {/* Left Column: Content Sections */}
        <div className="flex-1 w-full flex flex-col gap-12 lg:gap-[60px]">
          {/* 1. Overview */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Overview
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[28px] text-[#0a0d12]">
                Research Overview
              </h2>
            </div>
            <div className="font-sans text-base sm:text-[18px] text-[#0a0d12]/80 leading-relaxed sm:leading-[32px] whitespace-pre-line space-y-4">
              {overviewText}
            </div>
          </div>

          {/* 2. Purpose & Academic Scope */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Purpose
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[28px] text-[#0a0d12]">
                Research Purpose &amp; Academic Scope
              </h2>
            </div>
            <div className="font-sans text-base sm:text-[18px] text-[#0a0d12]/80 leading-relaxed sm:leading-[32px] whitespace-pre-line">
              {purposeText}
            </div>
          </div>

          {/* 3. Areas of Focus / Key Points */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Areas of Focus
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[28px] text-[#0a0d12]">
                Key Research Areas &amp; Findings
              </h2>
            </div>

            {/* Checkmark List */}
            <div className="flex flex-col gap-4">
              {areasList.map((area, index) => (
                <div key={index} className="flex items-start gap-3.5">
                  <div className="relative shrink-0 w-6 h-6 mt-0.5">
                    <Image
                      src="/assets/checkmark-circle-sky.svg"
                      alt="Check"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <p className="flex-1 font-sans text-base sm:text-[17px] text-[#00506b] leading-[28px]">
                    {area}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action Sidebars */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-8">
          {/* Metadata Card */}
          {publication && (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-[#0f172a] border-b border-[#e2e8f0] pb-3">
                Publication Details
              </h3>
              <div className="flex flex-col gap-3.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Type / Category</span>
                  <span className="font-semibold text-[#00698c] bg-[#e6f9ff] px-2.5 py-0.5 rounded-full text-xs">
                    {publication.category}
                  </span>
                </div>
                {publication.field && (
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Research Field</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[200px]">
                      {publication.field}
                    </span>
                  </div>
                )}
                {publication.publicationDate && (
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Date</span>
                    <span className="font-semibold text-gray-800">{publication.publicationDate}</span>
                  </div>
                )}
                {publication.authorName && (
                  <div className="flex justify-between items-center py-1 border-b border-gray-100">
                    <span className="text-gray-500 font-medium">Author</span>
                    <span className="font-semibold text-gray-800">{publication.authorName}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-500 font-medium">Access</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                    Open Access
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card: Full Document Download if available */}
          {publication?.documentUrl && (
            <div className="bg-[#e6f9ff] border border-[#00bfff]/60 rounded-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-xs">
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
                className="inline-flex items-center justify-center gap-2 bg-[#000080] hover:bg-[#000060] text-white font-sans font-semibold text-sm px-6 py-3.5 rounded-full transition-colors shadow-xs"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Paper (PDF)
              </a>
            </div>
          )}

          {/* Card: Submit Your Research */}
          <div className="bg-[#00506b] border border-[#b0ebff] rounded-2xl p-6 sm:p-7 flex flex-col gap-5 shadow-xs">
            <div className="flex flex-col gap-3 text-white">
              <h3 className="font-serif font-bold text-xl text-white">
                Submit Your Research
              </h3>
              <p className="font-sans text-sm sm:text-base text-white/90 leading-relaxed">
                Share your original research, scholarly work, and academic contributions with the IILP research community.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full">
              <Link
                href="/contact"
                className="flex-1 inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm px-5 py-3 rounded-full transition-colors whitespace-nowrap text-center"
              >
                Submit Research
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-[#4a5565] border border-gray-200 font-sans font-semibold text-sm px-5 py-3 rounded-full transition-colors whitespace-nowrap text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Card: Explore All Publications */}
          <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-xs">
            <h3 className="font-serif font-bold text-lg text-[#000080]">
              Explore All Publications
            </h3>
            <p className="font-sans text-sm text-[#00506b] leading-relaxed">
              Discover policy briefs, monographs, and scholarly archives across all research fields.
            </p>
            <div>
              <Link
                href="/publications"
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm px-6 py-2.5 rounded-full transition-colors whitespace-nowrap"
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
