import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchPublicPublications,
  PublicationItem,
} from "@/common/services/publications.service";

const fallbackRelated: PublicationItem[] = [
  {
    id: "pub-related-1",
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
    id: "pub-related-2",
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
];

interface ReadMoreResearchProps {
  currentId?: string;
}

export default function ReadMoreResearch({ currentId }: ReadMoreResearchProps) {
  const [items, setItems] = useState<PublicationItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchPublicPublications().then((pubs) => {
      if (isMounted) {
        if (pubs && pubs.length > 0) {
          const filtered = currentId
            ? pubs.filter((p) => p.id !== currentId && p.slug !== currentId)
            : pubs;
          setItems(filtered.slice(0, 2));
        } else {
          setItems(fallbackRelated);
        }
      }
    }).catch(() => {
      if (isMounted) setItems(fallbackRelated);
    });
    return () => {
      isMounted = false;
    };
  }, [currentId]);

  const displayed = items.length > 0 ? items : fallbackRelated;

  return (
    <section className="bg-[#e6f9ff] py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4 max-w-[650px]">
            {/* Pill Badge */}
            <div className="inline-flex self-start items-center border border-[#00698c] rounded-full px-3 py-1.5">
              <span className="font-sans font-semibold text-xs sm:text-sm text-[#0a0d12] uppercase tracking-wider">
                Publications
              </span>
            </div>

            {/* Section Title */}
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
              Read more Research
            </h2>
          </div>

          {/* View All Button */}
          <div className="self-start sm:self-auto">
            <Link
              href="/publications"
              className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors whitespace-nowrap"
            >
              View All
            </Link>
          </div>
        </div>

        {/* 2-column Related Publications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-[30px]">
          {displayed.map((pub) => {
            const targetHref = pub.slug
              ? `/publications/${encodeURIComponent(pub.slug)}`
              : `/publication-details?id=${encodeURIComponent(pub.id)}`;

            return (
              <Link
                key={pub.id}
                href={targetHref}
                className="flex flex-col group cursor-pointer overflow-hidden rounded-md drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-transform duration-300 hover:-translate-y-1"
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
                <div className="bg-white p-6 sm:p-8 flex flex-col gap-6 sm:gap-[32px] rounded-b-md flex-1 justify-between">
                  <div className="flex flex-col gap-4">
                    {/* Category & Date Tag Row */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="bg-[#f0f9ff] text-[#000036] font-sans font-normal text-xs sm:text-sm px-3.5 py-1 rounded-full whitespace-nowrap border border-[#00698c]/20">
                        {pub.category}
                      </span>
                      <span className="font-sans font-normal text-xs sm:text-sm text-[#0a0d12]">
                        {pub.field}
                      </span>
                      <span className="font-sans font-normal text-xs sm:text-sm text-[#0a0d12]">
                        · {pub.publicationDate}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="flex flex-col gap-3">
                      <h3 className="font-sans font-normal text-lg sm:text-[20px] text-[#0a0d12] leading-[30px] group-hover:text-[#00698c] transition-colors">
                        {pub.title}
                      </h3>
                      <p className="font-sans text-sm sm:text-base text-[#232f3a] leading-relaxed">
                        {pub.description}
                      </p>
                    </div>
                  </div>

                  {/* Author & Action Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Gradient Avatar */}
                      <div
                        className="w-[50px] h-[50px] rounded-full flex items-center justify-center text-white font-serif font-bold text-[20px] shrink-0"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)",
                        }}
                      >
                        {pub.authorInitials || "MM"}
                      </div>

                      {/* Author text */}
                      <div className="flex flex-col items-start gap-1">
                        <span className="border border-[#00698c] rounded-full px-2 py-0.5 font-sans text-xs text-[#0a0d12]">
                          {pub.authorRole}
                        </span>
                        <span className="font-serif font-bold text-base text-[#0a0d12]">
                          {pub.authorName}
                        </span>
                      </div>
                    </div>

                    {/* Action Arrow Button */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        pub.highlighted
                          ? "bg-[#00bfff] text-white shadow-xs"
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
      </div>
    </section>
  );
}
