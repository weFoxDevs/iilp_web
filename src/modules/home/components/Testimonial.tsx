import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useGetSiteTestimonialsQuery } from '@/store/api/cmsApi';
import type { PageSectionData } from '@/common/services/cms.service';

export interface TestimonialSlide {
  id: string;
  tagline: string;
  quote: string;
  author: string;
  role: string;
  institution?: string;
  avatar: string;
}

interface TestimonialProps {
  data?: Partial<PageSectionData>;
}

// High-fidelity fallback testimonials matching actual database records
const FALLBACK_TESTIMONIALS: TestimonialSlide[] = [
  {
    id: 'fb-1',
    tagline: 'Diploma in International Law on the Protection of Refugee & Displaced Persons',
    quote:
      'I believe that meaningful education is measured not only by the knowledge we gain but by the positive impact we create. The IILP Diploma in International law on the Protection of Refugee and Displaced Persons has challenged me to think critically, strengthen my understanding of international law, and develop the confidence to address real-world issues. Through engaging discussions, expert guidance, and a diverse learning community, I have gained both academic knowledge and practical perspectives that will shape my future.',
    author: 'Sophia Lee',
    role: 'BBA in Finance, Class of 2022',
    institution: 'IILP Scholar',
    avatar: '/assets/testimonial-avatar.png',
  },
  {
    id: 'fb-2',
    tagline: 'Global Fellowship & Policy Innovation',
    quote:
      'Studying at IILP enabled me to explore my creativity and develop a unique voice. The collaborative environment inspired me to push my boundaries and engage deeply with contemporary human rights frameworks and international governance challenges.',
    author: 'Lucas Johnson',
    role: 'BA in Graphic Design, Class of 2021',
    institution: 'Global Fellow',
    avatar: '/assets/lucas-johnson.png',
  },
  {
    id: 'fb-3',
    tagline: 'Interdisciplinary Legal & Policy Research',
    quote:
      "IILP's programs taught me to approach complex policy problems analytically and creatively. I graduated with the interdisciplinary skills and global network needed to innovate across legal systems and humanitarian frameworks.",
    author: 'Maya Patel',
    role: 'BSc in Engineering, Class of 2024',
    institution: 'Research Associate',
    avatar: '/assets/maya-patel.png',
  },
  {
    id: 'fb-4',
    tagline: 'International Affairs & Public Leadership',
    quote:
      'The hands-on legal and policy projects and supportive faculty prepared me for a successful career in international affairs. Mentorship from distinguished jurists gave our cohort unparalleled practical perspectives.',
    author: 'Ahmed Khan',
    role: 'BBA in Marketing, Class of 2023',
    institution: 'Policy Scholar',
    avatar: '/assets/ahmed-khan.png',
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400 drop-shadow-[0_1px_3px_rgba(245,158,11,0.4)]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function cleanQuote(str: string): string {
  if (!str) return '';
  return str.trim().replace(/^["“'‘\s]+/, '').replace(/["”'’\s]+$/, '');
}

export function Testimonial({ data }: TestimonialProps = {}) {
  // RTK Query cached hook for local client-side cache & auto revalidation
  const { data: apiTestimonials } = useGetSiteTestimonialsQuery();

  const items: TestimonialSlide[] = useMemo(() => {
    if (apiTestimonials && Array.isArray(apiTestimonials) && apiTestimonials.length > 0) {
      return apiTestimonials.map((t, idx) => ({
        id: t.id || `testi-${idx}`,
        tagline: t.institution ? `${t.institution} • Student Voice` : 'Scholars & Fellows Sharing Experiences',
        quote: cleanQuote(t.quote),
        author: t.authorName,
        role: t.authorTitle,
        institution: t.institution || undefined,
        avatar: t.avatarUrl || '/assets/testimonial-avatar.png',
      }));
    }
    return FALLBACK_TESTIMONIALS;
  }, [apiTestimonials]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [avatarError, setAvatarError] = useState<Record<string, boolean>>({});

  const title = data?.title || 'Voices of Impact & Scholarship';
  const subtitle =
    data?.subtitle ||
    'Hear how our programs, fellowships, and academic initiatives have empowered scholars, jurists, and changemakers across the globe.';

  // Auto-slide every 6.5s, pause on hover
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [items.length, isPaused, activeIndex]);

  const handleNext = () => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
      setIsAnimating(false);
    }, 220);
  };

  const handlePrev = () => {
    if (isAnimating || items.length <= 1) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
      setIsAnimating(false);
    }, 220);
  };

  const handleSelect = (idx: number) => {
    if (idx === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsAnimating(false);
    }, 220);
  };

  const current = items[activeIndex] || items[0];

  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'IL';

  return (
    <section
      aria-label="Student and Scholar Testimonials"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8fafc] via-[#f1f6fa] to-[#e8f1f7] py-16 sm:py-20 lg:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 -left-20 w-[420px] h-[420px] rounded-full bg-[#00a3cc]/10 blur-[110px]" />
        <div className="absolute bottom-10 right-0 w-[480px] h-[480px] rounded-full bg-[#00506b]/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] rounded-full bg-sky-200/20 blur-[100px]" />
      </div>

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00698c]/25 bg-white/80 backdrop-blur-sm shadow-sm mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#00a3cc] animate-pulse" />
            <span className="font-inter font-semibold text-xs tracking-wider uppercase text-[#00506b]">
              Student &amp; Scholar Voices
            </span>
          </div>

          <h2 className="font-playfair font-bold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-[#0a1e2f] max-w-2xl tracking-tight">
            {title}
          </h2>

          <p className="mt-3 font-inter text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Main Testimonial Showcase Card */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#071d2e] via-[#0a273e] to-[#041320] text-white p-7 sm:p-10 lg:p-12 shadow-2xl shadow-[#004860]/25 border border-[#00a3cc]/25">
          {/* Top cyan/amber accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00bfff] via-[#00a3cc] to-amber-400" />

          {/* Decorative watermark quote icon */}
          <div
            aria-hidden="true"
            className="absolute right-8 top-6 font-serif text-[140px] lg:text-[180px] leading-none select-none text-[#00bfff]/10 pointer-events-none font-bold"
          >
            &ldquo;
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Author Portrait & Identity */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-6 lg:pb-0 lg:pr-8">
              {/* Avatar with cyan glowing ring */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-br from-[#00a3cc]/30 to-[#00506b]/40 ring-4 ring-[#00a3cc]/40 shadow-xl flex items-center justify-center font-bold text-2xl text-[#7de5ff] mb-4 shrink-0">
                {current.avatar && !avatarError[current.id] ? (
                  <Image
                    src={current.avatar}
                    alt={current.author}
                    fill
                    className="object-cover"
                    onError={() => setAvatarError((p) => ({ ...p, [current.id]: true }))}
                  />
                ) : (
                  <span>{getInitials(current.author)}</span>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-2">
                <StarRating count={5} />
                <span className="text-xs font-semibold text-amber-300">5.0</span>
              </div>

              {/* Author Name */}
              <h3 className="font-inter font-bold text-xl sm:text-2xl text-white tracking-tight">
                {current.author}
              </h3>

              {/* Role */}
              <p className="font-inter text-sm text-slate-300 mt-1 leading-snug">
                {current.role}
              </p>

              {/* Institution / Fellowship Tag */}
              {current.institution && (
                <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00a3cc]/20 text-[#7de5ff] border border-[#00a3cc]/30">
                  <svg className="w-3.5 h-3.5 text-[#00bfff]" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{current.institution}</span>
                </div>
              )}
            </div>

            {/* Right Column: Quote & Testimonial Statement */}
            <div className="lg:col-span-8 flex flex-col justify-between min-h-[220px]">
              <div>
                {/* Tagline / Program Label */}
                <p className="font-inter font-semibold text-xs uppercase tracking-wider text-[#00bfff] mb-3">
                  {current.tagline}
                </p>

                {/* Testimonial Quote */}
                <div
                  className={`transition-opacity duration-200 ${
                    isAnimating ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <p className="font-inter text-base sm:text-lg lg:text-[19px] leading-[1.8] text-slate-100/95 font-normal tracking-[-0.2px]">
                    &ldquo;{current.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Bottom Navigation & Quick-Select Row */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
                {/* Scholar Quick Selector Avatars */}
                <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
                  <span className="text-xs font-medium text-slate-400 mr-1 hidden md:inline">Scholars:</span>
                  {items.map((item, idx) => {
                    const isSelected = idx === activeIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(idx)}
                        aria-label={`View testimonial by ${item.author}`}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#00a3cc] text-white shadow-md shadow-[#00a3cc]/30 scale-105'
                            : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full overflow-hidden bg-white/20 shrink-0 relative flex items-center justify-center text-[10px] font-bold">
                          {item.avatar && !avatarError[item.id] ? (
                            <Image
                              src={item.avatar}
                              alt={item.author}
                              fill
                              className="object-cover"
                              onError={() => setAvatarError((p) => ({ ...p, [item.id]: true }))}
                            />
                          ) : (
                            getInitials(item.author)
                          )}
                        </span>
                        <span className="truncate max-w-[100px] sm:max-w-[120px]">{item.author.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Arrow Controls & Counter */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={isAnimating}
                      aria-label="Previous testimonial"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white transition-all flex items-center justify-center cursor-pointer border border-white/15 disabled:opacity-40"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isAnimating}
                      aria-label="Next testimonial"
                      className="w-10 h-10 rounded-full bg-[#00a3cc] hover:bg-[#00bfff] active:scale-95 text-white transition-all flex items-center justify-center cursor-pointer shadow-md shadow-[#00a3cc]/30 disabled:opacity-40"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
