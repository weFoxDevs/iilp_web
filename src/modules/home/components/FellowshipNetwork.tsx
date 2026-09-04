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
    <section className="bg-white py-24 lg:py-[140px] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-center lg:items-start">
          
          {/* Left Column (Content) */}
          <div className="flex flex-col gap-10 w-full lg:w-1/2 max-w-2xl">
            {/* Header section */}
            <div className="flex flex-col gap-6 items-start">
              <div className="inline-block border border-primary-800 rounded-full px-3 py-1.5">
                <span className="text-gray-950 text-sm font-semibold uppercase tracking-wide font-inter">
                  Global Fellowship Network
                </span>
              </div>
              <h2 className="font-playfair font-medium text-4xl md:text-[44px] leading-tight text-gray-950 tracking-[-0.72px]">
                Join the IILP Fellowship Network
              </h2>
              <p className="text-xl text-gray-950/70 leading-[30px] font-inter">
                Join the IILP Global Fellowship Network — connecting researchers, professionals, and emerging leaders around the world. Applications are open for Research Fellows, Junior Fellows, and Honorary Fellows.
              </p>
            </div>

            {/* Fellowship List */}
            <div className="flex flex-col gap-8 w-full">
              {fellowships.map((item) => (
                <div key={item.id} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-playfair font-bold text-2xl text-secondary-500">
                      {item.title}
                    </h3>
                    <p className="text-secondary-900/70 text-lg leading-7 font-inter">
                      {item.description}
                    </p>
                  </div>
                  {/* Decorative Underline */}
                  <div className="flex h-0.5 w-[243px] bg-primary-500">
                    <div className="h-full w-[141px] bg-secondary-500" />
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 font-inter">
              <Link 
                href="/fellowships/apply" 
                className="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-semibold text-base px-6 py-3.5 rounded-full shadow-sm transition-colors w-full sm:w-auto"
              >
                Apply for Fellowship
              </Link>
              <Link 
                href="/fellowships" 
                className="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 font-semibold text-base px-6 py-3.5 rounded-full shadow-sm transition-colors w-full sm:w-auto"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column (Images) */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[590px] h-[500px] sm:h-[600px]">
              
              {/* Image 1 (Top Left) */}
              <div className="absolute top-0 left-0 w-[60%] h-[75%] rounded-lg overflow-hidden">
                <Image 
                  src="/assets/fellowship-1.png" 
                  alt="Fellowship Collaboration" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
              </div>

              {/* Image 2 (Bottom Right) */}
              <div className="absolute bottom-0 right-0 w-[60%] h-[60%] border-4 border-white bg-gray-100 overflow-hidden shadow-sm z-10 rounded-sm">
                <Image 
                  src="/assets/fellowship-2.png" 
                  alt="Fellowship Professional" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80vw, 40vw"
                />
              </div>

              {/* Circular Badge */}
              <div className="absolute top-[10%] right-[10%] md:right-[5%] w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] bg-white rounded-full flex items-center justify-center shadow-lg z-20">
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
