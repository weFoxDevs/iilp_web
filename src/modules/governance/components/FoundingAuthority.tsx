import Image from 'next/image';
import Link from 'next/link';

export default function FoundingAuthority() {
  return (
    <section className="w-full bg-[#e6f9ff] py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[120px]">
        
        {/* Left: Content Block */}
        <div className="flex-1 flex flex-col gap-10 lg:gap-[80px] items-start">
          <div className="flex flex-col gap-[30px] items-start">
            <div className="flex flex-col gap-4 items-start">
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                  Founding Authority
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[44px] max-w-[580px]">
                Founder and President
              </h2>
            </div>

            <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans">
              The Founder and President serves as the highest visionary and strategic authority of the Institute, providing overall direction, institutional stewardship, and long-term strategic guidance. Full profile: see Leadership Directory.
            </p>
          </div>

          {/* Action Button */}
          <Link
            href="/leadership-directory"
            className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans"
          >
            View Leadership Directory
          </Link>
        </div>

        {/* Right: Feature Image */}
        <div className="w-full lg:w-[500px] h-[360px] sm:h-[450px] lg:h-[520px] relative shrink-0 overflow-hidden">
          <Image
            src="/assets/governance-founding-authority.png"
            alt="Founder and President - Founding Authority"
            fill
            sizes="(max-width: 1024px) 100vw, 500px"
            className="object-cover"
          />
        </div>

      </div>
    </section>
  );
}
