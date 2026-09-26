import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface LeadershipTier {
  title: string;
  desc: string;
}

const defaultLeadershipTiers: LeadershipTier[] = [
  {
    title: 'Founding Authority',
    desc: 'Founder & President — visionary and strategic authority',
  },
  {
    title: 'Governing Council',
    desc: 'Highest governing and decision-making body',
  },
  {
    title: 'Executive Directorate Board',
    desc: 'Operational leadership and program delivery',
  },
  {
    title: 'Academic Senate',
    desc: 'Principal academic and intellectual authority',
  },
  {
    title: 'ICT & Media Cell',
    desc: 'Digital presence, media and communications',
  },
  {
    title: 'Advisory Board',
    desc: 'External strategic and intellectual guidance',
  },
  {
    title: 'Global Fellowship Network',
    desc: 'International scholarly community',
  },
  {
    title: 'Ethics & Accountability Commission',
    desc: 'Institutional integrity and ethical governance',
  },
  {
    title: 'Youth Leadership Assembly',
    desc: 'Youth participation and leadership development',
  },
];

interface LeadershipStructureProps {
  data?: Partial<PageSectionData>;
}

export default function LeadershipStructure({ data }: LeadershipStructureProps) {
  const badge = data?.badge ?? 'How We Are Governed';
  const title = data?.title ?? 'Multi-Tiered Leadership Structure';
  const subtitle =
    data?.subtitle ??
    'The Institute is governed through a multi-tiered leadership structure that combines strategic oversight, operational management, academic leadership, and institutional development.';

  const tiersList: LeadershipTier[] =
    Array.isArray(data?.metadata?.tiers) && data.metadata.tiers.length > 0
      ? (data.metadata.tiers as LeadershipTier[])
      : defaultLeadershipTiers;

  const image1 =
    (typeof data?.metadata?.image1 === 'string' && data.metadata.image1) ||
    '/assets/about-institutional-1.png';
  const image2 =
    (typeof data?.metadata?.image2 === 'string' && data.metadata.image2) ||
    '/assets/about-institutional-2.png';

  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 sm:gap-12 lg:gap-[80px]">
        
        {/* Left Side: Overlapping Images and Stamp Badge */}
        <div className="w-full lg:w-[590px] h-[360px] sm:h-[500px] lg:h-[600px] relative shrink-0 mx-auto max-w-[590px]">
          {/* Top Left Image: Professor & Student */}
          <div className="w-[62%] sm:w-[348px] h-[250px] sm:h-[400px] lg:h-[448px] relative overflow-hidden shadow-sm rounded-lg sm:rounded-none">
            <Image
              src={image1}
              alt="Faculty and student in discussion"
              fill
              sizes="(max-width: 768px) 60vw, 348px"
              className="object-cover"
            />
          </div>

          {/* Bottom Right Overlapping Image: Female Student */}
          <div className="w-[60%] sm:w-[348px] h-[190px] sm:h-[310px] lg:h-[358px] absolute right-0 sm:left-[242px] bottom-0 overflow-hidden border-[3px] sm:border-[4px] border-white shadow-xl rounded-lg sm:rounded-none">
            <Image
              src={image2}
              alt="Smiling IILP student"
              fill
              sizes="(max-width: 768px) 60vw, 348px"
              className="object-cover"
            />
          </div>

          {/* Circular Heritage Badge */}
          <div className="absolute right-2 sm:right-auto sm:left-[410px] top-[16px] sm:top-[60px] w-[80px] sm:w-[120px] h-[80px] sm:h-[120px] rounded-full bg-white border border-[#641320] flex items-center justify-center shadow-lg z-20">
            {/* Center Wreath Icon */}
            <div className="relative w-[36px] sm:w-[62px] h-[28px] sm:h-[50px] z-10">
              <Image
                src="/assets/about-badge-icon.svg"
                alt="Heritage award icon"
                fill
                className="object-contain"
              />
            </div>

            {/* Circular Rotating Badge Text */}
            <div className="absolute inset-[-6px] sm:inset-[-12px] flex items-center justify-center animate-[spin_25s_linear_infinite] pointer-events-none">
              <Image
                src="/assets/about-badge-text.png"
                alt="Next-Gen Toward Education Since 1995"
                width={140}
                height={140}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Content & Leadership Tiers */}
        <div className="flex-1 w-full flex flex-col gap-8 lg:gap-[40px]">
          
          {/* Header Block */}
          <div className="flex flex-col gap-4 items-start">
            {badge && (
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-[1.25]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* 9 Leadership Tier Cards */}
          <div className="flex flex-col gap-4 lg:gap-[24px] w-full">
            {tiersList.map((tier, index) => (
              <div 
                key={index}
                className="bg-[#e6f9ff] border border-[#b0ebff] p-5 lg:p-[24px] flex flex-col gap-1 transition-all hover:border-[#00bfff]/60 hover:shadow-xs"
              >
                <h3 className="text-[#000080] text-lg md:text-xl lg:text-[24px] font-serif font-bold tracking-tight leading-tight">
                  {tier.title}
                </h3>
                <p className="text-[#000036]/70 text-sm md:text-[16px] lg:text-[18px] font-sans">
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>

        </div>


      </div>
    </section>
  );
}
