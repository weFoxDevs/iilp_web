import Link from 'next/link';
import Image from 'next/image';

export function CallToAction() {
  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center py-24 lg:py-[120px] min-h-[500px] lg:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/cta-bg.png" 
          alt="Join the IILP Community Today" 
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-10 lg:gap-[56px]">
        
        <div className="flex flex-col items-center gap-6 max-w-[1080px]">
          {/* Pill Tag */}
          <div className="px-3.5 py-2 rounded-full border border-[#33ccff] bg-[#e6f9ff]/10 backdrop-blur-xs">
            <span className="text-white font-inter font-semibold text-sm md:text-[16px] leading-[17.6px] uppercase tracking-wider whitespace-nowrap">
              Start Your Journey
            </span>
          </div>
          
          {/* Main Title & Paragraph */}
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-serif font-medium text-3xl md:text-4xl lg:text-[36px] leading-tight lg:leading-[44px] text-gray-950 tracking-[-0.72px] text-center max-w-[1000px]">
              Join the IILP Community Today
            </h2>
            <p className="font-sans text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#e4e3fc] drop-shadow-sm text-center max-w-[800px] tracking-[0.2px]">
              Whether you are a scholar, practitioner, policymaker, or supporter — your involvement is invaluable to creating a better, more informed, and more equitable future.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 font-sans">
          <Link 
            href="/partner" 
            className="flex items-center justify-center px-6 py-3.5 bg-[#1e2939] hover:bg-black text-white font-semibold text-[16px] rounded-full shadow-sm transition-colors w-full sm:w-auto"
          >
            Partner with Us
          </Link>
          <Link 
            href="/donate" 
            className="flex items-center justify-center px-6 py-3.5 bg-white hover:bg-gray-100 border border-[#e5e7eb] text-gray-900 font-semibold text-[16px] rounded-full shadow-sm transition-colors w-full sm:w-auto"
          >
            Donate to Support IILP
          </Link>
        </div>
        
      </div>
    </section>
  );
}

export default CallToAction;
