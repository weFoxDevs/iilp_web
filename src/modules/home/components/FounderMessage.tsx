import Link from 'next/link';
import Image from 'next/image';

export function FounderMessage() {
  return (
    <section className="bg-[#E6F9FF] py-24 lg:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center gap-16 lg:gap-20">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-block border border-[#00698C] rounded-full px-3 py-1.5">
            <span className="text-[#0A0D12] text-sm font-semibold uppercase tracking-wide">
              From the Founder
            </span>
          </div>
          <h2 className="font-serif font-medium text-4xl lg:text-[44px] text-[#0A0D12] tracking-tight">
            Founder&apos;s Message
          </h2>
        </div>

        {/* Content Wrapper */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start w-full max-w-6xl mx-auto gap-12 lg:gap-24 relative">
          
          {/* Left Column: Image & Author Info */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 relative z-10">
            {/* Main Image */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
              <Image 
                src="/assets/founder-main.png" 
                alt="Mohammed Siraj" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            {/* Signature Overlay - Absolute positioned over the bottom right of the image */}
            <div className="absolute -right-16 bottom-20 w-48 h-32 md:w-64 md:h-48 opacity-30 pointer-events-none hidden md:block">
              <Image 
                src="/assets/founder-signature.png" 
                alt="Signature" 
                fill
                className="object-contain"
              />
            </div>

            {/* Author Badge */}
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)" }}
              >
                <span className="font-serif font-bold text-white tracking-wider">MS</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif font-bold text-2xl text-[#000080]">
                  Mohammed Siraj
                </h3>
                <p className="text-sm text-[#6A7282]">
                  Founder & President, IILP
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Quote Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 pt-0 lg:pt-12 relative z-10">
            {/* Large Decorative Quote */}
            <div className="flex w-full justify-center lg:justify-start">
              <span className="font-serif text-[80px] leading-[60px] text-[#000080] opacity-20">
                &quot;
              </span>
            </div>
            
            {/* Quote Paragraph */}
            <p className="font-serif font-bold text-2xl md:text-[28px] leading-snug text-[#000080]">
              IILP was established upon a straightforward yet ambitious principle: knowledge must serve humanity. Knowledge is power, and that power cannot be siloed within academia or confined to intellectual discussions alone.
            </p>

            {/* Link */}
            <Link 
              href="/founder" 
              className="inline-flex items-center gap-2 mt-4 text-[#00BFFF] font-semibold text-sm hover:text-[#00a3d9] transition-colors"
            >
              Read Full Founder&apos;s Message 
              <span>&rarr;</span>
            </Link>
          </div>
          
        </div>
      </div>
    </section>
  );
}
