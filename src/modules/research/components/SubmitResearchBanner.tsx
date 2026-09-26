import React from "react";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";

interface SubmitResearchBannerProps {
  data?: Partial<PageSectionData>;
}

export default function SubmitResearchBanner({ data }: SubmitResearchBannerProps) {
  const title = data?.title ?? "Submit Your Research to IILP";
  const subtitle =
    data?.subtitle ??
    data?.bodyContent ??
    "Researchers and scholars are welcome to submit papers, policy briefs, and working papers for consideration in IILP's publications.";
  const actionText = data?.actionText ?? "Submit Research";
  const actionUrl = data?.actionUrl ?? "/contact";

  return (
    <section className="bg-white pb-12 sm:pb-24 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="bg-[#160d03] rounded-[8px] min-h-[340px] lg:h-[550px] p-6 sm:p-12 lg:pb-[69px] lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] flex flex-col lg:flex-row justify-between items-start overflow-hidden relative">
          {/* Left Column: Heading */}
          <div className="max-w-[451px]">
            <h2 className="font-serif font-medium text-2xl sm:text-4xl lg:text-[48px] text-white leading-tight lg:leading-[62.4px] tracking-tight sm:tracking-[-1.5px]">
              {title}
            </h2>
          </div>

          {/* Right Column: Subtitle & CTA Button */}
          <div className="flex flex-col gap-6 lg:gap-[32px] max-w-[500px] mt-6 sm:mt-8 lg:mt-[130px] w-full">
            {subtitle && (
              <p className="font-serif text-base sm:text-xl lg:text-[24px] text-white leading-snug lg:leading-normal">
                {subtitle}
              </p>
            )}

            {actionText && (
              <div className="w-full sm:w-auto">
                <Link
                  href={actionUrl}
                  className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors drop-shadow-xs whitespace-nowrap w-full sm:w-auto text-center"
                >
                  {actionText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
