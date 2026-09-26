import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface FoundingAuthorityProps {
  data?: Partial<PageSectionData>;
}

export default function FoundingAuthority({ data }: FoundingAuthorityProps) {
  const badge = data?.badge ?? 'Founding Authority';
  const title = data?.title ?? 'Founder and President';
  const subtitle =
    data?.subtitle ??
    'The Founder and President serves as the highest visionary and strategic authority of the Institute, providing overall direction, institutional stewardship, and long-term strategic guidance. Full profile: see Leadership Directory.';
  const actionText = data?.actionText ?? 'View Leadership Directory';
  const actionUrl = data?.actionUrl ?? '/leadership-directory';
  const bgImage = data?.bgImage || '/assets/governance-founding-authority.png';

  return (
    <section className="w-full bg-[#e6f9ff] py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12 lg:gap-[120px]">
        
        {/* Left: Content Block */}
        <div className="flex-1 flex flex-col gap-10 lg:gap-[80px] items-start">
          <div className="flex flex-col gap-[30px] items-start">
            <div className="flex flex-col gap-4 items-start">
              {badge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                  <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                    {badge}
                  </span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-tight sm:leading-[44px] max-w-[580px]">
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
              className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans w-full sm:w-auto text-center"
            >
              {actionText}
            </Link>
          )}
        </div>

        {/* Right: Feature Image */}
        <div className="w-full lg:w-[500px] h-[250px] sm:h-[400px] lg:h-[520px] relative shrink-0 overflow-hidden rounded-lg sm:rounded-none">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}

