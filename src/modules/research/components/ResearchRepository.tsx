import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Publication {
  id: string;
  category: string;
  field: string;
  date: string;
  title: string;
  description: string;
  authorRole: string;
  authorName: string;
  authorInitials: string;
  image: string;
  highlighted?: boolean;
}

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

const publicationsData: Publication[] = [
  {
    id: "pub-1",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    date: "August 2026",
    title:
      "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026",
    description:
      "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "pub-2",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    date: "August 2026",
    title:
      "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026",
    description:
      "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
    highlighted: true,
  },
  {
    id: "pub-3",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    date: "August 2026",
    title:
      "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026",
    description:
      "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "pub-4",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    date: "August 2026",
    title:
      "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026",
    description:
      "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.",
    authorRole: "Author",
    authorName: "IILP Team",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
  },
];

export default function ResearchRepository() {
  const [activeFilter, setActiveFilter] = useState("All Publications");

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4 max-w-[850px]">
            {/* Pill Badge */}
            <div className="w-fit border border-[#00698c] rounded-full px-3.5 py-1.5">
              <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                Scholarly Output
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight sm:leading-[44px]">
              Research Repository &amp; Publications
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg lg:text-[20px] text-[#0a0d12]/80 leading-relaxed sm:leading-[30px]">
              Browse IILP&apos;s growing collection of scholarly outputs across all
              research areas.
            </p>
          </div>

          {/* Submit Research Button */}
          <div className="shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full drop-shadow-xs transition-colors duration-200 whitespace-nowrap"
            >
              Submit Research
            </Link>
          </div>
        </div>

        {/* Filter Pills Container */}
        <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-1.5 rounded-full flex flex-wrap items-center justify-center gap-1.5 w-fit mx-auto shadow-xs">
          {filterCategories.map((cat) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[30px]">
          {publicationsData.map((pub) => (
            <Link
              key={pub.id}
              href="/publication-details"
              className="flex flex-col group cursor-pointer overflow-hidden rounded-md shadow-xs transition-transform duration-300 hover:shadow-md"
            >
              {/* Photo Banner (16:9 Aspect Ratio) */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-200">
                <Image
                  src={pub.image}
                  alt={pub.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bottom Card Content */}
              <div className="bg-[#e6f9ff] p-6 sm:p-8 flex flex-col gap-6 sm:gap-[32px]">
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
                      · {pub.date}
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
          ))}
        </div>
      </div>
    </section>
  );
}
