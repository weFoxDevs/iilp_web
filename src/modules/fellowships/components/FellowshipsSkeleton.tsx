import React from 'react';
import { HeroSkeleton, CardGridSkeleton, SectionSkeleton } from '@/common/components/Skeleton';

export default function FellowshipsSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Fellowships Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[500px] sm:min-h-[600px] lg:h-[700px]" />

      {/* Categories & Tracks Grid */}
      <SectionSkeleton badge={true} centered={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-4 animate-pulse">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-6 w-3/4 rounded-md bg-slate-200" />
              <div className="space-y-2">
                <div className="h-3.5 w-full rounded bg-slate-100" />
                <div className="h-3.5 w-5/6 rounded bg-slate-100" />
                <div className="h-3.5 w-4/6 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </SectionSkeleton>
    </div>
  );
}
