import React from 'react';
import { HeroSkeleton, CardGridSkeleton, SectionSkeleton } from './Skeleton';

/**
 * Skeleton loader for News Details Page
 */
export function NewsDetailsSkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="bg-slate-50 border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <div className="h-4 w-12 rounded bg-slate-200" />
          <span className="text-slate-300">/</span>
          <div className="h-4 w-24 rounded bg-slate-200" />
          <span className="text-slate-300">/</span>
          <div className="h-4 w-32 rounded bg-slate-200" />
        </div>
      </div>

      {/* Main Layout Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-24 rounded-full bg-sky-100" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-200" />
          </div>
          <div className="h-10 sm:h-12 w-4/5 rounded-xl bg-slate-200" />
          <div className="h-20 w-full rounded-2xl bg-slate-100 border-l-4 border-slate-300" />
          <div className="h-14 w-full rounded-2xl bg-slate-100" />
          <div className="w-full aspect-[16/9] rounded-2xl bg-slate-200" />
          <div className="space-y-4 pt-4">
            <div className="h-5 w-full rounded bg-slate-100" />
            <div className="h-5 w-11/12 rounded bg-slate-100" />
            <div className="h-5 w-full rounded bg-slate-100" />
            <div className="h-5 w-4/5 rounded bg-slate-100" />
            <div className="h-5 w-full rounded bg-slate-100" />
          </div>
        </div>

        {/* Right Sidebar Skeleton (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="h-64 rounded-2xl bg-slate-100" />
          <div className="h-48 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for Event Details Page
 */
export function EventDetailsSkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Event Hero Skeleton */}
      <section className="relative w-full min-h-[460px] sm:min-h-[540px] flex flex-col justify-end pb-12 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-[#0a1128] via-[#101f42] to-[#1a2d5a]">
        <div className="max-w-[1000px] mx-auto w-full space-y-4">
          <div className="h-6 w-28 rounded-full bg-white/20" />
          <div className="h-10 sm:h-12 w-4/5 rounded-xl bg-white/25" />
          <div className="flex flex-wrap gap-4 pt-2">
            <div className="h-4 w-36 rounded bg-white/15" />
            <div className="h-4 w-32 rounded bg-white/15" />
          </div>
        </div>
      </section>

      {/* Event Content & Sidebar Skeleton */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-5">
          <div className="h-64 rounded-2xl bg-slate-200" />
          <div className="h-5 w-full rounded bg-slate-200" />
          <div className="h-5 w-11/12 rounded bg-slate-200" />
          <div className="h-5 w-4/5 rounded bg-slate-200" />
        </div>
        <div className="lg:col-span-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/70 space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-3/4 rounded bg-slate-100" />
          <div className="h-11 w-full rounded-full bg-slate-300 mt-6" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for Publication Details Page
 */
export function PublicationDetailsSkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Publication Hero Skeleton */}
      <section className="relative w-full min-h-[460px] sm:min-h-[540px] flex flex-col justify-end pb-12 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-[#0a1128] via-[#101f42] to-[#1a2d5a]">
        <div className="max-w-[1000px] mx-auto w-full space-y-4">
          <div className="h-6 w-36 rounded-full bg-white/20" />
          <div className="h-10 sm:h-12 w-4/5 rounded-xl bg-white/25" />
          <div className="flex gap-4 pt-2">
            <div className="h-4 w-40 rounded bg-white/15" />
            <div className="h-4 w-32 rounded bg-white/15" />
          </div>
        </div>
      </section>

      {/* Abstract & Content Skeleton */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-5">
        <div className="h-7 w-36 rounded-md bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-11/12 rounded bg-slate-100" />
        <div className="h-4 w-4/5 rounded bg-slate-100" />
        <div className="pt-6 space-y-3">
          <div className="h-7 w-48 rounded-md bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-full rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton loader for Department Details Page
 */
export function DepartmentDetailsSkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Department Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[460px] sm:min-h-[540px] lg:h-[620px]" />

      {/* Department Overview Skeleton */}
      <SectionSkeleton badge={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="space-y-4">
            <div className="h-8 w-3/4 rounded-lg bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
            <div className="h-4 w-11/12 rounded bg-slate-100" />
            <div className="h-4 w-4/5 rounded bg-slate-100" />
          </div>
          <div className="w-full aspect-[4/3] rounded-2xl bg-slate-200" />
        </div>
      </SectionSkeleton>
    </div>
  );
}

/**
 * General Purpose Page Skeleton for simpler pages (Careers, Donate, Contact, Partnership)
 */
export function GenericPageSkeleton({
  title = 'Loading Page...',
}: {
  title?: string;
}) {
  return (
    <div className="w-full bg-white animate-pulse">
      <HeroSkeleton dark={true} height="min-h-[460px] sm:min-h-[540px] lg:h-[620px]" />

      <SectionSkeleton badge={true} centered={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-4/5 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </SectionSkeleton>
    </div>
  );
}
