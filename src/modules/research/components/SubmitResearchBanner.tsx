import React from "react";
import Link from "next/link";

export default function SubmitResearchBanner() {
  return (
    <section className="bg-white pb-16 sm:pb-24 lg:pb-[140px] px-4 sm:px-8 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="bg-[#160d03] rounded-[8px] min-h-[380px] lg:h-[550px] p-8 sm:p-12 lg:pb-[69px] lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] flex flex-col lg:flex-row justify-between items-start overflow-hidden relative">
          {/* Left Column: Heading */}
          <div className="max-w-[451px]">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[48px] text-white leading-tight lg:leading-[62.4px] tracking-[-1.5px]">
              Submit Your Research to IILP
            </h2>
          </div>

          {/* Right Column: Subtitle & CTA Button */}
          <div className="flex flex-col gap-6 lg:gap-[32px] max-w-[500px] mt-8 lg:mt-[130px]">
            <p className="font-serif text-lg sm:text-xl lg:text-[24px] text-white leading-snug lg:leading-normal">
              Researchers and scholars are welcome to submit papers, policy briefs,
              and working papers for consideration in IILP&apos;s publications.
            </p>

            <div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors drop-shadow-xs whitespace-nowrap"
              >
                Submit Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
