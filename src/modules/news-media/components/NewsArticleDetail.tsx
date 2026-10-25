import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsArticleItem } from "@/common/services/news.service";

interface NewsArticleDetailProps {
  article?: NewsArticleItem | null;
}

/**
 * Clean body content:
 * 1. Replaces non-breaking spaces (&nbsp;, \u00a0) with standard spaces.
 * 2. Deduplicates leading paragraphs if they merely repeat the article title or summary.
 */
function cleanArticleContent(
  rawContent: string,
  title?: string,
  summary?: string
): string {
  if (!rawContent) return "";

  // 1. Normalize non-breaking spaces
  let cleaned = rawContent.replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ");

  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/<[^>]*>/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  const titleNorm = norm(title || "");
  const summaryNorm = norm(summary || "");

  // Helper to test if paragraph content matches title or summary
  const matchesTitleOrSummary = (innerHtml: string) => {
    const textNorm = norm(innerHtml);
    if (!textNorm) return false;
    if (titleNorm && (textNorm === titleNorm || titleNorm.startsWith(textNorm))) {
      return true;
    }
    if (summaryNorm && (textNorm === summaryNorm || summaryNorm.startsWith(textNorm))) {
      return true;
    }
    return false;
  };

  // Strip up to 2 leading matching <p> tags
  for (let i = 0; i < 2; i++) {
    const pMatch = cleaned.match(/^\s*<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch && matchesTitleOrSummary(pMatch[1])) {
      cleaned = cleaned.slice(pMatch[0].length).trim();
    } else {
      break;
    }
  }

  return cleaned.trim();
}

