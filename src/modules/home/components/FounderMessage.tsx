import Link from 'next/link';
import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface FounderMetadata extends Record<string, unknown> {
  authorName?: string;
  authorRole?: string;
  authorInitials?: string;
  signatureImage?: string;
}

interface FounderMessageProps {
  data?: Partial<PageSectionData>;
}

export function FounderMessage({ data }: FounderMessageProps) {
  const defaultFounder = {
    badge: 'From the Founder',
    title: "Founder's Message",
    subtitle:
      'IILP was established upon a straightforward yet ambitious principle: knowledge must serve humanity. Knowledge is power, and that power cannot be siloed within academia or confined to intellectual discussions alone.',
    bgImage: '/assets/founder-main.png',
    actionText: "Read Full Founder's Message →",
    actionUrl: '/about#founder-message',
    metadata: {
      authorName: 'Mohammed Siraj',
      authorRole: 'Founder & President, IILP',
      authorInitials: 'MS',
      signatureImage: '/assets/founder-signature.png',
    } as FounderMetadata,
  };

  const section = {
    badge: data?.badge ?? defaultFounder.badge,
    title: data?.title ?? defaultFounder.title,
    subtitle: data?.subtitle ?? defaultFounder.subtitle,
    bgImage: data?.bgImage || defaultFounder.bgImage,
    actionText: data?.actionText || defaultFounder.actionText,
    actionUrl:
      data?.actionUrl && data.actionUrl !== '/founder'
        ? data.actionUrl
        : defaultFounder.actionUrl,
    metadata: (data?.metadata as FounderMetadata) || defaultFounder.metadata,
  };

  const metadata = (section.metadata as FounderMetadata) || defaultFounder.metadata;

  const authorName = metadata.authorName || defaultFounder.metadata.authorName || 'Mohammed Siraj';
  const authorRole = metadata.authorRole || defaultFounder.metadata.authorRole;
  const authorInitials = metadata.authorInitials || defaultFounder.metadata.authorInitials;
  const signatureImage = metadata.signatureImage || defaultFounder.metadata.signatureImage;

  return (
    <section className="w-full bg-[#e6f9ff] py-12 sm:py-16 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10 sm:gap-[60px] lg:gap-[80px] items-center">
        
        {/* Header */}
        <div className="flex flex-col gap-3 sm:gap-[16px] items-center text-center">
          {section.badge && (
            <div className="border border-[#00698c] rounded-full px-3.5 py-1.5 sm:px-[12px] sm:py-[8px]">
              <span className="font-inter font-semibold text-xs sm:text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                {section.badge}
              </span>
            </div>
          )}

          <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] text-[#0a0d12] tracking-[-0.72px]">
            {section.title || defaultFounder.title}
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col lg:flex-row items-start w-full gap-8 sm:gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Image & Author Info */}
          <div className="w-full lg:w-[580px] flex flex-col gap-6 sm:gap-[32px] items-start shrink-0 relative">
            {/* Main Image */}
            <div className="relative w-full aspect-[580/663] overflow-hidden rounded-xs">
              <Image 
                src={section.bgImage || defaultFounder.bgImage} 
                alt={authorName} 
                fill 
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
                priority
              />

              {/* Signature Watermark Overlay */}
              {signatureImage && (
                <div className="absolute right-0 sm:right-[-40px] bottom-2 sm:bottom-[40px] w-[200px] sm:w-[380px] h-[120px] sm:h-[240px] opacity-25 pointer-events-none z-10">
                  <Image 
                    src={signatureImage} 
                    alt="Signature" 
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Author Badge */}
            <div className="flex items-center gap-[12px]">
              <div 
                className="w-10 h-10 sm:w-[48px] sm:h-[48px] rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)" }}
              >
                <span className="font-playfair font-bold text-white text-sm sm:text-[16px] leading-none">
                  {authorInitials}
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-lg sm:text-[24px] leading-tight text-[#000080]">
                  {authorName}
                </h3>
                <p className="font-inter font-normal text-xs sm:text-[12px] leading-tight text-[#6a7282] mt-0.5">
                  {authorRole}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Text */}
          <div className="w-full flex-1 flex flex-col items-start pt-0 lg:pt-10">
            {/* Decorative Quote Mark */}
            <div className="flex items-center opacity-20">
              <span className="font-playfair text-4xl sm:text-[60px] leading-none text-[#000080]">
                &ldquo;
              </span>
            </div>
            
            {/* Quote Paragraph */}
            <p className="font-['Soria',var(--font-playfair),serif] font-bold text-lg sm:text-xl md:text-[24px] leading-relaxed sm:leading-[38px] text-[#000080] max-w-[768px] mt-2">
              {section.subtitle || defaultFounder.subtitle}
            </p>

            {/* Link */}
            {section.actionUrl && (
              <Link 
                href={section.actionUrl} 
                className="inline-flex items-center gap-1.5 mt-5 sm:mt-6 font-inter font-semibold text-sm leading-[20px] text-[#00bfff] hover:text-[#00a2d6] transition-colors min-h-[44px]"
              >
                {section.actionText || defaultFounder.actionText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
