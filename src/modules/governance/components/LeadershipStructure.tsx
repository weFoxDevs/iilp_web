import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface LeadershipTier {
  title: string;
  desc: string;
}

const defaultLeadershipTiers: LeadershipTier[] = [
  {
    title: 'Founding Authority',
    desc: 'Founder & President — visionary and strategic authority',
  },
  {
    title: 'Governing Council',
    desc: 'Highest governing and decision-making body',
  },
  {
    title: 'Executive Directorate Board',
    desc: 'Operational leadership and program delivery',
  },
  {
    title: 'Academic Senate',
    desc: 'Principal academic and intellectual authority',
  },
  {
    title: 'ICT & Media Cell',
    desc: 'Digital presence, media and communications',
  },
  {
    title: 'Advisory Board',
    desc: 'External strategic and intellectual guidance',
  },
  {
    title: 'Global Fellowship Network',
    desc: 'International scholarly community',
  },
  {
    title: 'Ethics & Accountability Commission',
    desc: 'Institutional integrity and ethical governance',
  },
  {
    title: 'Youth Leadership Assembly',
    desc: 'Youth participation and leadership development',
  },
  {
    title: 'Members Respectively',
    desc: 'Institutional members and designated representatives',
  },
];

const TIER_SLUGS: Record<string, string> = {
  'Founding Authority': 'founding-authority',
  'Governing Council': 'governing-council',
  'Executive Directorate Board': 'executive-directorate',
  'Academic Senate': 'academic-senate',
  'ICT & Media Cell': 'ict-media-cell',
  'Advisory Board': 'advisory-board',
  'Global Fellowship Network': 'global-fellowship-network',
  'Ethics & Accountability Commission': 'ethics-commission',
  'Youth Leadership Assembly': 'youth-leadership-assembly',
  'Members Respectively': 'members-respectively',
};

interface LeadershipStructureProps {
  data?: Partial<PageSectionData>;
}

