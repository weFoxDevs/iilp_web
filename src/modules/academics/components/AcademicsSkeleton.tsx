import React from 'react';
import { HeroSkeleton, CardGridSkeleton, SectionSkeleton } from '@/common/components/Skeleton';

export default function AcademicsSkeleton() {
  return (
    <div className="w-full bg-white">
      {/* Academics Hero Skeleton */}
      <HeroSkeleton dark={true} height="min-h-[500px] sm:min-h-[600px] lg:h-[700px]" />

      {/* Departments Grid Skeleton */}
      <SectionSkeleton badge={true} centered={true}>
        <CardGridSkeleton count={6} columns="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
      </SectionSkeleton>

      {/* Degree & Certification Programs Skeleton */}
      <section className="w-full bg-slate-50/70 py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 animate-pulse">
        <div className="max-w-[1360px] mx-auto space-y-10">
          <div className="max-w-xl space-y-3">
            <div className="h-6 w-32 rounded-full bg-slate-200" />
            <div className="h-10 w-3/4 rounded-xl bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-100" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 space-y-4">
                <div className="h-6 w-28 rounded-full bg-slate-200" />
                <div className="h-8 w-4/5 rounded-lg bg-slate-200" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-5/6 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
