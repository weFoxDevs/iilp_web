import React from 'react';
import { HeroSkeleton, SectionSkeleton } from '@/common/components/Skeleton';

export default function LeadershipDirectorySkeleton() {
  return (
    <div className="w-full bg-white animate-pulse">
      {/* Leadership Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[500px] sm:min-h-[600px] lg:h-[680px]" />

      {/* 12-Member Grid Skeleton */}
      <section className="w-full py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto">
        <div className="flex flex-col items-start text-left mb-12 space-y-3">
          <div className="h-6 w-28 rounded-full bg-slate-200" />
          <div className="h-10 w-full max-w-md rounded-xl bg-slate-200" />
          <div className="h-4 w-full max-w-xl rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-start w-full">
              <div className="w-full aspect-[277.5/370] rounded-sm bg-slate-200" />
              <div className="mt-4 w-full space-y-2">
                <div className="h-6 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Team Banner Skeleton */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 pb-20">
        <div className="h-48 sm:h-56 rounded-3xl bg-slate-200" />
      </div>
    </div>
  );
}
