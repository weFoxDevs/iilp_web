import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";
import { NewsArticleItem } from "@/common/services/news.service";
import { useGetNewsArticlesQuery } from "@/store/api/cmsApi";

interface FilterTab {
  id: string;
  name: string;
}

const defaultFilterTabs: FilterTab[] = [
  { id: "all", name: "All" },
  { id: "news", name: "News" },
  { id: "programs", name: "Programs" },
  { id: "events", name: "Events" },
  { id: "press-releases", name: "Press Releases" },
];

interface LatestNewsMediaProps {
  badge?: string;
  title?: string;
  subtitle?: string;
  tabs?: FilterTab[];
  detailsHref?: string;
  headerLayout?: "center" | "split";
  data?: Partial<PageSectionData>;
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function LatestNewsMedia({
  badge: propBadge = "Media Center",
  title: propTitle = "Latest from IILP",
  subtitle: propSubtitle = "Latest developments from IILP and upcoming conferences, seminars, and workshops.",
  tabs = defaultFilterTabs,
  headerLayout = "center",
  data,
}: LatestNewsMediaProps) {
  const badge = data?.badge || propBadge;
  const title = data?.title || propTitle;
  const subtitle = data?.subtitle || propSubtitle;
  const [activeFilter, setActiveFilter] = useState(tabs[0]?.id || "all");

  const { data: newsData, isLoading } = useGetNewsArticlesQuery({
    category: activeFilter !== "all" ? activeFilter : undefined,
    limit: 20,
  });

  const liveArticles: NewsArticleItem[] = newsData?.items || [];

  const categoryTabs: FilterTab[] =
    newsData?.tabs && newsData.tabs.length > 0
      ? newsData.tabs.map((tabName) => ({
          id: tabName.toLowerCase().replace(/\s+/g, "-"),
          name: tabName,
        }))
      : tabs;

  const mainArticle = liveArticles.length > 0 ? liveArticles[0] : null;
  const gridArticles = liveArticles.length > 1 ? liveArticles.slice(1, 5) : [];
  const remainingArticles = liveArticles.length > 5 ? liveArticles.slice(5) : [];

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12 lg:gap-16 items-center">
        {/* Header Section */}
        {headerLayout === "split" ? (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px] items-start lg:items-end justify-between w-full">
            <div className="flex flex-col gap-4 max-w-[611px] items-start text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-1.5 sm:py-2">
                <span className="font-sans font-semibold text-xs sm:text-sm md:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif font-medium text-2xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-tight sm:tracking-[-0.72px] leading-tight lg:leading-[44px]">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
                {subtitle}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="bg-[#e6f9ff] border border-[#e6f9ff] rounded-2xl sm:rounded-full p-1.5 flex flex-wrap gap-1.5 items-center shrink-0 w-full sm:w-auto">
              {categoryTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] cursor-pointer ${
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
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-1.5 sm:py-2">
                <span className="font-sans font-semibold text-xs sm:text-sm md:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-serif font-medium text-2xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-tight sm:tracking-[-0.72px] leading-tight lg:leading-[44px]">
                {title}
              </h2>

              {/* Subtitle */}
              <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
                {subtitle}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="bg-[#e6f9ff] border border-[#e6f9ff] rounded-2xl sm:rounded-full p-1.5 flex flex-wrap gap-1.5 items-center justify-center w-full sm:w-auto">
              {categoryTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] cursor-pointer ${
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

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
            {/* Left Skeleton */}
            <div className="lg:col-span-6 flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-[4/4] sm:aspect-[4/3] lg:aspect-[1/1] rounded-2xl bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 rounded-full bg-slate-200" />
                <div className="h-4 w-28 rounded bg-slate-200" />
              </div>
              <div className="h-8 w-4/5 rounded bg-slate-200" />
              <div className="h-8 w-3/5 rounded bg-slate-200" />
            </div>

            {/* Right 2x2 Skeleton */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-3 animate-pulse">
                  <div className="w-full aspect-[4/3] rounded-xl bg-slate-200" />
                  <div className="flex items-center gap-2.5">
                    <div className="h-5 w-16 rounded-full bg-slate-200" />
                    <div className="h-3 w-20 rounded bg-slate-200" />
                  </div>
                  <div className="h-5 w-full rounded bg-slate-200" />
                  <div className="h-5 w-3/4 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        ) : !mainArticle ? (
          /* Empty state - No demo content */
          <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-3 bg-gray-50/70 rounded-2xl border border-dashed border-gray-200">
            <div className="w-12 h-12 rounded-full bg-sky-50 text-[#00698c] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8v4h-8V6Z" />
              </svg>
            </div>
            <h3 className="font-serif font-bold text-lg text-gray-800">No News Found</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              There are currently no published articles in this category.
            </p>
          </div>
        ) : (
          /* Real Articles from Database Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 w-full items-start">
            {/* Large Left Card */}
            <Link
              href={`/news-media/${mainArticle.id}`}
              className="lg:col-span-6 flex flex-col gap-4 group cursor-pointer"
            >
              <div className="relative w-full aspect-[4/4] sm:aspect-[4/3] lg:aspect-[1/1] rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={mainArticle.featuredImage || "/assets/news-students-talking.png"}
                  alt={mainArticle.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {mainArticle.categoryName || "News"}
                  </span>
                  <span className="font-sans text-sm text-[#414651]">
                    {formatDisplayDate(mainArticle.publishedDate || mainArticle.publishedAt)}
                  </span>
                </div>
                <h3 className="font-serif text-[#000080] text-2xl lg:text-[28px] font-bold leading-tight group-hover:text-primary-500 transition-colors">
                  {mainArticle.title}
                </h3>
              </div>
            </Link>

            {/* Right 2x2 Grid */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {gridArticles.map((item) => (
                <Link
                  key={item.id}
                  href={`/news-media/${item.id}`}
                  className="flex flex-col gap-3 group cursor-pointer"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={item.featuredImage || "/assets/news-small-1.png"}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-2 py-0.5 rounded-full uppercase">
                        {item.categoryName}
                      </span>
                      <span className="font-sans text-xs text-[#414651]">
                        {formatDisplayDate(item.publishedDate || item.publishedAt)}
                      </span>
                    </div>
                    <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Cards Grid if extra articles exist */}
        {!isLoading && remainingArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full pt-4">
            {remainingArticles.map((item) => (
              <Link
                key={item.id}
                href={`/news-media/${item.id}`}
                className="flex flex-col gap-3 group cursor-pointer"
              >
                <div className="relative w-full aspect-[1/1] rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.featuredImage || "/assets/news-small-1.png"}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 font-sans text-xs text-[#414651]">
                    <span>{formatDisplayDate(item.publishedDate || item.publishedAt)}</span>
                    <span>•</span>
                    <span>{item.categoryName}</span>
                  </div>
                  <h4 className="font-serif text-[#000080] text-lg font-bold leading-tight group-hover:text-primary-500 transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
