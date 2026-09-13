import Image from 'next/image';

export default function LeadershipDirectoryHero() {
  return (
    <section className="relative w-full min-h-[550px] lg:h-[650px] overflow-hidden flex flex-col items-center justify-center pt-[140px] pb-[160px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] text-center isolate">
      {/* Background Image with Dark & Gradient Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/leadership-directory-hero.png"
          alt="IILP Leadership Directory"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Figma linear gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/20" />
        {/* Soft bottom white blend */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-white" />
      </div>

      {/* Content Container */}
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-4 relative z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center border border-[#e6f9ff] rounded-full px-3.5 py-2 backdrop-blur-xs bg-black/10">
          <span className="text-xs sm:text-sm md:text-[16px] font-semibold tracking-wider text-[#fdfdfd] uppercase leading-[17.6px]">
            Leadership
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-serif font-semibold text-white tracking-[-0.96px] leading-[1.2] max-w-[800px]">
          Leadership Directory
        </h1>

        {/* Supporting Text */}
        <p className="text-white/95 text-base sm:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[30px] font-sans max-w-[978px] mt-2 drop-shadow-xs">
          Individual profiles for all 18 leadership roles within the International Institute for Law and Politics, from the Founder &amp; President to departmental officers.
        </p>
      </div>
    </section>
  );
}
