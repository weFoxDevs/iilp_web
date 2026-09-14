import Image from 'next/image';

export function ImageGallery() {
  const images = [
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

  // Duplicate to create seamless infinite scrolling marquee
  const marqueeImages = [...images, ...images, ...images];

  return (
    <section className="w-full bg-[#e6f9ff] py-16 lg:py-[140px] relative overflow-hidden">
      <div className="relative w-full h-[320px] sm:h-[460px] lg:h-[650px] flex items-center">
        
        {/* Infinite Scroll Container */}
        <div className="flex gap-6 sm:gap-8 lg:gap-[70px] absolute left-0 animate-marquee items-center whitespace-nowrap hover:[animation-play-state:paused]">
          {marqueeImages.map((img, index) => (
            <div 
              key={index} 
              className={`relative shrink-0 overflow-hidden ${
                img.size === "lg" 
                  ? "w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:w-[650px] lg:h-[650px]" 
                  : "w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[450px] lg:h-[450px]"
              }`}
            >
              <Image 
                src={img.src}
                alt={img.alt}
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
