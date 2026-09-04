import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative w-full min-h-[100vh] lg:h-[1100px] flex flex-col items-center pt-[200px] lg:pt-[280px] pb-[200px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/hero-bg-final.png" 
          alt="IILP Students"
          fill
          priority
          className="object-cover object-top"
        />
      </div>

      {/* Bottom White Gradient to blend with next section */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] lg:h-[400px] bg-gradient-to-t from-white via-white/80 to-transparent z-0"></div>

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-[1000px]">
        
        {/* Top Badge */}
        <div className="inline-block border border-[#e6f9ff] rounded-full px-[12px] py-[8px] mb-6 backdrop-blur-sm bg-black/10">
          <span className="text-[#fdfdfd] text-[14px] lg:text-[16px] font-semibold uppercase tracking-wide">
            "Knowledge, Justice, and Leadership for Global Change."
          </span>
        </div>
        
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl lg:text-[72px] font-semibold tracking-[-1.44px] text-white mb-6 font-serif leading-[1.1] lg:leading-[90px] w-full lg:w-[976px] max-w-full">
          International Institute for Law and Politics (IILP)
        </h1>
        
        {/* Subtitle / Paragraph */}
        <p className="text-lg lg:text-[20px] text-white font-normal mb-12 w-full lg:w-[743px] max-w-full leading-[1.5] lg:leading-[30px] drop-shadow-md">
          The International Institute for Law and Politics (IILP) is an independent, non-profit academic, research, policy, and leadership institute committed to strengthening the discourse, learning, and practice of international law, governance, politics, human rights, and humanitarian affairs.
        </p>
        
        {/* Actions / Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/fellowships" 
            className="inline-flex items-center justify-center rounded-full bg-[#00BFFF] px-[24px] py-[14px] text-[16px] font-semibold text-white shadow-sm hover:bg-[#00a3d9] transition-colors"
          >
            Apply for Fellowship
          </Link>
          <Link 
            href="/about" 
            className="inline-flex items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB] px-[24px] py-[14px] text-[16px] font-semibold text-[#4A5565] shadow-sm hover:bg-white transition-colors"
          >
            Learn About IILP
          </Link>
        </div>
      </div>
    </section>
  );
}
