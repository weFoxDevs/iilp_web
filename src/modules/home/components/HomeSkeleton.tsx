import React from 'react';
import { HeroSkeleton, CardGridSkeleton, SectionSkeleton } from '@/common/components/Skeleton';

export default function HomeSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Home Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[580px] sm:min-h-[680px] lg:h-[780px]" />

      {/* Mission & Vision Section Skeleton */}
      <SectionSkeleton badge={true} centered={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-6">
          {[1, 2].map((i) => (
            <div key={i} className="p-8 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-7 w-48 rounded-md bg-slate-200" />
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100" />
                <div className="h-4 w-11/12 rounded bg-slate-100" />
                <div className="h-4 w-4/5 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </SectionSkeleton>

      {/* Academic Programs Skeleton */}
      <section className="w-full bg-slate-50/70 py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
        <div className="max-w-[1360px] mx-auto space-y-12">
          <div className="max-w-xl space-y-3">
            <div className="h-6 w-36 rounded-full bg-slate-200" />
            <div className="h-10 w-3/4 rounded-xl bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
          </div>
          <CardGridSkeleton count={3} columns="grid-cols-1 md:grid-cols-3" />
        </div>
      </section>

      {/* Events & News Skeleton */}
      <SectionSkeleton badge={true}>
        <CardGridSkeleton count={3} columns="grid-cols-1 md:grid-cols-3" />
      </SectionSkeleton>
    </div>
  );
}
