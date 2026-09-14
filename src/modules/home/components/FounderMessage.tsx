import Link from 'next/link';
import Image from 'next/image';

export function FounderMessage() {
  return (
    <section className="w-full bg-[#e6f9ff] py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[60px] lg:gap-[80px] items-center">
        
        {/* Header */}
        <div className="flex flex-col gap-[16px] items-center text-center">
          <div className="border border-[#00698c] rounded-full px-[12px] py-[8px]">
            <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
              From the Founder
            </span>
          </div>

          <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] text-[#0a0d12] tracking-[-0.72px]">
            Founder&apos;s Message
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col lg:flex-row items-start w-full gap-12 lg:gap-[80px] relative">
          
          {/* Left Column: Image & Author Info */}
          <div className="w-full lg:w-[580px] flex flex-col gap-[32px] items-start shrink-0 relative">
            {/* Main Image */}
            <div className="relative w-full aspect-[580/663] overflow-hidden">
              <Image 
                src="/assets/founder-main.png" 
                alt="Mohammed Siraj" 
                fill 
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
                priority
              />

              {/* Signature Watermark Overlay */}
              <div className="absolute right-[-20px] sm:right-[-40px] bottom-[20px] sm:bottom-[40px] w-[280px] sm:w-[380px] h-[180px] sm:h-[240px] opacity-25 pointer-events-none z-10">
                <Image 
                  src="/assets/founder-signature.png" 
                  alt="Signature" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Author Badge */}
            <div className="flex items-center gap-[12px]">
              <div 
                className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)" }}
              >
                <span className="font-playfair font-bold text-white text-[16px] leading-[25.6px]">MS</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-[24px] leading-normal text-[#000080]">
                  Mohammed Siraj
                </h3>
                <p className="font-inter font-normal text-[12px] leading-[16px] text-[#6a7282]">
                  Founder & President, IILP
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Text */}
          <div className="w-full flex-1 flex flex-col items-start pt-0 lg:pt-10">
            {/* Decorative Quote Mark */}
            <div className="flex items-center opacity-20">
              <span className="font-playfair text-[60px] leading-[60px] text-[#000080]">
                &ldquo;
              </span>
            </div>
            
            {/* Quote Paragraph */}
            <p className="font-['Soria',var(--font-playfair),serif] font-bold text-[20px] sm:text-[24px] leading-[32px] sm:leading-[38px] text-[#000080] max-w-[768px] mt-2">
              IILP was established upon a straightforward yet ambitious principle: knowledge must serve humanity. Knowledge is power, and that power cannot be siloed within academia or confined to intellectual discussions alone.
            </p>

            {/* Link */}
            <Link 
              href="/founder" 
              className="inline-flex items-center gap-1.5 mt-6 font-inter font-semibold text-[14px] leading-[20px] text-[#00bfff] hover:text-[#00a2d6] transition-colors"
            >
              Read Full Founder&apos;s Message →
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
