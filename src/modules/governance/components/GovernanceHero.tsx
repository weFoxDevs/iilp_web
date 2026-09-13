import Image from 'next/image';

export default function GovernanceHero() {
  return (
    <section className="relative w-full min-h-[600px] lg:h-[750px] flex flex-col items-center justify-center pt-[180px] lg:pt-[220px] pb-[140px] lg:pb-[200px] overflow-hidden">
      {/* Background Image from Figma */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/about-hero-bg.png"
          alt="IILP Governance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Figma gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-white/60" />
      </div>

      {/* Bottom fade to blend seamlessly into the next page section */}
      <div className="absolute bottom-0 left-0 w-full h-[140px] bg-gradient-to-b from-transparent to-white z-0 pointer-events-none" />

      {/* Content Container */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-[1000px]">
        {/* Badge */}
        <div className="inline-flex items-center justify-center border border-[#e6f9ff]/80 rounded-full px-4 py-1.5 mb-4 backdrop-blur-sm bg-black/15 shadow-xs">
          <span className="text-[#fdfdfd] text-sm md:text-[15px] font-semibold uppercase tracking-wider font-inter">
            GOVERNANCE
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-[48px] font-semibold text-white tracking-[-0.96px] text-center font-serif leading-[1.2] mb-5 drop-shadow-md">
          Multi-Tiered Governance Structure
        </h1>

        {/* Supporting text */}
        <p className="text-base md:text-lg lg:text-[20px] text-white font-normal text-center max-w-[978px] leading-relaxed lg:leading-[30px] drop-shadow font-inter">
          IILP operates through a structured governance and leadership system designed to ensure academic excellence, institutional accountability, strategic effectiveness, and long-term sustainability.
        </p>
      </div>
    </section>
  );
}