export default function NewsArticleDetail({ article }: NewsArticleDetailProps) {
  const [copied, setCopied] = useState(false);

  if (!article) return null;

  const isRemoteImage =
    article.featuredImage?.startsWith("http://") ||
    article.featuredImage?.startsWith("https://");

  const cleanedContent = cleanArticleContent(
    article.content || "",
    article.title,
    article.summary
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const currentUrl =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.href)
      : "";
  const shareTitle = encodeURIComponent(article.title);

  return (
    <div className="bg-white">
      {/* 1. Sleek Editorial Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="bg-slate-50/80 border-b border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-500 font-sans">
          <Link
            href="/"
            className="hover:text-[#000080] font-medium transition-colors"
          >
            Home
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href="/news-media"
            className="hover:text-[#000080] font-medium transition-colors"
          >
            News &amp; Media
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-[#00698c] font-semibold truncate max-w-[240px] sm:max-w-md">
            {article.categoryName || "News"}
          </span>
        </div>
      </nav>

      {/* 2. Main Article Section */}
      <section className="py-10 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Main Content Column (8 cols = ~66%) */}
          <article className="lg:col-span-8 w-full min-w-0 flex flex-col gap-8">
            {/* Meta Row: Category Badge, Date, Read Time & Quick Share */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-sans font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-2xs">
                  {article.categoryName || "News"}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-sans font-medium">
                  {article.publishedDate}
                </span>
                <span className="text-slate-300 text-xs">•</span>
                <span className="text-xs sm:text-sm text-slate-500 font-sans">
                  {article.readTimeMinutes} min read
                </span>
              </div>

              {/* Quick Share Pill */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy link to article"
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border border-slate-200 text-slate-600 hover:text-[#000080] hover:border-[#000080] bg-white transition-all shadow-2xs cursor-pointer"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  {copied ? "Copied!" : "Share"}
                </button>
              </div>
            </div>

            {/* Editorial Title */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-[44px] text-[#0a1128] tracking-tight leading-[1.2] lg:leading-[1.18]">
              {article.title}
            </h1>

            {/* Executive Summary / Standfirst */}
            {article.summary && (
              <p className="font-sans font-normal text-lg sm:text-xl text-slate-700 leading-relaxed border-l-4 border-[#000080] pl-5 py-2 italic bg-slate-50/70 rounded-r-2xl border-y border-r border-slate-200/50 shadow-2xs">
                {article.summary}
              </p>
            )}

            {/* Author / Institutional Byline */}
            <div className="flex items-center justify-between flex-wrap gap-4 py-4 px-5 rounded-2xl bg-gradient-to-r from-slate-50 via-sky-50/40 to-slate-50 border border-slate-200/70 shadow-2xs">
              <div className="flex items-center gap-3.5">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xs text-white font-serif font-bold text-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)",
                  }}
                >
                  IL
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-base text-[#0a0d12]">
                    Institute for International Law &amp; Policy
                  </span>
                  <span className="text-xs text-slate-500 font-sans">
                    Official Communication · Published {article.publishedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#00698c] bg-white px-3 py-1.5 rounded-full border border-sky-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Verified Institutional Release
              </div>
            </div>

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="w-full">
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[540px] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    unoptimized={isRemoteImage}
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 850px"
                  />
                </div>
                <p className="text-xs text-slate-400 italic mt-2 text-center">
                  {article.title} — International Institute for Law and Politics
                </p>
              </div>
            )}

            {/* Dynamic Rich Body Content with Editorial Typography */}
            {cleanedContent && (
              <div
                className="news-article-prose pt-4"
                dangerouslySetInnerHTML={{ __html: cleanedContent }}
              />
            )}

            {/* Official Institutional Verification Seal Card */}
            <div className="mt-8 p-6 sm:p-8 rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50/30 to-[#e6f9ff]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#000080] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#0a1128]">
                    Official Publication of IILP
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                    The International Institute for Law and Politics advances
                    independent, rigorous scholarship and policy analysis to
                    foster international justice, human rights, and global
                    cooperation.
                  </p>
                </div>
              </div>
              <Link
                href="/about"
                className="shrink-0 text-xs sm:text-sm font-semibold text-[#000080] hover:text-[#00698c] underline underline-offset-4 transition-colors"
              >
                About Our Mandate →
              </Link>
            </div>

            {/* Social Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200">
              <span className="font-sans font-semibold text-sm text-slate-700">
                Share this statement:
              </span>
              <div className="flex items-center gap-2">
                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareTitle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-white hover:bg-black hover:border-black transition-colors"
                  aria-label="Share on X"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-colors"
                  aria-label="Share on WhatsApp"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </a>
                {/* Copy Link Button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 text-xs font-semibold rounded-full border border-slate-200 text-slate-700 hover:border-[#000080] hover:text-[#000080] transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copied ? "Link Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Navigation Cards (Previous / Next) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200">
              <Link
                href="/news-media"
                className="p-5 rounded-2xl border border-slate-200 hover:border-[#00698c] hover:bg-slate-50 transition-all flex flex-col gap-1 text-left group"
              >
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-[#00698c]">
                  ← Back to Index
                </span>
                <span className="font-serif font-bold text-base text-slate-900 group-hover:text-[#000080]">
                  All News &amp; Media Releases
                </span>
              </Link>

              {article.prev ? (
                <Link
                  href={`/news-media/${article.prev.id || article.prev.slug}`}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-[#00698c] hover:bg-slate-50 transition-all flex flex-col gap-1 text-right group"
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-[#00698c]">
                    Next Article →
                  </span>
                  <span className="font-serif font-bold text-base text-slate-900 group-hover:text-[#000080] line-clamp-1">
                    {article.prev.title}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/publications"
                  className="p-5 rounded-2xl border border-slate-200 hover:border-[#00698c] hover:bg-slate-50 transition-all flex flex-col gap-1 text-right group"
                >
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider group-hover:text-[#00698c]">
                    Explore Research →
                  </span>
                  <span className="font-serif font-bold text-base text-slate-900 group-hover:text-[#000080]">
                    IILP Policy Briefs &amp; Papers
                  </span>
                </Link>
              )}
            </div>
          </article>

          {/* Right Column: Sticky Sidebar (4 cols = ~33%) */}
          <aside className="lg:col-span-4 w-full min-w-0 flex flex-col gap-6 sticky top-24">
            {/* Widget 1: Apply to IILP */}
            <div className="bg-[#00506b] border border-[#b0ebff] rounded-2xl p-7 flex flex-col gap-5 text-white shadow-xs">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-[#8ae2ff] uppercase tracking-wider">
                  Admissions Open
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  Apply to IILP
                </h3>
                <p className="font-sans text-sm leading-relaxed text-white/90">
                  Take the next step toward advancing your legal education,
                  research, and professional journey with IILP fellowships and
                  programs.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full pt-1">
                <Link
                  href="/apply"
                  className="flex-1 bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm py-3 px-5 rounded-full text-center transition-colors whitespace-nowrap shadow-xs"
                >
                  Apply Online
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-gray-50 text-[#4a5565] border border-gray-200 font-sans font-semibold text-sm py-3 px-5 rounded-full text-center transition-colors whitespace-nowrap shadow-xs"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Widget 2: Publications & Research */}
            <div className="border border-slate-200 rounded-2xl p-7 flex flex-col gap-4 bg-white shadow-xs hover:border-[#00698c] transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Research Repository
              </div>
              <h3 className="font-serif font-bold text-xl text-[#000080]">
                Publications &amp; Working Papers
              </h3>
              <p className="font-sans text-sm leading-relaxed text-slate-600">
                Explore policy briefs, monographs, and scholarly archives
                across our five academic departments.
              </p>
              <div className="pt-2">
                <Link
                  href="/publications"
                  className="inline-block w-full bg-slate-50 hover:bg-[#00bfff] text-[#000080] hover:text-white border border-slate-200 hover:border-[#00bfff] font-sans font-semibold text-sm py-3 px-6 rounded-full text-center transition-all shadow-2xs"
                >
                  View Research Papers →
                </Link>
              </div>
            </div>

            {/* Widget 3: About IILP Overview */}
            <div className="border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 bg-slate-50/70 shadow-2xs">
              <h4 className="font-serif font-bold text-base text-[#0a1128]">
                About the Institute
              </h4>
              <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                IILP convenes leading scholars, jurists, and policy architects to
                strengthen international legal systems, human rights advocacy,
                and multilateral governance.
              </p>
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200/80">
                <Link
                  href="/governance"
                  className="text-xs font-semibold text-[#00698c] hover:underline flex items-center justify-between"
                >
                  <span>Governance &amp; Charter</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/leadership-directory"
                  className="text-xs font-semibold text-[#00698c] hover:underline flex items-center justify-between"
                >
                  <span>Leadership Directory</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/academics"
                  className="text-xs font-semibold text-[#00698c] hover:underline flex items-center justify-between"
                >
                  <span>Academic Departments</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
