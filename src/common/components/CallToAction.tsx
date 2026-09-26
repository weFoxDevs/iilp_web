import Link from 'next/link';
import Image from 'next/image';
import { useSiteLayout } from './SiteLayoutContext';

export function CallToAction() {
  const { cta } = useSiteLayout();

  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-start min-h-[460px] sm:min-h-[540px] lg:min-h-[800px] xl:min-h-[839px] pt-12 sm:pt-[70px] md:pt-[100px] pb-24 sm:pb-44 md:pb-[340px] lg:pb-[380px] bg-[#000036]">
      {/* Background Image - 1920x839 in Figma */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image 
          src={cta.bgImage || "/assets/cta-bg.png"} 
          alt={cta.title || "Join the IILP Community Today"} 
          fill
          priority
          unoptimized
          className="object-cover object-bottom"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 flex flex-col items-center justify-center gap-8 sm:gap-[40px] md:gap-[56px] max-w-[1440px]">
        
        {/* Main Content Group */}
        <div className="flex flex-col items-center gap-4 sm:gap-[24px] max-w-[1080px] w-full text-center">
          {/* Pill Badge */}
          {cta.badge && (
            <div className="inline-flex items-center justify-center px-[14px] py-[6px] sm:py-[8px] rounded-full border border-[#33ccff] bg-[#e6f9ff]/10 backdrop-blur-xs shrink-0 max-w-full">
              <span className="text-white font-inter font-semibold text-xs sm:text-[14px] md:text-[16px] leading-tight uppercase tracking-wider text-center">
                {cta.badge}
              </span>
            </div>
          )}
          
          {/* Titles Container */}
          <div className="flex flex-col items-center gap-3 sm:gap-[16px] w-full">
            {cta.title && (
              <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-[36px] leading-snug sm:leading-[38px] md:leading-[44px] tracking-[-0.72px] text-[#0a0d12] text-center max-w-[1000px]">
                {cta.title}
              </h2>
            )}
            {cta.subtitle && (
              <p className="font-adamina font-normal text-sm sm:text-base md:text-[20px] leading-relaxed sm:leading-[28px] md:leading-[30px] tracking-[0.2px] text-[#e4e3fc] text-center max-w-[800px]">
                {cta.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-[12px] w-full sm:w-auto">
          {cta.actionText && cta.actionUrl && (
            <Link 
              href={cta.actionUrl} 
              className="flex items-center justify-center px-[24px] py-[12px] sm:py-[14px] bg-[#1e2939] hover:bg-black text-white font-source font-semibold text-sm sm:text-[16px] leading-[24px] rounded-full shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors w-full sm:w-auto text-center min-h-[44px]"
            >
              {cta.actionText}
            </Link>
          )}
          {cta.secondaryButton?.text && cta.secondaryButton?.url && (
            <Link 
              href={cta.secondaryButton.url} 
              className="flex items-center justify-center px-[24px] py-[12px] sm:py-[14px] bg-[#f9fafb] hover:bg-white border border-[#e5e7eb] text-[#4a5565] hover:text-[#0a0d12] font-source font-semibold text-sm sm:text-[16px] leading-[24px] rounded-full shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors w-full sm:w-auto text-center min-h-[44px]"
            >
              {cta.secondaryButton.text}
            </Link>
          )}
        </div>
        
      </div>
    </section>
  );
}

export default CallToAction;
