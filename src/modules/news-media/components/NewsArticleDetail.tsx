import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsArticleItem } from "@/common/services/news.service";

interface NewsArticleDetailProps {
  article?: NewsArticleItem | null;
}

export default function NewsArticleDetail({ article }: NewsArticleDetailProps) {
  if (!article) return null;

  const isRemoteImage =
    article.featuredImage?.startsWith("http://") ||
    article.featuredImage?.startsWith("https://");

  return (
    <section className="bg-white py-16 lg:py-[120px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-[70px] items-start">
        {/* Left Column: Article Content (900px) */}
        <div className="w-full lg:w-[900px] lg:max-w-[900px] flex flex-col gap-10 shrink-0">
          <div className="flex flex-col gap-[28px]">
            {/* Category, Date & Read Time */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff] font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {article.categoryName || "News"}
              </span>
              <span className="font-sans text-sm text-[#414651]">
                {article.publishedDate}
              </span>
              <span className="text-sm text-gray-300">•</span>
              <span className="font-sans text-sm text-[#667085]">
                {article.readTimeMinutes} min read
              </span>
            </div>

            {/* Main Article Title */}
            <h1 className="font-serif font-medium text-2xl sm:text-3xl lg:text-[34px] text-[#12161a] tracking-[-0.02em] leading-tight lg:leading-[46px]">
              {article.title}
            </h1>

            {/* Intro / Summary Quote Box */}
            {article.summary && (
              <p className="font-sans font-normal text-base sm:text-lg text-[#3b3b3b] leading-relaxed border-l-4 border-[#000080] pl-4 italic bg-[#f9fafb] py-3.5 rounded-r-xl shadow-2xs">
                {article.summary}
              </p>
            )}

            {/* Featured Image */}
            {article.featuredImage && (
              <div className="w-full">
                <div className="relative w-full aspect-[900/540] rounded-xl overflow-hidden bg-gray-100 shadow-xs">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    unoptimized={isRemoteImage}
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 900px"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Rich Body Content */}
            {article.content && (
              <div
                className="prose prose-lg max-w-none font-sans text-[#3b3b3b] leading-[30px] [&>h2]:font-serif [&>h2]:text-2xl sm:[&>h2]:text-[26px] [&>h2]:font-bold [&>h2]:text-[#12161a] [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:font-serif [&>h3]:text-xl sm:[&>h3]:text-[22px] [&>h3]:font-bold [&>h3]:text-[#12161a] [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:mb-5 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-5 [&>blockquote]:border-l-4 [&>blockquote]:border-[#00698c] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>img]:rounded-xl [&>img]:shadow-xs [&>img]:my-6"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            )}
          </div>

          {/* Author Block */}
          <div className="flex items-center gap-4 w-full pt-6 border-t border-gray-100">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-xs text-white font-serif font-bold text-lg"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)",
              }}
            >
              IL
            </div>

            <div className="flex flex-col gap-1 items-start">
              <span className="border border-[#00698c] px-2.5 py-0.5 rounded-full font-sans text-[11px] font-semibold text-[#00698c] bg-[#e6f9ff]">
                {article.categoryName || "IILP Editorial"}
              </span>
              <p className="font-serif font-bold text-base text-[#0a0d12]">
                Institute for International Law &amp; Policy
              </p>
              <span className="text-xs text-gray-500 font-sans">
                Published on {article.publishedDate} · {article.readTimeMinutes} min read
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#000080] hover:text-[#00698c] transition-colors"
            >
              ← Back to News &amp; Media
            </Link>
            {article.prev && (
              <Link
                href={`/news/${encodeURIComponent(article.prev.slug)}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#00698c] hover:underline transition-colors"
              >
                Next Article: {article.prev.title} →
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Sidebar (440px) */}
        <div className="w-full lg:w-[440px] flex flex-col gap-8 shrink-0 sticky top-28">
          {/* Widget 1: Apply to IILP */}
          <div className="bg-[#00506b] border border-[#b0ebff] rounded-2xl p-7 flex flex-col gap-5 text-white shadow-xs">
            <div className="flex flex-col gap-3">
              <h3 className="font-serif font-bold text-xl text-white">
                Apply to IILP
              </h3>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-white/90">
                Take the next step toward advancing your legal education, research, and professional journey with IILP.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full">
              <Link
                href="/fellowships#apply"
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
          <div className="border border-[#b0ebff] rounded-2xl p-7 flex flex-col gap-5 bg-white shadow-xs">
            <div className="flex flex-col gap-3">
              <h3 className="font-serif font-bold text-xl text-[#000080]">
                Publications &amp; Research
              </h3>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-[#00506b]">
                Explore policy briefs, monographs, and scholarly archives across all five academic departments.
              </p>
            </div>
            <div>
              <Link
                href="/publications"
                className="inline-block bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm py-3 px-6 rounded-full text-center transition-colors whitespace-nowrap shadow-xs"
              >
                View Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
