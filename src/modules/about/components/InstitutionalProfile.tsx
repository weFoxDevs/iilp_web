import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface ProfileDetailItem {
  label: string;
  value: string;
}

const defaultProfileDetails: ProfileDetailItem[] = [
  { label: 'Established', value: '1 January 2026' },
  { label: 'Type', value: 'Independent, Non-Profit' },
  { label: 'Focus', value: 'Law, Politics & Governance' },
  { label: 'Motto', value: '"Knowledge, Justice, and Leadership for Global Change."' },
];

const defaultSubtitle =
  'The International Institute for Law and Politics (IILP) is an independent, non-profit academic, research, policy, and leadership institute committed to strengthening the discourse, learning, and practice of international law, governance, politics, human rights, forced displacement and statelessness, humanitarian affairs, peacebuilding, and sustainable development through inclusive higher education, research, training, policy dialogue, and global cooperation.';

interface InstitutionalProfileProps {
  data?: Partial<PageSectionData>;
}

// Helper to return an icon based on the detail label
function getDetailIcon(label: string) {
  const normalized = label.toLowerCase();
  if (normalized.includes('established') || normalized.includes('date') || normalized.includes('year')) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  }
  if (normalized.includes('type') || normalized.includes('status') || normalized.includes('entity')) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    );
  }
  if (normalized.includes('focus') || normalized.includes('discipline') || normalized.includes('area')) {
    return (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

export default function InstitutionalProfile({ data }: InstitutionalProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const badge = data?.badge ?? 'Who We Are';
  const title = data?.title ?? 'Institutional Profile';
  
  // Combine subtitle and bodyContent if both exist, otherwise fallback
  const rawText = useMemo(() => {
    const sub = data?.subtitle?.trim();
    const body = data?.bodyContent?.trim();
    if (sub && body && sub !== body) {
      return `${sub}\n\n${body}`;
    }
    return body || sub || defaultSubtitle;
  }, [data?.subtitle, data?.bodyContent]);

  // Break raw text into structured paragraphs for readable presentation
  const paragraphs = useMemo(() => {
    const rawParagraphs = rawText.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    if (rawParagraphs.length > 1) return rawParagraphs;

    // If it's a single giant paragraph (>450 chars), break it naturally into multi-sentence paragraphs
    if (rawParagraphs.length === 1 && rawParagraphs[0].length > 450) {
      const sentences = rawParagraphs[0].match(/[^.!?]+[.!?]+(\s+|$)/g) || [rawParagraphs[0]];
      const chunks: string[] = [];
      let currentChunk = '';

      for (const sentence of sentences) {
        if ((currentChunk + sentence).length > 360 && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
      return chunks.length > 0 ? chunks : rawParagraphs;
    }

    return rawParagraphs;
  }, [rawText]);

  // Compute clean excerpt for collapsed state
  const isLongContent = rawText.length > 280 || paragraphs.length > 1;
  const excerpt = useMemo(() => {
    if (!isLongContent) return rawText;
    const firstParagraph = paragraphs[0];
    if (firstParagraph && firstParagraph.length <= 320) {
      return firstParagraph;
    }
    const truncated = rawText.slice(0, 260);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 180 ? truncated.slice(0, lastSpace) : truncated) + '...';
  }, [rawText, isLongContent, paragraphs]);

  const actionText = data?.actionText || 'Apply for Fellowship';
  const actionUrl = data?.actionUrl || '/fellowships';

  const meta = (data?.metadata || {}) as {
    secondaryActionText?: string;
    secondaryActionUrl?: string;
    image1?: string;
    image2?: string;
    badgeIcon?: string;
    badgeText?: string;
    profileDetails?: ProfileDetailItem[];
  };

  const secondaryActionText = meta.secondaryActionText || 'Explore Governance';
  const secondaryActionUrl = meta.secondaryActionUrl || '/governance';
  const image1 = meta.image1 || '/assets/about-institutional-1.png';
  const image2 = meta.image2 || '/assets/about-institutional-2.png';
  const badgeIcon = meta.badgeIcon || '/assets/about-badge-icon.svg';
  const badgeText = meta.badgeText || '/assets/about-badge-text.png';
  const profileDetails = meta.profileDetails || defaultProfileDetails;

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-24 xl:py-28 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-[180px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-14 xl:gap-20">
        
        {/* Left Side: Overlapping Images and Stamp Badge */}
        <div className="w-full lg:w-[48%] xl:w-[45%] shrink-0 lg:sticky lg:top-28 self-start">
          <div className="relative w-full max-w-[540px] mx-auto aspect-[4/4.2] sm:aspect-[4/3.8] lg:aspect-[4/4.3]">
            {/* Background ambient decorative glow */}
            <div className="absolute -top-6 -left-6 w-64 h-64 bg-[#00bfff]/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#000080]/5 rounded-full blur-2xl pointer-events-none -z-10" />

            {/* Top-Left Main Image */}
            <div className="w-[68%] sm:w-[65%] aspect-[3/3.8] absolute left-0 top-0 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg border border-black/5 group">
              <Image
                src={image1}
                alt="IILP Academic Showcase"
                fill
                unoptimized
                sizes="(max-width: 768px) 70vw, 360px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bottom-Right Overlapping Image */}
            <div className="w-[62%] sm:w-[60%] aspect-[3/3.4] absolute right-0 bottom-0 rounded-2xl lg:rounded-3xl overflow-hidden border-4 sm:border-6 lg:border-8 border-white shadow-2xl z-10 group">
              <Image
                src={image2}
                alt="IILP Student Community"
                fill
                unoptimized
                sizes="(max-width: 768px) 65vw, 320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Circular Heritage Badge */}
            <div className="absolute right-2 sm:right-6 top-4 sm:top-8 w-[84px] sm:w-[108px] lg:w-[118px] h-[84px] sm:h-[108px] lg:h-[118px] rounded-full bg-white border-2 border-[#00698c]/25 flex items-center justify-center shadow-xl z-20 backdrop-blur-xs">
              {/* Center Wreath Icon */}
              <div className="relative w-[36px] sm:w-[50px] lg:w-[56px] h-[28px] sm:h-[40px] lg:h-[46px] z-10">
                <Image
                  src={badgeIcon}
                  alt="Heritage award icon"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* Circular Rotating Badge Text */}
              <div className="absolute inset-[-8px] sm:inset-[-12px] flex items-center justify-center animate-[spin_30s_linear_infinite] pointer-events-none">
                <Image
                  src={badgeText}
                  alt="Next-Gen Toward Education"
                  width={140}
                  height={140}
                  unoptimized
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content & Details */}
        <div className="flex-1 w-full flex flex-col gap-8 lg:gap-10">
          
          {/* Header Block */}
          <div className="flex flex-col gap-4 items-start">
            {/* Pill Tag */}
            {badge && (
              <div className="inline-flex items-center gap-2 border border-[#00698c]/30 bg-[#f0f9ff] rounded-full px-3.5 py-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff]" />
                <span className="text-xs md:text-sm font-semibold tracking-wider text-[#00506b] uppercase font-inter">
                  {badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#0a0d12] tracking-tight font-serif leading-[1.2]">
              {title}
            </h2>

            {/* Description with Interactive 'See more / See less' */}
            <div className="mt-1 w-full">
              {!isExpanded ? (
                <p className="text-[#344054] text-base md:text-lg leading-relaxed lg:leading-[30px] font-sans">
                  {excerpt}{' '}
                  {isLongContent && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="inline-flex items-center gap-1 font-semibold text-[#00698c] hover:text-[#00bfff] transition-colors cursor-pointer underline decoration-[#00bfff]/60 underline-offset-4 hover:decoration-[#00bfff] focus:outline-hidden"
                      aria-expanded={false}
                    >
                      <span>See more</span>
                      <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </p>
              ) : (
                <div className="space-y-4 animate-fadeIn">
                  {paragraphs.map((p, idx) => (
                    <p key={idx} className="text-[#344054] text-base md:text-lg leading-relaxed lg:leading-[30px] font-sans">
                      {p}
                    </p>
                  ))}
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsExpanded(false)}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#00698c] hover:text-[#00bfff] transition-colors cursor-pointer text-sm sm:text-base pt-1 focus:outline-hidden"
                      aria-expanded={true}
                    >
                      <span>See less</span>
                      <svg className="w-4 h-4 rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Key Facts / Highlight Cards in Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:gap-4 w-full">
            {profileDetails.map((item, index) => {
              const isMotto = item.label.toLowerCase().includes('motto') || item.value.length > 35;
              return (
                <div 
                  key={index}
                  className={`group bg-gradient-to-br from-[#f8fdff] to-[#e6f9ff]/70 border border-[#b9e6fe]/80 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:border-[#00bfff]/60 hover:shadow-md hover:-translate-y-0.5 ${
                    isMotto ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-white/90 border border-[#b9e6fe] flex items-center justify-center text-[#00698c] shadow-2xs group-hover:bg-[#00bfff] group-hover:text-white group-hover:border-[#00bfff] transition-colors">
                      {getDetailIcon(item.label)}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#00698c]/90 font-inter">
                      {item.label}
                    </span>
                  </div>
                  <p className={`text-[#000080] font-serif font-bold tracking-tight text-base sm:text-lg lg:text-xl leading-snug pl-0.5 ${
                    isMotto ? 'italic font-medium text-base sm:text-lg text-[#00006b]' : ''
                  }`}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center pt-2 font-sans w-full">
            {actionText && (
              <Link
                href={actionUrl}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00bfff] hover:bg-[#009fd4] text-white px-7 py-3.5 text-sm md:text-base font-semibold shadow-xs hover:shadow-md transition-all active:scale-[0.98] text-center"
              >
                <span>{actionText}</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            )}
            {secondaryActionText && (
              <Link
                href={secondaryActionUrl}
                className="inline-flex items-center justify-center rounded-full bg-white border border-[#d0d5dd] hover:bg-gray-50 text-[#344054] hover:text-[#101828] px-7 py-3.5 text-sm md:text-base font-semibold shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] text-center"
              >
                {secondaryActionText}
              </Link>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

