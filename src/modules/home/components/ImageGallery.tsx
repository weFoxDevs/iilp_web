import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface GalleryImageItem {
  src: string;
  alt: string;
  size: 'sm' | 'lg' | string;
}

const defaultImages: GalleryImageItem[] = [
  { 
    src: "/assets/gallery-student-stairs.png", 
    alt: "Students walking down campus stairs", 
    size: "lg" 
  },
  { 
    src: "/assets/gallery-students-park.png", 
    alt: "Students walking in campus park", 
    size: "sm" 
  },
  { 
    src: "/assets/gallery-walking-stairs.png", 
    alt: "Students walking down brick steps on campus", 
    size: "lg" 
  },
  { 
    src: "/assets/gallery-sunset-campus.png", 
    alt: "Campus park bench at sunset", 
    size: "sm" 
  },
];

interface ImageGalleryProps {
  data?: Partial<PageSectionData>;
}

export function ImageGallery({ data }: ImageGalleryProps) {
  if (data?.isActive === false) {
    return null;
  }

  const rawImages = (data?.metadata?.images as GalleryImageItem[] | undefined) || [];
  const validImages = Array.isArray(rawImages)
    ? rawImages.filter(
        (img): img is GalleryImageItem =>
          Boolean(img && typeof img.src === 'string' && img.src.trim() !== '')
      )
    : [];

  const images = validImages.length > 0 ? validImages : defaultImages;

  // Duplicate to create seamless infinite scrolling marquee
  const marqueeImages = [...images, ...images, ...images];

  return (
    <section className="w-full bg-[#e6f9ff] py-10 sm:py-16 lg:py-[140px] relative overflow-hidden">
      <div className="relative w-full h-[240px] sm:h-[380px] lg:h-[650px] flex items-center">
        
        {/* Infinite Scroll Container */}
        <div className="flex gap-4 sm:gap-8 lg:gap-[70px] absolute left-0 animate-marquee items-center whitespace-nowrap hover:[animation-play-state:paused]">
          {marqueeImages.map((img, index) => (
            <div 
              key={index} 
              className={`relative shrink-0 overflow-hidden rounded-xs ${
                img.size === "lg" 
                  ? "w-[220px] h-[220px] sm:w-[360px] sm:h-[360px] lg:w-[650px] lg:h-[650px]" 
                  : "w-[160px] h-[160px] sm:w-[260px] sm:h-[260px] lg:w-[450px] lg:h-[450px]"
              }`}
            >
              <Image 
                src={img.src}
                alt={img.alt || "Campus Gallery"}
                fill
                sizes="(max-width: 640px) 280px, (max-width: 1024px) 420px, 650px"
                className="object-cover"
                priority={index < 4}
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
