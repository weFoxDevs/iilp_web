import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface GovernanceGetInvolvedProps {
  data?: Partial<PageSectionData>;
}

export default function GovernanceGetInvolved({ data }: GovernanceGetInvolvedProps) {
  const title = data?.title ?? 'Get Involved';
  const subtitle = data?.subtitle ?? 'Empowering Dreams, Transforming Futures.';
  const description =
    data?.bodyContent ??
    'Contact the Youth Leadership Development Officer to apply for involvement in the Youth Leadership Assembly.';
  const actionText = data?.actionText ?? 'Apply to Get Involved';
  const actionUrl = data?.actionUrl ?? '/contact';

  return (
    <section className="w-full bg-white pb-12 sm:pb-16 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto bg-[#160d03] rounded-2xl overflow-hidden p-6 sm:p-12 lg:py-[64px] lg:px-[64px]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 min-h-[400px]">
          
          {/* Left Column: Heading */}
          <div className="flex-1">
            <h2 className="text-2xl sm:text-4xl lg:text-[48px] font-serif font-medium text-white tracking-tight leading-[1.25]">
              {title}
            </h2>
          </div>

          {/* Right Column: Details & Action */}
          <div className="flex-1 max-w-[500px] flex flex-col gap-8 items-start justify-center">
            {subtitle && (
              <p className="text-white/70 text-base sm:text-lg lg:text-[18px] font-sans font-medium">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-base sm:text-xl lg:text-[24px] font-serif font-normal text-white leading-relaxed sm:leading-snug">
                {description}
              </p>
            )}

            {actionText && (
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans w-full sm:w-auto text-center"
              >
                {actionText}
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
