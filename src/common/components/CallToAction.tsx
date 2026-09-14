import Link from 'next/link';
import Image from 'next/image';

export function CallToAction() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-start min-h-[580px] lg:min-h-[800px] xl:min-h-[839px] pt-[70px] md:pt-[100px] pb-[280px] md:pb-[340px] lg:pb-[380px]">
      {/* Background Image - 1920x839 in Figma */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src="/assets/cta-bg.png" 
          alt="Join the IILP Community Today" 
          fill
          priority
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-[40px] md:gap-[56px] max-w-[1440px]">
        
        {/* Main Content Group */}
        <div className="flex flex-col items-center gap-[24px] max-w-[1080px] w-full text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center justify-center px-[12px] py-[8px] rounded-full border border-[#33ccff] bg-[#e6f9ff]/10 backdrop-blur-xs shrink-0">
            <span className="text-white font-inter font-semibold text-[14px] md:text-[16px] leading-[17.6px] uppercase tracking-wider whitespace-nowrap">
              Start Your Journey
            </span>
          </div>
          
          {/* Titles Container */}
          <div className="flex flex-col items-center gap-[16px] w-full">
            <h2 className="font-playfair font-medium text-[30px] sm:text-[34px] md:text-[36px] leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#0a0d12] text-center max-w-[1000px]">
              Join the IILP Community Today
            </h2>
            <p className="font-adamina font-normal text-[16px] sm:text-[18px] md:text-[20px] leading-[28px] md:leading-[30px] tracking-[0.2px] text-[#e4e3fc] text-center max-w-[800px]">
              Whether you are a scholar, practitioner, policymaker, or supporter — your involvement is invaluable to creating a better, more informed, and more equitable future.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-[12px] shrink-0">
          <Link 
            href="/partner" 
            className="flex items-center justify-center px-[24px] py-[14px] bg-[#1e2939] hover:bg-black text-white font-source font-semibold text-[16px] leading-[24px] rounded-full shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            Partner with Us
          </Link>
          <Link 
            href="/donate" 
            className="flex items-center justify-center px-[24px] py-[14px] bg-[#f9fafb] hover:bg-white border border-[#e5e7eb] text-[#4a5565] hover:text-[#0a0d12] font-source font-semibold text-[16px] leading-[24px] rounded-full shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors whitespace-nowrap w-full sm:w-auto"
          >
            Donate to Support IILP
          </Link>
        </div>
        
      </div>
    </section>
  );
}

export default CallToAction;
