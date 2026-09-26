import Link from 'next/link';
import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface FellowshipItem {
  id: number | string;
  title: string;
  description: string;
}

const defaultFellowships: FellowshipItem[] = [
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

interface FellowshipNetworkProps {
  data?: Partial<PageSectionData>;
}

export function FellowshipNetwork({ data }: FellowshipNetworkProps) {
  const section = {
    badge: data?.badge ?? 'Global Fellowship Network',
    title: data?.title ?? 'Join the IILP Fellowship Network',
    subtitle:
      data?.subtitle ??
      'Join the IILP Global Fellowship Network — connecting researchers, professionals, and emerging leaders around the world. Applications are open for Research Fellows, Junior Fellows, and Honorary Fellows.',
    actionText: data?.actionText || 'Apply for Fellowship',
    actionUrl: data?.actionUrl || '/fellowships/apply',
    metadata: data?.metadata ?? {
      secondaryActionText: 'Learn More',
      secondaryActionUrl: '/fellowships',
      fellowships: defaultFellowships,
    },
  };

  const meta = (section.metadata || {}) as {
    secondaryActionText?: string;
    secondaryActionUrl?: string;
    fellowships?: FellowshipItem[];
  };

  const fellowships = meta.fellowships || defaultFellowships;

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-[240px] overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 sm:gap-12 lg:gap-16 xl:gap-[80px] items-center lg:items-start justify-between">
          
          {/* Left Column (Content) */}
          <div className="flex flex-col gap-8 sm:gap-[40px] lg:gap-[60px] w-full lg:flex-1 max-w-[650px]">
            {/* Header section */}
            <div className="flex flex-col gap-4 sm:gap-[24px] items-start w-full">
              <div className="flex flex-col gap-3 sm:gap-[16px] items-start w-full">
                {section.badge && (
                  <div className="border border-[#00698c] rounded-full px-3.5 py-1.5 sm:px-[12px] sm:py-[8px]">
                    <span className="font-inter font-semibold text-xs sm:text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                      {section.badge}
                    </span>
                  </div>
                )}

                <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] text-[#0a0d12] tracking-[-0.72px]">
                  {section.title}
                </h2>
              </div>

              <p className="font-inter font-normal text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]/70">
                {section.subtitle}
              </p>

              {/* Fellowship List */}
              <div className="flex flex-col gap-6 sm:gap-[30px] items-start w-full pt-2">
                {fellowships.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 sm:gap-[24px] items-start w-full">
                    <div className="flex flex-col gap-1.5 sm:gap-[5px] items-start w-full">
                      <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-xl sm:text-[24px] leading-tight sm:leading-[32px] text-[#000080]">
                        {item.title}
                      </h3>
                      <p className="font-source font-normal text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-[28px] text-[#000036]/70">
                        {item.description}
                      </p>
                    </div>

                    {/* Decorative Underline */}
                    <div className="w-full max-w-[243px] h-[2px] bg-[#00bfff] relative overflow-hidden">
                      <div className="h-full w-[141px] bg-[#000080]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-[12px] items-start w-full">
              {section.actionText && (
                <Link 
                  href={section.actionUrl || "/fellowships/apply"} 
                  className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a2d6] text-white font-source font-semibold text-sm sm:text-[16px] leading-[24px] px-6 py-3 sm:px-[24px] sm:py-[14px] rounded-full shadow-sm transition-colors w-full sm:w-auto text-center min-h-[44px]"
                >
                  {section.actionText}
                </Link>
              )}
              <Link 
                href={meta.secondaryActionUrl || "/fellowships"} 
                className="inline-flex items-center justify-center bg-[#f9fafb] hover:bg-gray-100 border border-[#e5e7eb] text-[#4a5565] font-source font-semibold text-sm sm:text-[16px] leading-[24px] px-6 py-3 sm:px-[24px] sm:py-[14px] rounded-full shadow-sm transition-colors w-full sm:w-auto text-center min-h-[44px]"
              >
                {meta.secondaryActionText || "Learn More"}
              </Link>
            </div>
          </div>

          {/* Right Column (Responsive Collage Images) */}
          <div className="w-full lg:flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[500px] xl:max-w-[590px] aspect-[590/600]">
              
              {/* Image 1 (Top Left) */}
              <div className="absolute top-0 left-0 w-[59%] h-[74.5%] overflow-hidden rounded-xs shadow-xs">
                <Image 
                  src="/assets/fellowship-1.png" 
                  alt="Fellowship Collaboration" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 348px"
                />
              </div>

              {/* Image 2 (Bottom Right) */}
              <div className="absolute top-[40.3%] left-[41%] w-[59%] h-[59.7%] border-[3px] sm:border-[4px] border-white overflow-hidden shadow-xl z-10 rounded-xs">
                <Image 
                  src="/assets/fellowship-2.png" 
                  alt="Fellowship Professional" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 348px"
                />
              </div>

              {/* Circular Badge */}
              <div className="absolute top-[10%] left-[69.5%] w-[20.3%] aspect-square bg-white rounded-full border border-[#641320] flex items-center justify-center shadow-lg z-20">
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
