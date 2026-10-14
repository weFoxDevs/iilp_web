import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base shimmering skeleton box
 */
export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-md ${className}`}
      {...props}
    />
  );
}

/**
 * Hero Banner Skeleton
 */
export function HeroSkeleton({
  dark = true,
  height = 'min-h-[480px] sm:min-h-[580px] lg:h-[680px]',
}: {
  dark?: boolean;
  height?: string;
}) {
  return (
    <section
      className={`relative w-full ${height} flex flex-col items-center justify-center pt-[130px] sm:pt-[170px] pb-[90px] px-4 sm:px-6 md:px-8 overflow-hidden ${
        dark
          ? 'bg-gradient-to-b from-[#0a1128] via-[#101f42] to-[#1a2d5a]'
          : 'bg-gradient-to-b from-sky-50 via-white to-sky-50/30'
      }`}
    >
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-[900px] w-full animate-pulse">
        {/* Badge */}
        <div
          className={`h-7 w-32 rounded-full mb-6 ${
            dark ? 'bg-white/20' : 'bg-slate-200'
          }`}
        />

        {/* Title */}
        <div
          className={`h-10 sm:h-12 md:h-14 w-full max-w-xl rounded-xl mb-4 ${
            dark ? 'bg-white/25' : 'bg-slate-300'
          }`}
        />
        <div
          className={`h-8 sm:h-10 w-2/3 max-w-md rounded-xl mb-6 ${
            dark ? 'bg-white/20' : 'bg-slate-200'
          }`}
        />

        {/* Subtitle */}
        <div
          className={`h-4 sm:h-5 w-4/5 max-w-2xl rounded-md mb-2.5 ${
            dark ? 'bg-white/15' : 'bg-slate-200'
          }`}
        />
        <div
          className={`h-4 sm:h-5 w-3/5 max-w-lg rounded-md ${
            dark ? 'bg-white/15' : 'bg-slate-200'
          }`}
        />
      </div>

      {dark && (
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-b from-transparent to-white pointer-events-none" />
      )}
    </section>
  );
}

/**
 * Grid of Card Skeletons
 */
export function CardGridSkeleton({
  count = 6,
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  aspectRatio = 'aspect-[16/10]',
}: {
  count?: number;
  columns?: string;
  aspectRatio?: string;
}) {
  return (
    <div className={`grid ${columns} gap-6 sm:gap-8 w-full animate-pulse`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs"
        >
          <div className={`w-full ${aspectRatio} bg-slate-200`} />
          <div className="p-5 sm:p-6 flex flex-col gap-3">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-6 w-5/6 rounded-md bg-slate-200" />
            <div className="space-y-2 pt-1">
              <div className="h-3.5 w-full rounded bg-slate-100" />
              <div className="h-3.5 w-4/5 rounded bg-slate-100" />
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-4 w-16 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Standard Section Skeleton with Header and Content
 */
export function SectionSkeleton({
  children,
  badge = true,
  centered = false,
}: {
  children?: React.ReactNode;
  badge?: boolean;
  centered?: boolean;
}) {
  return (
    <section className="w-full py-14 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto animate-pulse">
      <div
        className={`flex flex-col ${
          centered ? 'items-center text-center' : 'items-start text-left'
        } mb-12`}
      >
        {badge && <div className="h-6 w-32 rounded-full bg-slate-200 mb-4" />}
        <div className="h-10 w-full max-w-lg rounded-xl bg-slate-200 mb-4" />
        <div className="h-4 w-full max-w-2xl rounded bg-slate-100 mb-2" />
        <div className="h-4 w-3/4 max-w-xl rounded bg-slate-100" />
      </div>
      {children}
    </section>
  );
}
