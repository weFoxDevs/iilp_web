import React from 'react';
import { HeroSkeleton, SectionSkeleton } from '@/common/components/Skeleton';

export default function AboutSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* About Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[520px] sm:min-h-[620px] lg:h-[720px]" />

      {/* Founder's Message Skeleton */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="w-full max-w-[420px] aspect-[4/5] rounded-3xl bg-slate-200 mx-auto" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-6 w-36 rounded-full bg-slate-200" />
            <div className="h-10 w-4/5 rounded-xl bg-slate-200" />
            <div className="pt-4 space-y-3">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-4/6 rounded bg-slate-100" />
            </div>
            <div className="h-8 w-44 rounded-md bg-slate-200 pt-3" />
          </div>
        </div>
      </section>

      {/* Institutional Profile Skeleton */}
      <section className="w-full bg-slate-50/70 py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-6 w-32 rounded-full bg-slate-200" />
            <div className="h-9 w-3/4 rounded-xl bg-slate-200" />
            <div className="space-y-2.5">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-11/12 rounded bg-slate-100" />
              <div className="h-4 w-4/5 rounded bg-slate-100" />
            </div>
          </div>
          <div className="w-full aspect-[16/10] rounded-2xl bg-slate-200" />
        </div>
      </section>

      {/* Strategic Objectives Skeleton */}
      <SectionSkeleton badge={true} centered={true}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-100 space-y-3">
              <div className="h-8 w-8 rounded-lg bg-slate-200" />
              <div className="h-5 w-3/4 rounded bg-slate-200" />
              <div className="h-3.5 w-full rounded bg-slate-100" />
              <div className="h-3.5 w-4/5 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </SectionSkeleton>
    </div>
  );
}
