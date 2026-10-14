import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import {
  fetchLeadershipMemberByIdOrSlug,
  fetchPublicLeadershipMembers,
  createSlugFromName,
  getLeadershipTypeConfig,
  LeadershipMemberItem,
} from '@/common/services/leadership.service';

const DEFAULT_FOUNDING_ABOUT =
  "As a member of the Board of Founding Members, contributes to the strategic direction, institutional stewardship, and foundational governance of the International Institute for Law and Politics (IILP), supporting the Institute's mission of knowledge, justice, and global change.";

const DEFAULT_VP_ABOUT =
  'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.';

const DEFAULT_FOUNDING_FUNCTIONS = [
  'Provides institutional, strategic, and organizational guidance to the Institute.',
  'Supports the Founder and Governing Council in upholding the founding mission and vision.',
  'Advises on long-term institutional development, ethics, and governance policies.',
  'Represents the Institute and fosters strategic partnerships with academic institutions globally.',
  'Participates in high-level consultative assemblies and strategic planning processes.',
];

const DEFAULT_FUNCTIONS = [
  'Assists the President in carrying out institutional responsibilities.',
  'Represents the Institute nationally and internationally.',
  'Engages with universities and organizations to build partnerships and collaboration.',
  'Supports governance and strategic planning processes.',
  'Facilitates coordination among leadership bodies and departments.',
  'Represents the Institute in official functions when delegated.',
  'Contributes to policy development and institutional decision-making.',
];

function isSectionHeading(text: string): boolean {
  if (text.length > 70) return false;
  const headingRegex =
    /^(academic background|research and scholarly interests|publications and academic contributions|institutional leadership and vision|biography|about|education|professional experience|background|selected publications|key areas of expertise|leadership and vision)/i;
  if (headingRegex.test(text.trim())) return true;
  return (
    text.length < 50 &&
    !text.endsWith('.') &&
    !text.endsWith(',') &&
    !text.includes(';')
  );
}

