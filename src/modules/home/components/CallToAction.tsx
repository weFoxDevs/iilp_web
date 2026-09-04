import Link from 'next/link';
import Image from 'next/image';

export function CallToAction() {
  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center py-24 lg:py-[100px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/cta-bg.png" 
          alt="CTA Background" 
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center justify-center gap-[56px]">
        
        <div className="flex flex-col items-center gap-[24px] max-w-[1080px]">
          {/* Pill Label */}
          <div className="px-3 py-2 rounded-full border border-[#33CCFF] bg-[#E6F9FF]/10">
            <span className="text-white font-semibold text-[16px] leading-[17.6px] uppercase whitespace-nowrap">
              Start Your Journey
            </span>
          </div>
          
          {/* Main Content */}
          <div className="flex flex-col items-center gap-[16px]">
            <h2 className="font-serif font-medium text-[36px] leading-[44px] text-[#0a0d12] tracking-[-0.72px] text-center max-w-[1000px]">
              Join the IILP Community Today
            </h2>
            <p className="font-['Adamina'] text-[20px] leading-[30px] text-[#E4E3FC] text-center max-w-[800px] tracking-[0.2px]">
              Whether you are a scholar, practitioner, policymaker, or supporter — your involvement is invaluable to creating a better, more informed, and more equitable future.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link 
            href="/partner" 
            className="flex items-center justify-center px-6 py-3.5 bg-[#1E2939] hover:bg-slate-800 text-white font-semibold text-[16px] rounded-full shadow-sm transition-colors w-full sm:w-auto"
          >
            Partner with Us
          </Link>
          <Link 
            href="/donate" 
            className="flex items-center justify-center px-6 py-3.5 bg-[#F9FAFB] hover:bg-gray-100 border border-[#E5E7EB] text-[#4A5565] font-semibold text-[16px] rounded-full shadow-sm transition-colors w-full sm:w-auto"
          >
            Donate to Support IILP
          </Link>
        </div>
        
      </div>
    </section>
  );
}
