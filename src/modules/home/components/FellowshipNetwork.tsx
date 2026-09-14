import Link from 'next/link';
import Image from 'next/image';

export function FellowshipNetwork() {
  const fellowships = [
    {
      id: 1,
      title: 'Research Fellows',
      description: "For established researchers and academics advancing IILP's scholarly agenda.",
    },
    {
      id: 2,
      title: 'Junior Fellows',
      description: 'For emerging scholars and early-career professionals committed to impactful research.',
    },
    {
      id: 3,
      title: 'Honorary Fellows',
      description: 'Recognizing distinguished individuals who have made exceptional contributions.',
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-[80px] items-center lg:items-start justify-between">
          
          {/* Left Column (Content) */}
          <div className="flex flex-col gap-[60px] lg:gap-[80px] w-full lg:flex-1 max-w-[650px]">
            {/* Header section */}
            <div className="flex flex-col gap-[30px] items-start w-full">
              <div className="flex flex-col gap-[16px] items-start w-full">
                <div className="border border-[#00698c] rounded-full px-[12px] py-[8px]">
                  <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                    Global Fellowship Network
                  </span>
                </div>

                <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] text-[#0a0d12] tracking-[-0.72px]">
                  Join the IILP Fellowship Network
                </h2>
              </div>

              <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]/70">
                Join the IILP Global Fellowship Network — connecting researchers, professionals, and emerging leaders around the world. Applications are open for Research Fellows, Junior Fellows, and Honorary Fellows.
              </p>

              {/* Fellowship List */}
              <div className="flex flex-col gap-[30px] items-start w-full pt-2">
                {fellowships.map((item) => (
                  <div key={item.id} className="flex flex-col gap-[24px] items-start w-full">
                    <div className="flex flex-col gap-[5px] items-start w-full">
                      <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-[24px] leading-[32px] text-[#000080]">
                        {item.title}
                      </h3>
                      <p className="font-source font-normal text-[18px] leading-[28px] text-[#000036]/70">
                        {item.description}
                      </p>
                    </div>

                    {/* Decorative Underline */}
                    <div className="w-[243px] h-[2px] bg-[#00bfff] relative overflow-hidden">
                      <div className="h-full w-[141px] bg-[#000080]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-[12px] items-start">
              <Link 
                href="/fellowships/apply" 
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a2d6] text-white font-source font-semibold text-[16px] leading-[24px] px-[24px] py-[14px] rounded-full shadow-sm transition-colors w-full sm:w-auto"
              >
                Apply for Fellowship
              </Link>
              <Link 
                href="/fellowships" 
                className="inline-flex items-center justify-center bg-[#f9fafb] hover:bg-gray-100 border border-[#e5e7eb] text-[#4a5565] font-source font-semibold text-[16px] leading-[24px] px-[24px] py-[14px] rounded-full shadow-sm transition-colors w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column (Images) */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
            <div className="relative w-full max-w-[590px] h-[480px] sm:h-[600px]">
              
              {/* Image 1 (Top Left) - 348x448 px */}
              <div className="absolute top-0 left-0 w-[270px] sm:w-[348px] h-[348px] sm:h-[448px] overflow-hidden">
                <Image 
                  src="/assets/fellowship-1.png" 
                  alt="Fellowship Collaboration" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 270px, 348px"
                />
              </div>

              {/* Image 2 (Bottom Right) - 348x358 px */}
              <div className="absolute bottom-0 right-0 sm:top-[242px] sm:left-[242px] w-[260px] sm:w-[348px] h-[270px] sm:h-[358px] border-[4px] border-white overflow-hidden shadow-md z-10">
                <Image 
                  src="/assets/fellowship-2.png" 
                  alt="Fellowship Professional" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 260px, 348px"
                />
              </div>

              {/* Circular Badge - 120x120 px */}
              <div className="absolute top-[30px] right-[20px] sm:top-[60px] sm:left-[410px] w-[95px] sm:w-[120px] h-[95px] sm:h-[120px] bg-white rounded-full border border-[#641320] flex items-center justify-center shadow-md z-20">
                <div className="relative w-[85%] h-[85%]">
                  <Image 
                    src="/assets/fellowship-badge.png" 
                    alt="Badge" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
