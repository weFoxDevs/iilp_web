import React, { useRef } from "react";
import Image from "next/image";

interface GalleryBlock {
  type: "large" | "medium" | "stacked";
  src: string;
  alt: string;
  subSrc?: string;
  subAlt?: string;
}

const galleryBlocks: GalleryBlock[] = [
  {
    type: "large",
    src: "/assets/gallery-walking-stairs.png",
    alt: "Students descending brick stairs at IILP",
  },
  {
    type: "medium",
    src: "/assets/gallery-students-park.png",
    alt: "Students walking together through the academic park",
  },
  {
    type: "large",
    src: "/assets/gallery-sunset-campus.png",
    alt: "Campus park and trees at golden sunset",
  },
  {
    type: "stacked",
    src: "/assets/gallery-student-stairs.png",
    alt: "Student on stairs with backpack",
    subSrc: "/assets/gallery-students-park.png",
    subAlt: "Students discussing research on campus",
  },
  {
    type: "large",
    src: "/assets/gallery-walking-stairs.png",
    alt: "Faculty and fellows on campus",
  },
  {
    type: "medium",
    src: "/assets/gallery-sunset-campus.png",
    alt: "IILP campus quad",
  },
  {
    type: "large",
    src: "/assets/gallery-students-park.png",
    alt: "Students collaborating outdoors",
  },
];

export function PhotoGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#e6f9ff] py-16 lg:py-[140px] overflow-hidden">
      {/* Header Container */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] flex flex-col items-center gap-4 text-center">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-2 bg-transparent">
          <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
            Visual Media
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
          Photo Gallery
        </h2>
      </div>

      {/* Gallery Carousel Container with Floating Nav Arrows */}
      <div className="relative mt-12 lg:mt-16 w-full group">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Previous photos"
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-white/95 hover:bg-white text-[#000080] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-105"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Next photos"
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 size-12 rounded-full bg-white/95 hover:bg-white text-[#000080] shadow-xl flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-105"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Horizontal Scrollable Gallery Strip */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-6 lg:px-12"
        >
          <div className="flex items-center gap-6 sm:gap-8 h-[440px] sm:h-[520px] lg:h-[650px] min-w-max mx-auto py-2">
            {galleryBlocks.map((block, idx) => {
              if (block.type === "large") {
                return (
                  <div
                    key={idx}
                    className="relative w-[320px] sm:w-[480px] lg:w-[650px] h-[320px] sm:h-[480px] lg:h-[650px] rounded-[16px] overflow-hidden shadow-sm shrink-0 bg-gray-100 group/img"
                  >
                    <Image
                      src={block.src}
                      alt={block.alt}
                      fill
                      sizes="(max-width: 768px) 320px, 650px"
                      className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                  </div>
                );
              }

              if (block.type === "stacked" && block.subSrc) {
                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-5 sm:gap-6 w-[240px] sm:w-[320px] lg:w-[450px] h-[320px] sm:h-[480px] lg:h-[650px] shrink-0"
                  >
                    <div className="relative flex-1 rounded-[16px] overflow-hidden shadow-sm bg-gray-100 group/img">
                      <Image
                        src={block.src}
                        alt={block.alt}
                        fill
                        sizes="450px"
                        className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="relative flex-1 rounded-[16px] overflow-hidden shadow-sm bg-gray-100 group/img">
                      <Image
                        src={block.subSrc}
                        alt={block.subAlt || block.alt}
                        fill
                        sizes="450px"
                        className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="relative w-[240px] sm:w-[320px] lg:w-[450px] h-[240px] sm:h-[320px] lg:h-[450px] rounded-[16px] overflow-hidden shadow-sm shrink-0 bg-gray-100 my-auto group/img"
                >
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 768px) 240px, 450px"
                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
