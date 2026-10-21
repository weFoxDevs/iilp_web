import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchSiteTestimonials, PageSectionData } from '@/common/services/cms.service';

export interface TestimonialSlide {
  id: string;
  tagline: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

interface TestimonialProps {
  data?: Partial<PageSectionData>;
}

export function Testimonial({ data }: TestimonialProps = {}) {
  const [items, setItems] = useState<TestimonialSlide[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [avatarError, setAvatarError] = useState<Record<string, boolean>>({});

  const title = data?.title || 'Happy students sharing experiences';

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    fetchSiteTestimonials()
      .then((apiItems) => {
        if (!active) return;
        if (Array.isArray(apiItems) && apiItems.length > 0) {
          setItems(
            apiItems.map((t) => ({
              id: t.id,
              tagline: 'Scholars & Fellows Sharing Experiences',
              quote: t.quote,
              author: t.authorName,
              role: t.institution
                ? `${t.authorTitle} • ${t.institution}`
                : t.authorTitle,
              avatar: t.avatarUrl || '/assets/testimonial-avatar.png',
            }))
          );
        }
      })
      .catch((err) => {
        console.warn('[Testimonial] Failed to fetch testimonials from database:', err);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Auto-slider timer with pause-on-hover
  useEffect(() => {
    if (isLoading || items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length, isLoading, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  // Shimmering dark skeleton while fetching from database
  if (isLoading) {
    return (
      <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="bg-[#160d03] rounded-2xl sm:rounded-[8px] p-6 sm:p-8 md:p-12 lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] lg:pb-[69px] relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 sm:gap-10 lg:gap-16 overflow-hidden animate-pulse">
            <div className="w-full lg:w-[451px] shrink-0 space-y-4">
              <div className="h-10 w-3/4 bg-white/20 rounded-lg" />
              <div className="h-10 w-1/2 bg-white/20 rounded-lg" />
            </div>
            <div className="w-full lg:w-[594px] space-y-4">
              <div className="h-4 w-40 bg-white/15 rounded" />
              <div className="h-7 w-full bg-white/25 rounded" />
              <div className="h-7 w-5/6 bg-white/25 rounded" />
              <div className="flex items-center gap-4 pt-4">
                <div className="w-[63px] h-[63px] rounded-full bg-white/20 shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-white/20 rounded" />
                  <div className="h-3 w-48 bg-white/15 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const current = items[activeIndex] || items[0];
  const initials =
    current.author
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'IL';

  return (
    <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto">
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="bg-[#160d03] rounded-2xl sm:rounded-[8px] p-6 sm:p-8 md:p-12 lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] lg:pb-[69px] relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 sm:gap-10 lg:gap-16 overflow-hidden transition-all duration-300"
        >
          {/* Left Column: Heading */}
          <div className="w-full lg:w-[451px] shrink-0">
            <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] text-white tracking-[-0.72px] max-w-[451px]">
              {title}
            </h2>
          </div>

          {/* Right Column: Testimonial Carousel */}
          <div className="w-full lg:w-[594px] flex flex-col relative min-h-[260px] sm:min-h-[290px] justify-between">
            {/* Active Testimonial Slide */}
            <div
              className="flex flex-col gap-4 sm:gap-[24px] w-full transition-opacity duration-300"
              key={current.id}
            >
              {/* Tagline */}
              <p className="font-satoshi font-medium text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-[30.6px] text-white/70">
                {current.tagline}
              </p>

              {/* Quote */}
              <p className="font-inter font-medium text-base sm:text-xl md:text-[24px] leading-relaxed sm:leading-[1.4] md:leading-[33.6px] tracking-[-0.5px] text-white">
                &ldquo;{current.quote}&rdquo;
              </p>

              {/* Author & Controls Container */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                {/* Author Info */}
                <div className="flex items-center gap-[16px]">
                  <div className="relative w-[63px] h-[63px] rounded-full overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                    {current.avatar && !avatarError[current.id] ? (
                      <Image
                        src={current.avatar}
                        alt={current.author}
                        fill
                        className="object-cover"
                        onError={() =>
                          setAvatarError((prev) => ({ ...prev, [current.id]: true }))
                        }
                      />
                    ) : (
                      <span className="text-xl font-bold text-white font-serif">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className="font-satoshi font-medium text-[18px] leading-[30.6px] text-white">
                      {current.author}
                    </p>
                    <p className="font-satoshi font-medium text-[14px] leading-[23.8px] text-white/80">
                      {current.role}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Previous Testimonial"
                    onClick={handlePrev}
                    className="w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Image
                      src="/assets/testimonial-back-arrow.svg"
                      alt="Previous"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                  <button
                    type="button"
                    aria-label="Next Testimonial"
                    onClick={handleNext}
                    className="w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Image
                      src="/assets/testimonial-next-arrow.svg"
                      alt="Next"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* Slider Dots Indicator */}
              {items.length > 1 && (
                <div className="flex items-center gap-2 pt-2">
                  {items.map((it, idx) => (
                    <button
                      key={it.id || idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeIndex === idx
                          ? 'w-7 bg-[#00bfff]'
                          : 'w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
