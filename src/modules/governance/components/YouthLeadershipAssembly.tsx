import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

const ASSEMBLY_FUNCTIONS: string[] = [
  'Represent youth perspectives within institutional discussions and initiatives.',
  'Organize leadership development programs, workshops, and training activities.',
  'Promote youth participation in research, policy dialogue, and public engagement.',
  'Support community service and civic engagement initiatives.',
  'Encourage innovation, critical thinking, and responsible leadership among young people.',
  'Develop pathways for future scholars, researchers, professionals, and institutional leaders.',
];

interface YouthLeadershipAssemblyProps {
  data?: Partial<PageSectionData>;
}

export default function YouthLeadershipAssembly({ data }: YouthLeadershipAssemblyProps) {
  const badge = data?.badge ?? 'Youth Engagement';
  const title = data?.title ?? 'Youth Leadership Assembly';
  const subtitle =
    data?.subtitle ??
    "The Youth Leadership Assembly serves as the Institute's primary platform for youth participation, leadership development, and civic engagement.";
  const bgImage = data?.bgImage || '/assets/governance-advisory-student.png';

  const functionsList: string[] =
    Array.isArray(data?.metadata?.functions) && data.metadata.functions.length > 0
      ? (data.metadata.functions as string[])
      : ASSEMBLY_FUNCTIONS;

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-[80px]">
        
        {/* Left Column: Image with Floating Student Rating Badge */}
        <div className="w-full lg:flex-1 h-[520px] sm:h-[620px] lg:h-[700px] relative overflow-hidden self-stretch">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 580px"
            className="object-cover"
          />

          {/* Floating Rating Badge */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:p-4 flex items-center gap-3.5 shadow-lg">
            {/* Overlapping Avatars */}
            <div className="flex items-center -space-x-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/assets/about-rating-avatar-1.png"
                  alt="Student avatar 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/assets/about-rating-avatar-2.png"
                  alt="Student avatar 2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                <Image
                  src="/assets/about-rating-avatar-3.png"
                  alt="Student avatar 3"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Rating Text */}
            <div className="flex flex-col text-white">
              <span className="text-base font-semibold leading-tight font-sans">
                5000
              </span>
              <span className="text-xs text-white/90 font-sans mt-0.5">
                Student ratings
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Heading and Functions Box */}
        <div className="w-full lg:flex-1 flex flex-col gap-8 lg:gap-[40px] items-start">
          <div className="flex flex-col gap-6 lg:gap-[30px] items-start">
            <div className="flex flex-col gap-4 items-start">
              {badge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                  <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                    {badge}
                  </span>
                </div>
              )}

              <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[44px] max-w-[580px]">
                {title}
              </h2>
            </div>

            {subtitle && (
              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans">
                {subtitle}
              </p>
            )}
          </div>

          {/* Functions Card Box */}
          <div className="w-full bg-[#e6f9ff] border border-[#b0ebff] p-6 lg:p-[30px] flex flex-col gap-6">
            <h3 className="text-xl lg:text-[24px] font-serif font-bold text-[#000080] leading-normal">
              Assembly Functions
            </h3>

            <div className="flex flex-col gap-4 w-full">
              {functionsList.map((func, index) => (
                <div key={index} className="flex items-start gap-4 w-full">
                  <div className="relative w-6 h-6 shrink-0 mt-0.5">
                    <Image
                      src="/assets/checkmark-circle-sky.svg"
                      alt="Checkmark"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="flex-1 text-[#00506b] text-base md:text-[18px] leading-[28px] font-sans font-normal">
                    {func}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
