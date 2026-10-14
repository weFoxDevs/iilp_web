import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import {
  fetchPublicLeadershipMembers,
  createSlugFromName,
  getLeadershipTypeConfig,
  LeadershipMemberItem,
  LEADERSHIP_TYPES,
} from '@/common/services/leadership.service';
import { HeroSkeleton, CardGridSkeleton } from '@/common/components/Skeleton';

export default function GovernanceTierPage() {
  const router = useRouter();
  const { slug } = router.query;

  const tierSlug = typeof slug === 'string' ? slug : 'founding-members';
  const tierConfig = getLeadershipTypeConfig(tierSlug);

  const [members, setMembers] = useState<LeadershipMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady || !slug) return;

    let active = true;
    setIsLoading(true);

    fetchPublicLeadershipMembers(tierSlug)
      .then((data) => {
        if (!active) return;
        setMembers(data);
      })
      .catch((err) => {
        console.warn(`[GovernanceTier] Failed to fetch members for ${tierSlug}:`, err);
        setMembers([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router.isReady, slug, tierSlug]);

  const bgImage = tierConfig.bgImage || '/assets/about-hero-bg.png';

  return (
    <>
      <Head>
        <title>{`${tierConfig.title} | Governance | International Institute for Law and Politics`}</title>
        <meta
          name="description"
          content={`${tierConfig.title} — ${tierConfig.subtitle}. ${tierConfig.detailedCharter.slice(0, 160)}`}
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans text-[#111827]">
        <Header />

        {/* Hero Section */}
        <section className="relative w-full min-h-[420px] sm:min-h-[500px] lg:min-h-[540px] flex flex-col items-center justify-center pt-[130px] sm:pt-[160px] pb-[70px] sm:pb-[90px] px-4 sm:px-6 md:px-8 overflow-hidden isolate">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src={bgImage}
              alt={tierConfig.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Deep navy/charcoal gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/35" />
            {/* Soft bottom blend to page background */}
            <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-b from-transparent to-white" />
          </div>

          {/* Hero Content */}
          <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-[1040px]">
            {/* Breadcrumb Navigation in Hero */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-sky-200/90 mb-4 font-sans flex-wrap justify-center">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/governance" className="hover:text-white transition-colors">
                Governance
              </Link>
              <span>/</span>
              <span className="text-white font-medium">{tierConfig.title}</span>
            </nav>

            {/* Pill Badge */}
            {tierConfig.badge && (
              <div className="inline-flex items-center justify-center border border-[#e6f9ff]/80 rounded-full px-4 py-1.5 mb-4 backdrop-blur-md bg-black/25 shadow-xs">
                <span className="text-[#fdfdfd] text-xs sm:text-sm font-semibold uppercase tracking-wider font-inter">
                  {tierConfig.badge}
                </span>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-semibold text-white tracking-tight font-serif leading-[1.2] mb-4 drop-shadow-md">
              {tierConfig.title}
            </h1>

            {/* Subtitle / Mission */}
            {tierConfig.subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-white/95 font-normal max-w-[850px] leading-relaxed drop-shadow font-sans">
                {tierConfig.subtitle}
              </p>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-grow pt-6 sm:pt-10 pb-20 sm:pb-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto w-full">
          {/* Institutional Mandate & Charter Card */}
          <div className="bg-[#f8fbfd] border border-[#d6ecf7] rounded-2xl p-6 sm:p-10 mb-14 sm:mb-16 shadow-xs">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00698c] mb-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-[#00698c]" />
                Institutional Charter & Governance Mandate
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-3">
                Mandate of the {tierConfig.title}
              </h2>
              <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-sans">
                {tierConfig.detailedCharter}
              </p>
            </div>
          </div>

          {/* Members Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs font-bold text-[#00698c] uppercase tracking-wider font-mono">
                  Directory
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                  {tierConfig.title} Members
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                {isLoading ? 'Loading members...' : `${members.length} Active Member${members.length === 1 ? '' : 's'}`}
              </p>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="py-6">
                <CardGridSkeleton count={4} columns="grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
              </div>
            ) : members.length > 0 ? (
              /* 4-Column Portrait Cards matching UoPeople reference */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
                {members.map((member) => {
                  const slugName = createSlugFromName(member.name);
                  const memberHref = `/leadership/${slugName}`;

                  return (
                    <Link
                      key={member.id}
                      href={memberHref}
                      className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-hidden focus:ring-2 focus:ring-[#00698c] focus:ring-offset-2 rounded-t-2xl sm:rounded-t-3xl"
                    >
                      {/* Portrait Card */}
                      <div className="relative w-full aspect-[3/4] rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#002147] to-[#00506b] text-white text-3xl font-bold font-serif">
                            {member.initials || 'LP'}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>

                      {/* Name & Role */}
                      <div className="mt-4 flex flex-col items-center px-2 w-full">
                        <h4 className="text-base sm:text-[17px] font-bold text-gray-900 group-hover:text-[#00698c] transition-colors leading-snug">
                          {member.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-tight">
                          {member.role}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty state if no member is yet assigned to this specific tier */
              <div className="p-12 sm:p-16 text-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl max-w-2xl mx-auto my-8">
                <div className="w-16 h-16 rounded-full bg-sky-100 text-[#00698c] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  Roster Currently Being Convened
                </h4>
                <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
                  The appointment of distinguished fellows and council members for the {tierConfig.title} is currently underway under the direction of the Founding Authority.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/governance"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-[#00698c] hover:bg-[#00506b] text-white text-xs sm:text-sm font-semibold rounded-full transition-colors"
                  >
                    Explore Governance Structure
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-full transition-colors"
                  >
                    Contact Secretariat
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick links to other Governance Tiers */}
          <div className="mt-20 pt-10 border-t border-gray-200">
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 font-mono">
              Other Governance Bodies & Directorates
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {LEADERSHIP_TYPES.filter((t) => t.id !== tierSlug).map((other) => (
                <Link
                  key={other.id}
                  href={`/governance/${other.id}`}
                  className="p-3 bg-gray-50 hover:bg-[#e6f9ff] border border-gray-200 hover:border-[#00bfff]/60 rounded-xl transition-all text-xs font-semibold text-gray-800 hover:text-[#000080]"
                >
                  {other.title} →
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
