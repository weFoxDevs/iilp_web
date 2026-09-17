import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface ExecutiveDirectorateBoardProps {
  data?: Partial<PageSectionData>;
}

export default function ExecutiveDirectorateBoard({ data }: ExecutiveDirectorateBoardProps) {
  const badge = data?.badge ?? 'Operational Leadership';
  const title = data?.title ?? 'Executive Directorate Board';
  const subtitle =
    data?.subtitle ??
    "The Executive Directorate Board serves as the operational leadership body of the Institute, responsible for implementing institutional policies, coordinating programs, managing administrative functions, and supporting the achievement of the Institute's strategic objectives. Full member list and responsibilities: see Leadership Directory.";
  const actionText = data?.actionText ?? 'View Full Leadership Directory';
  const actionUrl = data?.actionUrl ?? '/leadership-directory';
  const bgImage = data?.bgImage || '/assets/about-vision-students.png';

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[80px]">
        
        {/* Left Column: Image with Floating Badges */}
        <div className="w-full lg:flex-1 aspect-[540/600] relative overflow-hidden">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 540px"
            className="object-cover"
          />

          {/* Overlapping Floating Award Badges */}
          <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center">
            {/* Badge 1: Ultra Award */}
            <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
              <div className="relative w-[48px] sm:w-[60px] h-[24px] sm:h-[30px]">
                <Image
                  src="/assets/about-vision-badge-1.svg"
                  alt="Ultra Award"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Badge 2: Hyper Best */}
            <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] -ml-4 rounded-full bg-[#c3f499] flex items-center justify-center shadow-md">
              <div className="relative w-[50px] sm:w-[63px] h-[24px] sm:h-[30px]">
                <Image
                  src="/assets/about-vision-badge-2.svg"
                  alt="Hyper Best Award"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="w-full lg:flex-1 flex flex-col gap-10 lg:gap-[80px] items-start">
          <div className="flex flex-col gap-6 lg:gap-[30px] items-start">
            <div className="flex flex-col gap-4 items-start">
              {badge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                  <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                    {badge}
                  </span>
                </div>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[44px] max-w-[580px]">
                {title}
              </h2>
            </div>

            {subtitle && (
              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans">
                {subtitle}
              </p>
            )}
          </div>

          {/* Action Button */}
          {actionText && (
            <Link
              href={actionUrl}
              className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans"
            >
              {actionText}
            </Link>
          )}
        </div>

      </div>
    </section>
  );
}

