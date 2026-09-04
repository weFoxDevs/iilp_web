import Image from 'next/image';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    tagline: "Empowering Dreams, Transforming Futures.",
    quote: "The Business Administration curriculum at Edukate provided me with a solid foundation in strategic thinking and leadership. I feel equipped to tackle real-world challenges in my career.",
    author: "Sophia Lee",
    role: "BBA in Finance, Class of 2022",
    avatar: "/assets/testimonial-avatar.png"
  },
  {
    id: 2,
    tagline: "Creative Minds, Lasting Impact.",
    quote: "Studying Graphic Design at Edukate enabled me to explore my creativity and develop a unique artistic voice. The collaborative environment inspired me to push my boundaries.",
    author: "Lucas Johnson",
    role: "BA in Graphic Design, Class of 2021",
    avatar: "/assets/lucas-johnson.png"
  },
  {
    id: 3,
    tagline: "Innovative Solutions, Bright Horizons.",
    quote: "Edukate’s Engineering program taught me to approach problems analytically and creatively. I graduated with the skills needed to innovate in the tech industry.",
    author: "Maya Patel",
    role: "BSc in Engineering, Class of 2024",
    avatar: "/assets/maya-patel.png"
  },
  {
    id: 4,
    tagline: "Inspired Journeys, Honest Reflections.",
    quote: "Edukate's Computer Science program challenged me to think critically and innovate. The hands-on projects and supportive faculty prepared me for a successful career in tech.",
    author: "Ahmed Khan",
    role: "BBA in Marketing, Class of 2023",
    avatar: "/assets/ahmed-khan.png"
  }
];

export function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const currentTestimonial = testimonials[activeIndex];

  return (
    <section className="bg-white py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-[#160D03] rounded-[8px] p-10 md:p-16 lg:p-[60px] relative flex flex-col lg:flex-row gap-12 lg:gap-24 overflow-hidden shadow-2xl">
          
          {/* Left Column: Heading */}
          <div className="w-full lg:w-5/12 flex items-center shrink-0 lg:pr-10">
            <h2 className="font-playfair font-medium text-4xl lg:text-[36px] leading-[44px] text-white tracking-[-0.72px]">
              Happy students sharing experiences
            </h2>
          </div>

          {/* Right Column: Testimonial Carousel */}
          <div className="w-full lg:w-7/12 flex flex-col relative min-h-[300px] justify-center lg:pl-10 lg:border-l lg:border-white/10">
            
            {/* Active Testimonial Slide */}
            <div className="flex flex-col gap-6 w-full animate-slide-in" key={currentTestimonial.id}>
              {/* Tagline */}
              <p className="text-white/70 font-inter text-lg font-medium tracking-wide">
                {currentTestimonial.tagline}
              </p>
              
              {/* Quote */}
              <p className="text-white font-inter text-2xl md:text-[24px] leading-[33.6px] tracking-[-0.5px] font-medium min-h-[140px]">
                &ldquo;{currentTestimonial.quote}&rdquo;
              </p>

              {/* Author & Controls Container */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mt-4">
                
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0">
                    <Image 
                      src={currentTestimonial.avatar} 
                      alt={currentTestimonial.author} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-white text-lg font-medium leading-[30.6px]">
                      {currentTestimonial.author}
                    </p>
                    <p className="text-white/80 text-sm leading-[23.8px]">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                  <button 
                    aria-label="Previous Testimonial"
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Image 
                      src="/assets/testimonial-back-arrow.svg" 
                      alt="Previous" 
                      width={40} 
                      height={40}
                      className="w-10 h-10"
                    />
                  </button>
                  <button 
                    aria-label="Next Testimonial"
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Image 
                      src="/assets/testimonial-next-arrow.svg" 
                      alt="Next" 
                      width={40} 
                      height={40}
                      className="w-10 h-10"
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
