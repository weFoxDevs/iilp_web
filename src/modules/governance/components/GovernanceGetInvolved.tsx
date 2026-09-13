import Link from 'next/link';

export default function GovernanceGetInvolved() {
  return (
    <section className="w-full bg-white pb-16 lg:pb-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto bg-[#160d03] rounded-2xl overflow-hidden p-8 sm:p-12 lg:py-[64px] lg:px-[64px]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16 min-h-[400px]">
          
          {/* Left Column: Heading */}
          <div className="flex-1">
            <h2 className="text-4xl sm:text-5xl lg:text-[48px] font-serif font-medium text-white tracking-[-1.5px] leading-[1.25]">
              Get Involved
            </h2>
          </div>

          {/* Right Column: Details & Action */}
          <div className="flex-1 max-w-[500px] flex flex-col gap-8 items-start justify-center">
            <p className="text-white/70 text-base sm:text-lg lg:text-[18px] font-sans font-medium">
              Empowering Dreams, Transforming Futures.
            </p>

            <p className="text-xl sm:text-2xl lg:text-[24px] font-serif font-normal text-white leading-snug">
              Contact the Youth Leadership Development Officer to apply for involvement in the Youth Leadership Assembly.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans"
            >
              Apply to Get Involved
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