function cleanHeadingText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanProfileHtml(html: string): string {
  if (!html) return '';
  return html
    // Crucial: replace all non-breaking spaces with standard space so text wraps naturally across lines
    .replace(/&nbsp;/gi, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function getShortTitle(title: string): string {
  return (
    title
      .replace(/^(academic background|education)/i, 'Academic')
      .replace(/^(research and scholarly interests|research interests)/i, 'Research')
      .replace(/^(publications and academic contributions|publications)/i, 'Publications')
      .replace(/^(institutional leadership and vision|leadership and vision)/i, 'Leadership')
      .slice(0, 22)
      .trim() || 'Section'
  );
}

interface ProfileSection {
  id: string;
  title: string;
  shortTitle: string;
  htmlContent: string;
  functions?: string[];
}

function parseProfileSections(
  rawAbout: string,
  functionsList: string[]
): ProfileSection[] {
  const sections: ProfileSection[] = [];
  const text = cleanProfileHtml(rawAbout || '');
  const isHtml = /<[a-z][\s\S]*>/i.test(text);

  if (isHtml) {
    // Check for heading tags: <h1>, <h2>, <h3>, <h4>
    const headingRegex = /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const matches: { index: number; fullLength: number; title: string }[] = [];
    let m: RegExpExecArray | null;

    while ((m = headingRegex.exec(text)) !== null) {
      matches.push({
        index: m.index,
        fullLength: m[0].length,
        title: cleanHeadingText(m[2]),
      });
    }

    if (matches.length > 0) {
      // Content before first heading
      const introHtml = text.slice(0, matches[0].index).trim();
      if (introHtml) {
        sections.push({
          id: 'sec-1',
          title: 'Overview & Biography',
          shortTitle: 'Overview',
          htmlContent: cleanProfileHtml(introHtml),
        });
      }

      // Sections defined by headings
      for (let i = 0; i < matches.length; i++) {
        const currentMatch = matches[i];
        const nextIndex =
          i + 1 < matches.length ? matches[i + 1].index : text.length;
        const sectionHtml = text
          .slice(currentMatch.index + currentMatch.fullLength, nextIndex)
          .trim();

        sections.push({
          id: `sec-${sections.length + 1}`,
          title: currentMatch.title || 'Section',
          shortTitle: getShortTitle(currentMatch.title),
          htmlContent: cleanProfileHtml(sectionHtml),
        });
      }
    } else {
      // HTML without <h1>-<h4> tags (just <p> tags)
      sections.push({
        id: 'sec-1',
        title: 'Overview & Biography',
        shortTitle: 'Overview',
        htmlContent: cleanProfileHtml(text),
      });
    }
  } else {
    // Plain text input (split by newlines)
    const lines = text
      .split(/\r?\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    let currentTitle = 'Overview & Biography';
    let currentParas: string[] = [];

    for (const line of lines) {
      if (isSectionHeading(line)) {
        if (currentParas.length > 0) {
          sections.push({
            id: `sec-${sections.length + 1}`,
            title: currentTitle,
            shortTitle: getShortTitle(currentTitle),
            htmlContent: currentParas.map((p) => `<p>${p}</p>`).join(''),
          });
        }
        currentTitle = line;
        currentParas = [];
      } else {
        currentParas.push(line);
      }
    }

    if (currentParas.length > 0) {
      sections.push({
        id: `sec-${sections.length + 1}`,
        title: currentTitle,
        shortTitle: getShortTitle(currentTitle),
        htmlContent: currentParas.map((p) => `<p>${p}</p>`).join(''),
      });
    }
  }

  // If accountability functions exist, append as the final section
  if (functionsList && functionsList.length > 0) {
    sections.push({
      id: `sec-${sections.length + 1}`,
      title: 'Key Functions & Institutional Responsibilities',
      shortTitle: 'Functions',
      htmlContent: '',
      functions: functionsList,
    });
  }

  return sections;
}

export default function LeadershipDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [member, setMember] = useState<LeadershipMemberItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    let isMounted = true;
    setIsLoading(true);

    fetchLeadershipMemberByIdOrSlug(slug)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setMember(data);
        } else {
          // Fallback search across public members
          fetchPublicLeadershipMembers().then((all) => {
            if (!isMounted) return;
            const match = all.find(
              (m) =>
                createSlugFromName(m.name) === slug ||
                m.id?.toLowerCase() === slug.toLowerCase() ||
                m.name.toLowerCase().trim() === slug.toLowerCase()
            );
            if (match) setMember(match);
          });
        }
      })
      .catch((err) => {
        console.warn('[LeadershipDetailsPage] Failed to fetch member:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const initials =
    member?.initials ||
    member?.name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() ||
    'LP';

  const isFounding =
    member?.role?.toLowerCase().includes('founding') ||
    member?.role?.toLowerCase().includes('founder');

  const defaultAbout = isFounding ? DEFAULT_FOUNDING_ABOUT : DEFAULT_VP_ABOUT;
  const aboutText = member?.about?.trim() || defaultAbout;

  const fallbackFunctions = isFounding
    ? DEFAULT_FOUNDING_FUNCTIONS
    : DEFAULT_FUNCTIONS;

  const functionsList =
    Array.isArray(member?.accountabilityFunctions) &&
    member.accountabilityFunctions.length > 0
      ? member.accountabilityFunctions
      : fallbackFunctions;

  // Build structured sections for pagination / tabs supporting both Rich Text HTML & plain text
  const sections = parseProfileSections(aboutText, functionsList);

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'paged' | 'full'>('paged');

  const hasLongContent = sections.length > 1;
  const currentSection = sections[activeSectionIndex] || sections[0];

  const handleNextSection = () => {
    if (activeSectionIndex < sections.length - 1) {
      setActiveSectionIndex((prev) => prev + 1);
      const contentElem = document.getElementById('leadership-content-top');
      if (contentElem) {
        contentElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handlePrevSection = () => {
    if (activeSectionIndex > 0) {
      setActiveSectionIndex((prev) => prev - 1);
      const contentElem = document.getElementById('leadership-content-top');
      if (contentElem) {
        contentElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      <Head>
        <title>
          {member?.name
            ? `${member.name} | International Institute for Law and Politics`
            : 'Leadership Profile | International Institute for Law and Politics'}
        </title>
        <meta
          name="description"
          content={
            member?.about
              ? member.about.slice(0, 160)
              : `Profile and institutional leadership details of ${member?.name || 'IILP Leadership'}.`
          }
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans text-[#111827]">
        <Header />

        {/* Hero Section */}
        <section className="relative w-full min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-center pt-[130px] sm:pt-[160px] pb-[60px] sm:pb-[80px] px-4 sm:px-6 md:px-8 overflow-hidden isolate">
          {/* Background Image & Overlays */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/assets/about-hero-bg.png"
              alt={member?.name || 'Leadership Profile'}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Deep navy/charcoal gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/35" />
            {/* Bottom blend */}
            <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-b from-transparent to-white" />
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
              <Link href="/leadership-directory" className="hover:text-white transition-colors">
                Leadership
              </Link>
              {member?.name && (
                <>
                  <span>/</span>
                  <span className="text-white font-medium">{member.name}</span>
                </>
              )}
            </nav>

            {/* Pill Badge */}
            <div className="inline-flex items-center justify-center border border-[#e6f9ff]/80 rounded-full px-4 py-1.5 mb-3.5 backdrop-blur-md bg-black/25 shadow-xs">
              <span className="text-[#fdfdfd] text-xs sm:text-sm font-semibold uppercase tracking-wider font-inter">
                {getLeadershipTypeConfig(member?.type).badge}
              </span>
            </div>

            {/* Leader Name Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-semibold text-white tracking-tight font-serif leading-[1.2] mb-3 drop-shadow-md">
              {isLoading ? (
                <span className="inline-block w-64 h-10 bg-white/30 rounded-lg animate-pulse" />
              ) : (
                member?.name || 'Institutional Leadership Profile'
              )}
            </h1>

            {/* Designation / Role */}
            <p className="text-base sm:text-lg md:text-xl text-white/95 font-normal max-w-[850px] leading-relaxed drop-shadow font-sans">
              {isLoading ? (
                <span className="inline-block w-48 h-6 bg-white/20 rounded animate-pulse" />
              ) : (
                member?.role || 'Executive Officer & Institutional Leader'
              )}
            </p>
          </div>
        </section>

        <main className="flex-grow pt-8 sm:pt-12 pb-20 sm:pb-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 max-w-[1360px] mx-auto w-full">
          {isLoading ? (
            /* Dedicated Details Skeleton Loader */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start animate-pulse">
              <div className="lg:col-span-4 w-full max-w-[340px] mx-auto lg:mx-0">
                <div className="w-full aspect-[3/4] rounded-t-2xl sm:rounded-t-3xl bg-gray-200 overflow-hidden" />
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="h-10 w-3/4 max-w-md rounded-lg bg-gray-200" />
                <div className="h-5 w-1/2 max-w-xs rounded bg-gray-200" />
                <div className="pt-6 space-y-3">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-5/6 rounded bg-gray-100" />
                  <div className="h-4 w-4/6 rounded bg-gray-100" />
                </div>
                <div className="pt-4 space-y-3">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-11/12 rounded bg-gray-100" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ) : member ? (
            /* Member Profile Content */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left Column: Portrait Photo with rounded top + Quick Navigation (Sticky on desktop) */}
              <div className="lg:col-span-4 w-full max-w-[360px] mx-auto lg:mx-0 lg:sticky lg:top-28">
                <div className="relative w-full aspect-[3/4] rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-gray-100 shadow-md border border-gray-100">
                  {member.image && !imageError ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 40vw, 360px"
                      className="object-cover object-top"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#000080] to-[#00bfff] text-white text-5xl font-bold font-serif">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Section Quick Index (Only visible if content is long) */}
                {hasLongContent && (
                  <div className="mt-6 p-4 rounded-2xl bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] border border-gray-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 font-mono">
                        Profile Sections ({sections.length})
                      </span>
                      {viewMode === 'paged' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00698c]/10 text-[#00698c]">
                          Page {activeSectionIndex + 1}/{sections.length}
                        </span>
                      )}
                    </div>
                    <nav className="flex flex-col gap-1.5" aria-label="Profile sections">
                      {sections.map((sec, idx) => {
                        const isActive = viewMode === 'paged' && activeSectionIndex === idx;
                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => {
                              setActiveSectionIndex(idx);
                              if (viewMode !== 'paged') setViewMode('paged');
                              const contentElem = document.getElementById('leadership-content-top');
                              if (contentElem) {
                                contentElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                              isActive
                                ? 'bg-[#00698c] text-white font-semibold shadow-xs'
                                : 'text-gray-700 hover:bg-white hover:text-[#00698c]'
                            }`}
                          >
                            <span className="truncate pr-2">
                              {idx + 1}. {sec.title}
                            </span>
                            <span
                              className={`text-[10px] shrink-0 font-mono ${
                                isActive ? 'text-sky-100' : 'text-gray-400'
                              }`}
                            >
                              P.{idx + 1}
                            </span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                )}

                {/* Back to directory button */}
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    href="/governance"
                    className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#00698c] hover:text-[#00516c] transition-colors py-2 px-3 rounded-xl hover:bg-sky-50/50"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to Governance
                  </Link>
                </div>
              </div>

              {/* Right Column: Name, Role & Page/Section System */}
              <div id="leadership-content-top" className="lg:col-span-8 flex flex-col items-start scroll-mt-28 w-full min-w-0 max-w-full">
                {/* Header Row: Name & View Toggle */}
                <div className="w-full flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                  <div>
                    {/* Full Name in Uppercase Bold */}
                    <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#1f1638] uppercase tracking-tight font-serif sm:font-sans leading-tight">
                      {member.name}
                    </h1>

                    {/* Role / Designation in Uppercase */}
                    <p className="text-sm sm:text-base font-semibold text-[#00698c] uppercase tracking-wider mt-1">
                      {member.role || 'Leadership'}
                    </p>
                  </div>

                  {/* Mode Toggle Switch: Paged vs Full View (only if content is long) */}
                  {hasLongContent && (
                    <div className="inline-flex items-center p-1 rounded-xl bg-gray-100 border border-gray-200/80 self-start shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewMode('paged')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          viewMode === 'paged'
                            ? 'bg-white text-[#00698c] shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Display content divided into easy-to-read pages"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <span>Pages View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode('full')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          viewMode === 'full'
                            ? 'bg-white text-[#00698c] shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Display full profile in continuous scroll"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                        <span>Full View</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Section Content: PAGED MODE */}
                {hasLongContent && viewMode === 'paged' ? (
                  <div className="w-full mt-6 max-w-full">
                    {/* Top Section Tabs / Stepper */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none w-full max-w-full border-b border-gray-100 mb-6">
                      {sections.map((sec, idx) => {
                        const isActive = activeSectionIndex === idx;
                        return (
                          <button
                            key={sec.id}
                            type="button"
                            onClick={() => {
                              setActiveSectionIndex(idx);
                              const contentElem = document.getElementById('leadership-content-top');
                              if (contentElem) {
                                contentElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                            className={`shrink-0 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                              isActive
                                ? 'bg-[#00698c] text-white shadow-sm ring-2 ring-[#00698c]/20'
                                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#00698c] border border-gray-200'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                                isActive ? 'bg-white text-[#00698c]' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span className="whitespace-nowrap">{sec.shortTitle}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Section Content Card */}
                    <div className="w-full max-w-full bg-white rounded-2xl border border-gray-200/90 shadow-xs p-6 sm:p-8 min-h-[360px] flex flex-col justify-between transition-all overflow-hidden">
                      <div>
                        {/* Section Header with Step Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00698c] px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
                              Page {activeSectionIndex + 1} of {sections.length}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-serif tracking-tight">
                              {currentSection.title}
                            </h2>
                          </div>
                        </div>

                        {/* Section HTML Content */}
                        {currentSection.htmlContent ? (
                          <div
                            className="w-full text-base sm:text-[17px] text-[#334155] font-sans leading-[1.8] sm:leading-[1.85] break-words [word-break:break-word] [overflow-wrap:break-word] space-y-4 [&>p]:mb-4 [&>p]:leading-[1.85] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[#00698c] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>blockquote]:text-slate-600 [&>a]:text-[#00698c] [&>a]:underline [&>strong]:font-semibold [&>strong]:text-[#0f172a]"
                            dangerouslySetInnerHTML={{ __html: currentSection.htmlContent }}
                          />
                        ) : null}

                        {/* Functions / Responsibilities List */}
                        {currentSection.functions && currentSection.functions.length > 0 && (
                          <div className="space-y-3 mt-6">
                            <p className="text-sm text-gray-500 font-sans italic mb-4">
                              Mandated institutional roles and institutional accountabilities:
                            </p>
                            <ul className="space-y-3">
                              {currentSection.functions.map((fn, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="flex items-start gap-3 text-base sm:text-lg text-[#334155] p-3.5 rounded-xl bg-gray-50/70 border border-gray-100"
                                >
                                  <span className="w-2.5 h-2.5 rounded-full bg-[#00698c] mt-2 shrink-0" />
                                  <span>{fn}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Bottom Pagination Controls */}
                      <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={handlePrevSection}
                          disabled={activeSectionIndex === 0}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeSectionIndex === 0
                              ? 'text-gray-300 bg-gray-50 cursor-not-allowed border border-gray-100'
                              : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs hover:text-[#00698c] cursor-pointer'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                          <span>Previous Section</span>
                        </button>

                        {/* Page Numbers Indicator */}
                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                          {sections.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setActiveSectionIndex(idx);
                                const contentElem = document.getElementById('leadership-content-top');
                                if (contentElem) {
                                  contentElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              aria-label={`Go to section ${idx + 1}`}
                              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                                activeSectionIndex === idx
                                  ? 'bg-[#00698c] text-white shadow-xs'
                                  : 'text-gray-600 bg-white border border-gray-200/80 hover:bg-gray-50 hover:border-[#00698c]/30 hover:text-[#00698c]'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={handleNextSection}
                          disabled={activeSectionIndex === sections.length - 1}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeSectionIndex === sections.length - 1
                              ? 'text-gray-300 bg-gray-50 cursor-not-allowed border border-gray-100'
                              : 'text-white bg-[#00698c] hover:bg-[#00516c] shadow-xs cursor-pointer'
                          }`}
                        >
                          <span>Next Section</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* FULL CONTINUOUS VIEW (Fallback or when toggled to Full) */
                  <div className="w-full mt-6 space-y-8 max-w-full">
                    {sections.map((sec, idx) => (
                      <div key={sec.id} className="w-full">
                        {idx > 0 && (
                          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] font-serif pt-6 pb-2 border-b border-gray-100 mb-5">
                            {sec.title}
                          </h2>
                        )}

                        {sec.htmlContent && (
                          <div
                            className="w-full text-base sm:text-[17px] text-[#334155] font-sans leading-[1.8] sm:leading-[1.85] break-words [word-break:break-word] [overflow-wrap:break-word] space-y-4 [&>p]:mb-4 [&>p]:leading-[1.85] [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[#00698c] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-4 [&>blockquote]:text-slate-600 [&>a]:text-[#00698c] [&>a]:underline [&>strong]:font-semibold [&>strong]:text-[#0f172a]"
                            dangerouslySetInnerHTML={{ __html: sec.htmlContent }}
                          />
                        )}

                        {sec.functions && sec.functions.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-200/80 w-full">
                            <h3 className="text-lg sm:text-xl font-bold text-[#111827] mb-4 font-serif">
                              Key Functions & Institutional Responsibilities
                            </h3>
                            <ul className="space-y-2.5">
                              {sec.functions.map((fn, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-3 text-base text-[#4b5563]">
                                  <span className="w-2 h-2 rounded-full bg-[#00698c] mt-2 shrink-0" />
                                  <span>{fn}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Member Not Found */
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Member Profile Not Found</h2>
              <p className="text-gray-600 mb-6">
                The requested leadership profile could not be located.
              </p>
              <Link
                href="/governance"
                className="inline-flex items-center justify-center rounded-full bg-[#00698c] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#00516c] transition-colors"
              >
                Return to Governance
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
