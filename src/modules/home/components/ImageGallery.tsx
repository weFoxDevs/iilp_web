import Image from 'next/image';

export function ImageGallery() {
  const images = [
    { src: "/assets/gallery-1.png", size: "lg" },
    { src: "/assets/gallery-2.png", size: "sm" },
    { src: "/assets/gallery-3.png", size: "lg" },
    { src: "/assets/gallery-4.png", size: "sm" },
  ];

  // We duplicate the array to create a seamless infinite scrolling effect
  const marqueeImages = [...images, ...images, ...images];

  return (
    <section className="bg-[#E6F9FF] py-16 lg:py-[140px] relative overflow-hidden">
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[650px] flex items-center">
        
        {/* Infinite Scroll Container */}
        <div className="flex gap-8 lg:gap-[70px] absolute left-0 animate-marquee items-center whitespace-nowrap pl-8 lg:pl-[70px]">
          {marqueeImages.map((img, index) => (
            <div 
              key={index} 
              className={`relative shrink-0 overflow-hidden ${
                img.size === "lg" 
                  ? "w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[650px] lg:h-[650px]" 
                  : "w-[180px] h-[180px] sm:w-[250px] sm:h-[250px] lg:w-[450px] lg:h-[450px]"
              }`}
            >
              <Image 
                src={img.src}
                alt={`Gallery Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
