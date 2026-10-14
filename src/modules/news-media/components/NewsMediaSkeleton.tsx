import React from 'react';
import { HeroSkeleton, CardGridSkeleton, SectionSkeleton } from '@/common/components/Skeleton';

export default function NewsMediaSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* News Media Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[500px] sm:min-h-[600px] lg:h-[680px]" />

      {/* Featured Articles & Categories */}
      <SectionSkeleton badge={true}>
        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 rounded-full bg-slate-200" />
          ))}
        </div>
        <CardGridSkeleton count={6} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
      </SectionSkeleton>
    </div>
  );
}
