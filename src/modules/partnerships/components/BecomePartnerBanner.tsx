import React from "react";
import Link from "next/link";

export default function BecomePartnerBanner() {
  return (
    <section className="bg-white pb-16 lg:pb-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="bg-[#160d03] rounded-xl sm:rounded-2xl min-h-[440px] lg:h-[550px] p-8 sm:p-12 lg:px-[64px] lg:py-[61px] flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
          {/* Left Column: Heading */}
          <div className="w-full lg:max-w-[451px] shrink-0 pt-2 lg:pt-4">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-[-1.5px] leading-tight lg:leading-[62.4px]">
              Become an IILP Partner
            </h2>
          </div>

          {/* Right Column: Description & Action */}
          <div className="flex flex-col items-start gap-8 w-full lg:max-w-[500px] my-auto">
            <p className="font-serif text-white text-lg sm:text-xl lg:text-[24px] leading-normal sm:leading-relaxed">
              IILP welcomes new partnerships with institutions, organizations,
              and governments aligned with its mission. Contact us to discuss
              collaboration opportunities.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors cursor-pointer"
            >
              Initiate Partnership Inquiry
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
