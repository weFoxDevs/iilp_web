import React from 'react';

export default function GovernanceSkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Hero Section Skeleton */}
      <section className="relative w-full min-h-[480px] sm:min-h-[580px] lg:h-[750px] flex flex-col items-center justify-center pt-[130px] sm:pt-[170px] lg:pt-[220px] pb-[90px] sm:pb-[130px] lg:pb-[200px] px-4 sm:px-6 md:px-8 bg-gradient-to-b from-[#0a1128] via-[#101f42] to-[#1a2d5a] overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-[1000px] w-full">
          {/* Badge Skeleton */}
          <div className="h-7 w-36 rounded-full bg-white/20 mb-6" />

          {/* Title Skeleton */}
          <div className="h-10 sm:h-12 md:h-14 w-full max-w-2xl rounded-xl bg-white/25 mb-4" />
          <div className="h-8 sm:h-10 w-2/3 max-w-lg rounded-xl bg-white/20 mb-6" />

          {/* Subtitle Skeleton */}
          <div className="h-4 sm:h-5 w-4/5 max-w-3xl rounded-md bg-white/15 mb-2.5" />
          <div className="h-4 sm:h-5 w-3/5 max-w-2xl rounded-md bg-white/15" />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-[140px] bg-gradient-to-b from-transparent to-white pointer-events-none" />
      </section>

      {/* Leadership Structure Intro Skeleton */}
      <section className="w-full py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="h-7 w-44 rounded-full bg-gray-200 mb-4" />
          <div className="h-10 w-full max-w-xl rounded-lg bg-gray-200 mb-4" />
          <div className="h-4 w-full max-w-2xl rounded bg-gray-100 mb-2" />
          <div className="h-4 w-3/4 max-w-lg rounded bg-gray-100" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/70 flex flex-col gap-4">
              <div className="h-10 w-10 rounded-xl bg-gray-200" />
              <div className="h-6 w-3/4 rounded-md bg-gray-200" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-gray-100" />
                <div className="h-3.5 w-5/6 rounded bg-gray-100" />
                <div className="h-3.5 w-4/6 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Founding Authority Skeleton */}
      <section className="w-full bg-[#f8fafc] py-14 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-36 rounded-full bg-gray-200" />
            <div className="h-9 w-3/4 rounded-lg bg-gray-200" />
            <div className="space-y-2.5 pt-2">
              <div className="h-4 w-full rounded bg-gray-200/80" />
              <div className="h-4 w-11/12 rounded bg-gray-200/80" />
              <div className="h-4 w-4/5 rounded bg-gray-200/80" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200" />
          </div>
        </div>
      </section>

      {/* Board of Founding Members Skeleton (Matches the 4-column portrait layout) */}
      <section className="w-full py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 bg-white">
        <div className="max-w-[1360px] mx-auto">
          {/* Header Skeleton */}
          <div className="max-w-4xl mb-10 sm:mb-14">
            <div className="h-10 sm:h-11 w-80 max-w-full rounded-lg bg-gray-200 mb-4" />
            <div className="space-y-2 max-w-3xl">
              <div className="h-4 w-full rounded bg-gray-100" />
              <div className="h-4 w-5/6 rounded bg-gray-100" />
              <div className="h-4 w-2/3 rounded bg-gray-100" />
            </div>
          </div>

          {/* 4-Column Portrait Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center">
                {/* Portrait Image Placeholder */}
                <div className="w-full aspect-[3/4] rounded-t-2xl bg-gray-200 overflow-hidden" />
                {/* Name Placeholder */}
                <div className="h-5 w-3/4 rounded bg-gray-200 mt-4" />
                {/* Role Placeholder */}
                <div className="h-4 w-1/2 rounded bg-gray-100 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governing Council Skeleton */}
      <section className="w-full bg-[#f8fafc] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-[1360px] mx-auto space-y-12">
          <div className="max-w-3xl">
            <div className="h-6 w-44 rounded-full bg-gray-200 mb-3" />
            <div className="h-9 w-72 rounded-lg bg-gray-200 mb-3" />
            <div className="h-4 w-full rounded bg-gray-200/70" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <div className="w-full aspect-[4/5] rounded-2xl bg-gray-200" />
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white border border-gray-100 flex items-start gap-3">
                  <div className="h-7 w-7 rounded-lg bg-gray-200 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-full rounded bg-gray-100" />
                    <div className="h-3.5 w-4/5 rounded bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Other Council & Boards Skeleton */}
      <section className="w-full py-14 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((i) => (
            <div key={i} className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4">
              <div className="h-6 w-36 rounded-full bg-gray-200" />
              <div className="h-8 w-2/3 rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-gray-100" />
                <div className="h-4 w-5/6 rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
