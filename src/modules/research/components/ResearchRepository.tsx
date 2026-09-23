import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";
import {
  fetchPublicPublications,
  PublicationItem,
} from "@/common/services/publications.service";

const filterCategories = [
  "All Publications",
  "Research Repository",
  "Research Papers",
  "Policy Briefs",
  "Working Papers",
  "Research Reports",
  "Discussion Papers",
  "Book Reviews",
  "Case Studies",
];

const fallbackPublicationsData: PublicationItem[] = [
  {
    id: "pub-1",
    slug: "refugee-protection-in-a-fragmented-global-order-policy-priorities-for-2026",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    publicationDate: "August 2026",
    title:
      "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026",
    description:
      "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
    highlighted: false,
    sortOrder: 0,
    isActive: true,
  },
  {
    id: "pub-2",
    slug: "international-humanitarian-law-in-emerging-conflicts-challenges-and-modern-frameworks",
    category: "Research Papers",
    field: "Human Rights & Conflict Resolution",
    publicationDate: "August 2026",
    title:
      "International Humanitarian Law in Emerging Conflicts: Challenges and Modern Frameworks",
    description:
      "A comprehensive analysis of international humanitarian law compliance and enforcement dilemmas in non-international armed conflicts.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
    highlighted: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "pub-3",
    slug: "constitutional-transformations-and-democratic-resilience-in-comparative-perspective",
    category: "Working Papers",
    field: "Comparative Politics & Governance",
    publicationDate: "July 2026",
    title:
      "Constitutional Transformations and Democratic Resilience in Comparative Perspective",
    description:
      "Examining institutional counterbalances and constitutional judiciary performance amidst rising polarization and democratic erosion.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
    highlighted: false,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "pub-4",
    slug: "geopolitical-realignments-and-multilateral-treaties-negotiating-global-climate-action",
    category: "Research Reports",
    field: "International Environmental Law",
    publicationDate: "June 2026",
    title:
      "Geopolitical Realignments and Multilateral Treaties: Negotiating Global Climate Action",
    description:
      "A strategic policy report on multilateral treaty mechanisms, compliance incentives, and state accountability in transboundary environmental agreements.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
    highlighted: false,
    sortOrder: 3,
    isActive: true,
  },
];

interface ResearchRepositoryProps {
  data?: Partial<PageSectionData>;
}

export default function ResearchRepository({ data }: ResearchRepositoryProps) {
  const [activeFilter, setActiveFilter] = useState("All Publications");
  const [publicationsList, setPublicationsList] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const badge = data?.badge ?? "Scholarly Output";
  const title = data?.title ?? "Research Repository & Publications";
  const subtitle =
    data?.subtitle ??
    "Browse IILP's growing collection of scholarly outputs across all research areas.";
  const actionText = data?.actionText ?? "Submit Research";
  const actionUrl = data?.actionUrl ?? "/contact";

  const categories: string[] =
    Array.isArray(data?.metadata?.filterCategories) && data.metadata.filterCategories.length > 0
      ? (data.metadata.filterCategories as string[])
      : filterCategories;

  useEffect(() => {
    let isMounted = true;
    fetchPublicPublications()
      .then((items) => {
        if (isMounted) {
          if (items && items.length > 0) {
            setPublicationsList(items);
          } else {
            setPublicationsList(fallbackPublicationsData);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPublicationsList(fallbackPublicationsData);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedPublications =
    activeFilter === "All Publications"
      ? publicationsList
      : publicationsList.filter(
          (pub) => pub.category?.toLowerCase() === activeFilter.toLowerCase(),
        ).length > 0
      ? publicationsList.filter(
          (pub) => pub.category?.toLowerCase() === activeFilter.toLowerCase(),
        )
      : publicationsList;

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4 max-w-[850px]">
            {/* Pill Badge */}
            {badge && (
              <div className="w-fit border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  {badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight sm:leading-[44px]">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="font-sans text-base sm:text-lg lg:text-[20px] text-[#0a0d12]/80 leading-relaxed sm:leading-[30px]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Submit Research Button */}
          {actionText && (
            <div className="shrink-0">
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full drop-shadow-xs transition-colors duration-200 whitespace-nowrap"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>

        {/* Filter Pills Container */}
        <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-1.5 rounded-full flex flex-wrap items-center justify-center gap-1.5 w-fit mx-auto shadow-xs">
          {categories.map((cat) => {
            const isActive = activeFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#1e2939] text-white shadow-sm"
                    : "bg-white text-[#4a5565] border border-[#e5e7eb] hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 2x2 Publications Grid */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500 font-sans">Loading scholarly research...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[30px]">
            {displayedPublications.map((pub) => {
              const targetHref = pub.slug
                ? `/publications/${encodeURIComponent(pub.slug)}`
                : `/publication-details?id=${encodeURIComponent(pub.id)}`;

              return (
                <Link
                  key={pub.id}
                  href={targetHref}
                  className="flex flex-col group cursor-pointer overflow-hidden rounded-md shadow-xs transition-transform duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  {/* Photo Banner (16:9 Aspect Ratio) */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-200">
                    <Image
                      src={pub.image || "/assets/department-faculty-member.png"}
                      alt={pub.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Bottom Card Content */}
                  <div className="bg-[#e6f9ff] p-6 sm:p-8 flex flex-col gap-6 sm:gap-[32px] flex-1 justify-between">
                    <div className="flex flex-col gap-4">
                      {/* Category & Date Tag Row */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="bg-white text-[#000036] font-sans font-normal text-xs sm:text-sm px-3.5 py-1 rounded-full whitespace-nowrap">
                          {pub.category}
                        </span>
                        <span className="font-sans font-normal text-xs sm:text-sm text-[#0a0d12]">
                          {pub.field}
                        </span>
                        <span className="font-sans font-normal text-xs sm:text-sm text-[#0a0d12]">
                          · {pub.publicationDate || (pub as any).date}
                        </span>
                      </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-3">
                    <h3 className="font-serif font-bold text-xl sm:text-[24px] text-[#0a0d12] leading-snug group-hover:text-[#00698c] transition-colors">
                      {pub.title}
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-[#232f3a] leading-relaxed">
                      {pub.description}
                    </p>
                  </div>
                </div>

                {/* Author & Action Row */}
                <div className="flex items-center justify-between pt-2 border-t border-[#00698c]/10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Gradient Avatar */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shrink-0 shadow-xs bg-gradient-to-br from-[#000080] to-[#00bfff]">
                      {pub.authorInitials}
                    </div>

                    {/* Author text */}
                    <div className="flex flex-col items-start gap-1">
                      <span className="border border-[#00698c] rounded-full px-2 py-0.5 font-sans text-[11px] sm:text-xs text-[#0a0d12]">
                        {pub.authorRole}
                      </span>
                      <span className="font-serif font-bold text-sm sm:text-base text-[#0a0d12]">
                        {pub.authorName}
                      </span>
                    </div>
                  </div>

                  {/* Action Arrow Button */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      pub.highlighted
                        ? "bg-[#00bfff] text-white shadow-sm"
                        : "bg-[#f9fafb] text-gray-800 border border-[#e5e7eb] group-hover:bg-[#00bfff] group-hover:text-white"
                    }`}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    )}
  </div>
</section>
);
}