export default function LeadershipStructure({ data }: LeadershipStructureProps) {
  const badge = data?.badge ?? 'How We Are Governed';
  const title = data?.title ?? 'Multi-Tiered Leadership Structure';
  const subtitle =
    data?.subtitle ??
    'The Institute is governed through a multi-tiered leadership structure that combines strategic oversight, operational management, academic leadership, and institutional development.';

  const tiersList: LeadershipTier[] =
    Array.isArray(data?.metadata?.tiers) && data.metadata.tiers.length > 0
      ? (data.metadata.tiers as LeadershipTier[])
      : defaultLeadershipTiers;

  const image1 =
    (typeof data?.metadata?.image1 === 'string' && data.metadata.image1) ||
    '/assets/about-institutional-1.png';
  const image2 =
    (typeof data?.metadata?.image2 === 'string' && data.metadata.image2) ||
    '/assets/about-institutional-2.png';

  // Slider State (3 items per view)
  const ITEMS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const totalPages = Math.ceil(tiersList.length / ITEMS_PER_PAGE);

  // Auto-slide every 6 seconds unless user pauses or hovers
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, totalPages]);

  const displayedTiers = tiersList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-[120px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 sm:gap-12 lg:gap-[80px]">
        
        {/* Left Side: Overlapping Images and Stamp Badge */}
        <div className="w-full lg:w-[590px] h-[360px] sm:h-[500px] lg:h-[580px] relative shrink-0 mx-auto max-w-[590px]">
          {/* Top Left Image: Professor & Student */}
          <div className="w-[62%] sm:w-[348px] h-[250px] sm:h-[400px] lg:h-[448px] relative overflow-hidden shadow-sm rounded-lg sm:rounded-none">
            <Image
              src={image1}
              alt="Faculty and student in discussion"
              fill
              sizes="(max-width: 768px) 60vw, 348px"
              className="object-cover"
            />
          </div>

          {/* Bottom Right Overlapping Image: Female Student */}
          <div className="w-[60%] sm:w-[348px] h-[190px] sm:h-[310px] lg:h-[358px] absolute right-0 sm:left-[242px] bottom-0 overflow-hidden border-[3px] sm:border-[4px] border-white shadow-xl rounded-lg sm:rounded-none">
            <Image
              src={image2}
              alt="Smiling IILP student"
              fill
              sizes="(max-width: 768px) 60vw, 348px"
              className="object-cover"
            />
          </div>

          {/* Circular Heritage Badge */}
          <div className="absolute right-2 sm:right-auto sm:left-[410px] top-[16px] sm:top-[60px] w-[80px] sm:w-[120px] h-[80px] sm:h-[120px] rounded-full bg-white border border-[#641320] flex items-center justify-center shadow-lg z-20">
            {/* Center Wreath Icon */}
            <div className="relative w-[36px] sm:w-[62px] h-[28px] sm:h-[50px] z-10">
              <Image
                src="/assets/about-badge-icon.svg"
                alt="Heritage award icon"
                fill
                className="object-contain"
              />
            </div>

            {/* Circular Rotating Badge Text */}
            <div className="absolute inset-[-6px] sm:inset-[-12px] flex items-center justify-center animate-[spin_25s_linear_infinite] pointer-events-none">
              <Image
                src="/assets/about-badge-text.png"
                alt="Next-Gen Toward Education Since 1995"
                width={140}
                height={140}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Content & 3-Item Slider */}
        <div
          className="flex-1 w-full flex flex-col gap-6 lg:gap-[32px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header Block */}
          <div className="flex flex-col gap-3.5 items-start">
            <div className="flex items-center justify-between w-full">
              {badge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                    {badge}
                  </span>
                </div>
              )}

              {/* Slider Controls (Next/Prev in header for compact luxury feel) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#00698c] hover:bg-[#e6f9ff] text-gray-700 hover:text-[#00698c] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Previous Governance Bodies"
                  aria-label="Previous Tiers"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full border border-gray-300 hover:border-[#00698c] hover:bg-[#e6f9ff] text-gray-700 hover:text-[#00698c] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  title="Next Governance Bodies"
                  aria-label="Next Tiers"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[34px] font-medium text-[#0a0d12] tracking-tight font-serif leading-[1.25]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[#0a0d12]/70 text-sm md:text-base lg:text-[17px] leading-relaxed font-sans">
                {subtitle}
              </p>
            )}
          </div>

          {/* 3 Active Slider Cards with Smooth Fade-in */}
          <div className="flex flex-col gap-3.5 lg:gap-4 w-full min-h-[300px]">
            {displayedTiers.map((tier, idx) => {
              const globalIndex = currentPage * ITEMS_PER_PAGE + idx;
              const slug =
                TIER_SLUGS[tier.title] ||
                tier.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

              return (
                <Link
                  key={`${currentPage}-${tier.title}`}
                  href={`/governance/${slug}`}
                  className="group bg-[#e6f9ff] border border-[#b0ebff] hover:border-[#00698c] hover:bg-[#d8f5ff] p-4 lg:p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:shadow-md cursor-pointer rounded-xl animate-fadeIn"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-white/90 text-[#00698c] font-mono text-xs font-bold flex items-center justify-center border border-[#b0ebff]">
                      0{globalIndex + 1}
                    </span>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h3 className="text-[#000080] group-hover:text-[#00506b] text-base md:text-lg lg:text-[20px] font-serif font-bold tracking-tight leading-snug transition-colors truncate sm:whitespace-normal">
                        {tier.title}
                      </h3>
                      <p className="text-[#000036]/70 text-xs sm:text-sm font-sans line-clamp-1 sm:line-clamp-2">
                        {tier.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/80 group-hover:bg-[#00698c] text-[#00698c] group-hover:text-white flex items-center justify-center transition-all shadow-2xs group-hover:translate-x-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Slider Pagination Controls & Indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentPage(index)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentPage === index
                      ? 'w-7 bg-[#00698c]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter and View All link */}
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <span>
                Showing {currentPage * ITEMS_PER_PAGE + 1}–
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, tiersList.length)} of {tiersList.length} Bodies
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
