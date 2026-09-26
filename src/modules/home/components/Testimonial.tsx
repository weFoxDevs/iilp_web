import Image from 'next/image';
import { useState, useEffect } from 'react';
import { fetchSiteTestimonials } from '@/common/services/cms.service';

const defaultTestimonials = [
  {
    id: '1',
    tagline: 'Empowering Dreams, Transforming Futures.',
    quote:
      'The Business Administration curriculum at Edukate provided me with a solid foundation in strategic thinking and leadership. I feel equipped to tackle real-world challenges in my career.',
    author: 'Sophia Lee',
    role: 'BBA in Finance, Class of 2022',
    avatar: '/assets/testimonial-avatar.png',
  },
  {
    id: '2',
    tagline: 'Creative Minds, Lasting Impact.',
    quote:
      'Studying Graphic Design at Edukate enabled me to explore my creativity and develop a unique artistic voice. The collaborative environment inspired me to push my boundaries.',
    author: 'Lucas Johnson',
    role: 'BA in Graphic Design, Class of 2021',
    avatar: '/assets/lucas-johnson.png',
  },
  {
    id: '3',
    tagline: 'Innovative Solutions, Bright Horizons.',
    quote:
      'Edukate’s Engineering program taught me to approach problems analytically and creatively. I graduated with the skills needed to innovate in the tech industry.',
    author: 'Maya Patel',
    role: 'BSc in Engineering, Class of 2024',
    avatar: '/assets/maya-patel.png',
  },
  {
    id: '4',
    tagline: 'Inspired Journeys, Honest Reflections.',
    quote:
      "Edukate's Computer Science program challenged me to think critically and innovate. The hands-on projects and supportive faculty prepared me for a successful career in tech.",
    author: 'Ahmed Khan',
    role: 'BBA in Marketing, Class of 2023',
    avatar: '/assets/ahmed-khan.png',
  },
];

export function Testimonial() {
  const [items, setItems] = useState(defaultTestimonials);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function loadTestimonials() {
      const data = await fetchSiteTestimonials();
      if (data && data.length > 0) {
        setItems(
          data.map((t) => ({
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
    }
    loadTestimonials();
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const currentTestimonial = items[activeIndex] || defaultTestimonials[0];

  return (
    <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-[#160d03] rounded-2xl sm:rounded-[8px] p-6 sm:p-8 md:p-12 lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] lg:pb-[69px] relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 sm:gap-10 lg:gap-16 overflow-hidden">
          
          {/* Left Column: Heading */}
          <div className="w-full lg:w-[451px] shrink-0">
            <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] text-white tracking-[-0.72px] max-w-[451px]">
              Happy students sharing experiences
            </h2>
          </div>

          {/* Right Column: Testimonial Carousel */}
          <div className="w-full lg:w-[594px] flex flex-col relative min-h-[260px] sm:min-h-[290px] justify-between">
            
            {/* Active Testimonial Slide */}
            <div className="flex flex-col gap-4 sm:gap-[24px] w-full animate-slide-in" key={currentTestimonial.id}>
              {/* Tagline */}
              <p className="font-satoshi font-medium text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-[30.6px] text-white/70">
                {currentTestimonial.tagline}
              </p>
              
              {/* Quote */}
              <p className="font-inter font-medium text-base sm:text-xl md:text-[24px] leading-relaxed sm:leading-[1.4] md:leading-[33.6px] tracking-[-0.5px] text-white">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </p>

              {/* Author & Controls Container */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
                
                {/* Author Info */}
                <div className="flex items-center gap-[16px]">
                  <div className="relative w-[63px] h-[63px] rounded-full overflow-hidden shrink-0">
                    <Image 
                      src={currentTestimonial.avatar} 
                      alt={currentTestimonial.author} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-satoshi font-medium text-[18px] leading-[30.6px] text-white">
                      {currentTestimonial.author}
                    </p>
                    <p className="font-satoshi font-medium text-[14px] leading-[23.8px] text-white/80">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button 
                    aria-label="Previous Testimonial"
                    onClick={handlePrev}
                    className="w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
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
                    aria-label="Next Testimonial"
                    onClick={handleNext}
                    className="w-[44px] h-[44px] rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
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
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
