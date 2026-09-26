import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface JoinTeamBannerProps {
  data?: Partial<PageSectionData>;
}

export default function JoinTeamBanner({ data }: JoinTeamBannerProps) {
  const title = data?.title ?? 'Interested in Joining the IILP Team?';
  const description =
    data?.bodyContent ??
    data?.subtitle ??
    "View open positions and opportunities to contribute to IILP's mission of advancing global justice and knowledge.";
  const actionText = data?.actionText ?? 'Careers / Work With Us';
  const actionUrl = data?.actionUrl ?? '/careers';
  const secondaryActionText =
    (data?.metadata?.secondaryActionText as string) ?? 'Contact Us';
  const secondaryActionUrl =
    (data?.metadata?.secondaryActionUrl as string) ?? '/contact';

  return (
    <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto bg-[#160d03] rounded-2xl overflow-hidden p-6 sm:p-12 lg:py-[64px] lg:px-[64px]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 min-h-[380px]">
          
          {/* Left Column: Heading */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-4xl lg:text-[48px] font-serif font-medium text-white tracking-tight leading-[1.25] max-w-[480px]">
              {title}
            </h2>
          </div>

          {/* Right Column: Description & Action Buttons */}
          <div className="flex-1 max-w-[500px] flex flex-col gap-8 items-start justify-center">
            {description && (
              <p className="text-base sm:text-xl lg:text-[24px] font-serif font-normal text-white leading-relaxed sm:leading-snug">
                {description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full">
              {actionText && (
                <Link
                  href={actionUrl}
                  className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans text-center"
                >
                  {actionText}
                </Link>
              )}
              {secondaryActionText && (
                <Link
                  href={secondaryActionUrl}
                  className="inline-flex items-center justify-center rounded-full bg-[#f9fafb] hover:bg-white border border-[#e5e7eb] text-[#4a5565] px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans text-center"
                >
                  {secondaryActionText}
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
