import React, { useRef } from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

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
    alt: "Students descending brick stairs",
  },
  {
    type: "medium",
    src: "/assets/gallery-students-park.png",
    alt: "Two students walking on campus",
  },
  {
    type: "large",
    src: "/assets/gallery-sunset-campus.png",
    alt: "Campus park at sunset",
  },
  {
    type: "stacked",
    src: "/assets/gallery-student-stairs.png",
    alt: "Student on stairs with backpack",
    subSrc: "/assets/gallery-student-stairs.png",
    subAlt: "Student on stairs with backpack",
  },
  {
    type: "large",
    src: "/assets/gallery-walking-stairs.png",
    alt: "Students descending brick stairs",
  },
  {
    type: "medium",
    src: "/assets/gallery-students-park.png",
    alt: "Two students walking on campus",
  },
  {
    type: "large",
    src: "/assets/gallery-sunset-campus.png",
    alt: "Campus park at sunset",
  },
  {
    type: "medium",
    src: "/assets/gallery-student-stairs.png",
    alt: "Student on stairs with backpack",
  },
];

interface PhotoGallerySectionProps {
  data?: Partial<PageSectionData>;
}

export default function PhotoGallerySection({ data }: PhotoGallerySectionProps = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const badge = data?.badge || "Visual Media";
  const title = data?.title || "Photo Gallery";

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -450 : 450;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-[#e6f9ff] py-12 sm:py-20 lg:py-[140px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] flex flex-col gap-8 sm:gap-10 lg:gap-[60px] items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
            <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif font-medium text-2xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-tight leading-tight lg:leading-[44px]">
            {title}
          </h2>
        </div>
      </div>

      {/* Gallery Strip with Navigation Arrows */}
      <div className="relative mt-8 lg:mt-12 w-full group">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#000080] shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Scroll left"
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
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#000080] shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
          aria-label="Scroll right"
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
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Horizontal Mosaic Strip */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-6 lg:px-12"
        >
          <div className="flex items-center gap-6 sm:gap-8 h-[450px] lg:h-[650px] min-w-max mx-auto py-2">
            {galleryBlocks.map((block, idx) => {
              if (block.type === "large") {
                return (
                  <div
                    key={idx}
                    className="relative w-[340px] sm:w-[480px] lg:w-[650px] h-[340px] sm:h-[480px] lg:h-[650px] rounded-2xl overflow-hidden shadow-md shrink-0 bg-gray-200 group/item"
                  >
                    <Image
                      src={block.src}
                      alt={block.alt}
                      fill
                      className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 340px, 650px"
                    />
                  </div>
                );
              }

              if (block.type === "stacked" && block.subSrc) {
                return (
                  <div
                    key={idx}
                    className="flex flex-col gap-4 sm:gap-6 w-[240px] sm:w-[320px] lg:w-[450px] h-[340px] sm:h-[480px] lg:h-[650px] shrink-0"
                  >
                    <div className="relative flex-1 rounded-2xl overflow-hidden shadow-md bg-gray-200 group/item">
                      <Image
                        src={block.src}
                        alt={block.alt}
                        fill
                        className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                        sizes="450px"
                      />
                    </div>
                    <div className="relative flex-1 rounded-2xl overflow-hidden shadow-md bg-gray-200 group/item">
                      <Image
                        src={block.subSrc}
                        alt={block.subAlt || block.alt}
                        fill
                        className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                        sizes="450px"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="relative w-[240px] sm:w-[320px] lg:w-[450px] h-[240px] sm:h-[320px] lg:h-[450px] rounded-2xl overflow-hidden shadow-md shrink-0 bg-gray-200 group/item my-auto"
                >
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    className="object-cover group-hover/item:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 240px, 450px"
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
