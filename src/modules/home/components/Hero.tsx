import Link from 'next/link';
import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface HeroProps {
  data?: Partial<PageSectionData>;
}

export function Hero({ data }: HeroProps) {
  const hero = {
    badge: data?.badge ?? 'Knowledge, Justice, and Leadership for Global Change.',
    title: data?.title ?? 'International Institute for Law and Politics (IILP)',
    subtitle:
      data?.subtitle ??
      'The International Institute for Law and Politics (IILP) is an independent, non-profit academic, research, policy, and leadership institute committed to strengthening the discourse, learning, and practice of international law, governance, politics, human rights, and humanitarian affairs.',
    bgImage: data?.bgImage || '/assets/home-hero-v2.png',
    actionText: data?.actionText || 'Apply for Fellowship',
    actionUrl: data?.actionUrl || '/fellowships',
  };

  return (
    <section 
      className="relative w-full bg-[#9acaf1] min-h-[920px] lg:min-h-[1100px] xl:h-[1303px] flex flex-col items-center pt-[180px] sm:pt-[210px] lg:pt-[245px] pb-[160px] overflow-hidden"
      data-node-id="103:214"
      data-name="Hero section version 2"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={hero.bgImage || '/assets/home-hero-v2.png'} 
          alt={hero.title || 'IILP Students - Empowering Futures'}
          fill
          priority
          className="object-cover object-top sm:object-center pointer-events-none"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 flex flex-col items-center text-center">
        
        {/* Top Badge */}
        {hero.badge && (
          <div className="border border-[#e6f9ff] bg-white/10 backdrop-blur-sm rounded-full px-[12px] py-[8px] mb-6 inline-flex items-center justify-center shadow-xs">
            <span className="text-[#fdfdfd] text-[13px] sm:text-[15px] lg:text-[16px] font-semibold uppercase tracking-wide font-inter leading-[17.6px] whitespace-nowrap select-none">
              &ldquo;{hero.badge}&rdquo;
            </span>
          </div>
        )}
        
        {/* Main Title */}
        <h1 className="font-playfair font-semibold text-[38px] sm:text-[54px] md:text-[64px] lg:text-[72px] leading-[1.15] sm:leading-[1.18] lg:leading-[90px] tracking-[-1.44px] text-white max-w-[976px] mb-6 drop-shadow-sm">
          {hero.title}
        </h1>
        
        {/* Subtitle / Paragraph */}
        {hero.subtitle && (
          <p className="font-inter font-normal text-[16px] sm:text-[18px] lg:text-[20px] leading-[26px] sm:leading-[28px] lg:leading-[30px] text-white max-w-[743px] mb-10 lg:mb-12 drop-shadow-sm">
            {hero.subtitle}
          </p>
        )}
        
        {/* Actions / Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-[12px] font-source">
          <Link 
            href={hero.actionUrl || '/fellowships'} 
            className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a6e0] text-white text-[16px] font-semibold leading-[24px] px-[24px] py-[14px] rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {hero.actionText || 'Apply for Fellowship'}
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center justify-center bg-[#f9fafb] hover:bg-white text-[#4a5565] border border-[#e5e7eb] text-[16px] font-semibold leading-[24px] px-[24px] py-[14px] rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Learn About IILP
          </Link>
        </div>
      </div>

      {/* Bottom Gradient - smoothly transitions to white section below */}
      <div 
        className="absolute bottom-0 left-0 w-full h-[192px] bg-gradient-to-b from-transparent to-white pointer-events-none z-10"
        data-node-id="103:249"
      />
    </section>
  );
}
