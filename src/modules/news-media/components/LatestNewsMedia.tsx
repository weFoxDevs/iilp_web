import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FilterTab {
  id: string;
  name: string;
}

interface FilterTab {
  id: string;
  name: string;
}

const defaultFilterTabs: FilterTab[] = [
  { id: "all", name: "All" },
  { id: "news", name: "News" },
  { id: "press", name: "Press Releases" },
  { id: "articles", name: "Articles" },
  { id: "opinion", name: "Opinion Pieces" },
  { id: "interviews", name: "Interviews" },
  { id: "videos", name: "Videos" },
  { id: "newsletter", name: "Newsletter Archive" },
];

interface LatestNewsMediaProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  tabs?: FilterTab[];
  detailsHref?: string;
  headerLayout?: "center" | "split";
}

export default function LatestNewsMedia({
  badge = "Media Center",
  title = "Latest from IILP",
  subtitle = "Latest developments from IILP and upcoming conferences, seminars, and workshops.",
  tabs = defaultFilterTabs,
  detailsHref = "/news-details",
  headerLayout = "center",
}: LatestNewsMediaProps) {
  const [activeFilter, setActiveFilter] = useState(tabs[0]?.id || "all");

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px] items-center">
        {/* Header Section */}
        {headerLayout === "split" ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px] items-start lg:items-end justify-between w-full">
            <div className="flex flex-col gap-4 max-w-[611px] items-start text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
                {subtitle}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="bg-[#e6f9ff] border border-[#e6f9ff] rounded-full p-1 flex flex-wrap gap-1 items-center shrink-0">
              {tabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2.5 rounded-full font-sans font-semibold text-sm transition-all drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] cursor-pointer ${
                      isActive
                        ? "bg-[#1e2939] text-white"
                        : "bg-white text-[#4a5565] border border-[#e5e7eb] hover:text-[#101828] hover:bg-gray-50"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
              {/* Pill Badge */}
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
                {subtitle}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="bg-[#e6f9ff] border border-[#e6f9ff] rounded-full p-1 flex flex-wrap gap-1 items-center justify-center">
              {tabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2.5 rounded-full font-sans font-semibold text-sm transition-all drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] cursor-pointer ${
                      isActive
                        ? "bg-[#1e2939] text-white"
                        : "bg-white text-[#4a5565] border border-[#e5e7eb] hover:text-[#101828] hover:bg-gray-50"
                    }`}
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Featured News Grid (Large Left + 2x2 Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
          {/* Large Left Card */}
          <Link
            href={detailsHref}
            className="lg:col-span-6 flex flex-col gap-4 group cursor-pointer"
          >
            <div className="relative w-full aspect-[4/4] sm:aspect-[4/3] lg:aspect-[1/1] rounded-2xl overflow-hidden bg-gray-100">
              <Image
                src="/assets/news-students-talking.png"
                alt="Technological Advancements"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                  News
                </span>
                <span className="font-sans text-sm text-[#414651]">
                  May 20, 2025
                </span>
              </div>
              <h3 className="font-serif text-[#000080] text-2xl lg:text-[28px] font-bold leading-tight group-hover:text-primary-500 transition-colors">
                Technological Advancements
              </h3>
            </div>
          </Link>

          {/* Right 2x2 Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {/* Card 1 */}
            <Link
              href={detailsHref}
              className="flex flex-col gap-3 group cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/assets/news-student-books.png"
                  alt="Technological Advancements"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2 py-0.5 rounded-full uppercase">
                    News
                  </span>
                  <span className="font-sans text-xs text-[#414651]">
                    May 20, 2025
                  </span>
                </div>
                <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors">
                  Technological Advancements
                </h4>
              </div>
            </Link>

            {/* Card 2 (Video Play Icon) */}
            <Link
              href={detailsHref}
              className="flex flex-col gap-3 group cursor-pointer relative"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/assets/news-students-couple.png"
                  alt="Technological Advancements"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="#000080"
                      className="ml-1"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2 py-0.5 rounded-full uppercase">
                    News
                  </span>
                  <span className="font-sans text-xs text-[#414651]">
                    May 20, 2025
                  </span>
                </div>
                <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors">
                  Technological Advancements
                </h4>
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              href={detailsHref}
              className="flex flex-col gap-3 group cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/assets/news-students-city.png"
                  alt="Technological Advancements"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2 py-0.5 rounded-full uppercase">
                    News
                  </span>
                  <span className="font-sans text-xs text-[#414651]">
                    May 20, 2025
                  </span>
                </div>
                <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors">
                  Technological Advancements
                </h4>
              </div>
            </Link>

            {/* Card 4 */}
            <Link
              href={detailsHref}
              className="flex flex-col gap-3 group cursor-pointer"
            >
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/assets/news-lab-researchers.png"
                  alt="Technological Advancements"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2 py-0.5 rounded-full uppercase">
                    News
                  </span>
                  <span className="font-sans text-xs text-[#414651]">
                    May 20, 2025
                  </span>
                </div>
                <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors">
                  Technological Advancements
                </h4>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom 8 Cards Grid (2 rows of 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full pt-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Link
              key={index}
              href="/publication-details"
              className="flex flex-col gap-3 group cursor-pointer"
            >
              <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/assets/news-students-talking.png"
                  alt="Technological Advancements"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-sans text-xs text-[#414651]">
                  <span>May 20, 2025</span>
                  <span>•</span>
                  <span>Solar Energy</span>
                </div>
                <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors">
                  Technological Advancements
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
