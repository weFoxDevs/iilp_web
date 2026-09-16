import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface GalleryItem {
  src: string;
  size: 'lg' | 'sm' | string;
}

const defaultImages: GalleryItem[] = [
  { src: '/assets/gallery-1.png', size: 'lg' },
  { src: '/assets/gallery-2.png', size: 'sm' },
  { src: '/assets/gallery-3.png', size: 'lg' },
  { src: '/assets/gallery-4.png', size: 'sm' },
];

interface AboutGalleryProps {
  data?: Partial<PageSectionData>;
}

export default function AboutGallery({ data }: AboutGalleryProps) {
  const meta = (data?.metadata || {}) as {
    images?: GalleryItem[];
  };

  const images = meta.images && meta.images.length > 0 ? meta.images : defaultImages;

  // Repeat items for continuous infinite scroll
  const marqueeImages = [...images, ...images, ...images];

  return (
    <section className="w-full bg-white pb-16 lg:pb-[140px] pt-4 lg:pt-8 relative overflow-hidden">
      <div className="relative w-full h-[280px] sm:h-[380px] lg:h-[650px] flex items-center">
        
        {/* Infinite Marquee Track */}
        <div className="flex gap-6 sm:gap-8 lg:gap-[70px] absolute left-0 animate-marquee items-center whitespace-nowrap pl-6 lg:pl-[70px]">
          {marqueeImages.map((img, index) => (
            <div
              key={index}
              className={`relative shrink-0 overflow-hidden shadow-sm ${
                img.size === 'lg'
                  ? 'w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] lg:w-[650px] lg:h-[650px]'
                  : 'w-[170px] h-[170px] sm:w-[250px] sm:h-[250px] lg:w-[450px] lg:h-[450px]'
              }`}
            >
              <Image
                src={img.src}
                alt={`IILP Campus life ${index + 1}`}
                fill
                sizes="(max-width: 1024px) 350px, 650px"
                className="object-cover"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
