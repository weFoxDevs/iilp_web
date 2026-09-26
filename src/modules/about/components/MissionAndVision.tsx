import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface StatItem {
  number: string;
  label: string;
  progress: string;
}

const defaultStats: StatItem[] = [
  { number: '6+', label: 'Academic Departments', progress: '58%' },
  { number: '18+', label: 'Leadership Positions', progress: '58%' },
  { number: '3+', label: 'Fellowship Types', progress: '58%' },
  { number: '5+', label: 'Partnership Tracks', progress: '58%' },
];

interface MissionAndVisionProps {
  data?: Partial<PageSectionData>;
  missionData?: Partial<PageSectionData>;
  visionData?: Partial<PageSectionData>;
}

export default function MissionAndVision({ data, missionData, visionData }: MissionAndVisionProps) {
  const legacyMeta = (data?.metadata || {}) as Record<string, any>;
  const visionMeta = (visionData?.metadata || {}) as Record<string, any>;

  const missionBadge = missionData?.badge ?? data?.badge ?? 'Our Mission';
  const missionTitle = missionData?.title ?? data?.title ?? 'Advancing Interdisciplinary Scholarship';
  const missionSubtitle =
    missionData?.subtitle ??
    data?.subtitle ??
    'The mission of the International Institute for Law and Politics is to advance interdisciplinary scholarship, strengthen evidence-based policymaking, foster ethical leadership, and contribute to the development of informed and resilient institutions capable of addressing contemporary global challenges.';
  const missionImage =
    ((missionData?.bgImage as string) ||
    (missionData?.metadata?.missionImage as string) ||
    (legacyMeta.missionImage as string) ||
    '/assets/about-vision-students.png') as string;

  const visionBadge =
    (visionData?.badge as string) ||
    (visionMeta.visionBadge as string) ||
    (legacyMeta.visionBadge as string) ||
    'Our Vision';
  const visionTitle =
    (visionData?.title as string) ||
    (visionMeta.visionTitle as string) ||
    (legacyMeta.visionTitle as string) ||
    'A Globally Respected Centre of Excellence';
  const visionSubtitle =
    (visionData?.subtitle as string) ||
    (visionMeta.visionSubtitle as string) ||
    (legacyMeta.visionSubtitle as string) ||
    'To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.';
  const visionImage =
    ((visionData?.bgImage as string) ||
    (visionMeta.visionImage as string) ||
    (legacyMeta.visionImage as string) ||
    '/assets/about-mission-student.png') as string;
  const studentRatingsCount =
    (visionMeta.studentRatingsCount as string) ||
    (legacyMeta.studentRatingsCount as string) ||
    '5000';
  const studentRatingsLabel =
    (visionMeta.studentRatingsLabel as string) ||
    (legacyMeta.studentRatingsLabel as string) ||
    'Student ratings';
  const stats =
    (visionMeta.stats as StatItem[]) ||
    (legacyMeta.stats as StatItem[]) ||
    defaultStats;

  return (
    <section className="w-full bg-[#e6f9ff] py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 sm:gap-16 lg:gap-[120px]">
        
        {/* Top Two-Column Grid for Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[80px] items-start">
          
          {/* Column 1 (Left) */}
          <div className="flex flex-col gap-12 lg:gap-[80px]">
            {/* Top: Image with Badges */}
            <div className="relative w-full aspect-[540/600] overflow-hidden shadow-sm">
              <Image
                src={missionImage}
                alt="IILP Students on campus"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />

              {/* Overlapping Floating Award Badges */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center">
                {/* Badge 1: Ultra Award */}
                <div className="w-[64px] h-[64px] sm:w-[95px] sm:h-[95px] rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
                  <div className="relative w-[38px] sm:w-[58px] h-[20px] sm:h-[30px]">
                    <Image
                      src="/assets/about-vision-badge-1.svg"
                      alt="Ultra Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Badge 2: Hyper Best (overlaps badge 1) */}
                <div className="w-[64px] h-[64px] sm:w-[95px] sm:h-[95px] -ml-3 sm:-ml-4 rounded-full bg-[#c3f499] flex items-center justify-center shadow-md">
                  <div className="relative w-[40px] sm:w-[62px] h-[20px] sm:h-[30px]">
                    <Image
                      src="/assets/about-vision-badge-2.svg"
                      alt="Hyper Best Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Our Mission Content */}
            <div className="flex flex-col gap-6 items-start">
              {missionBadge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                    {missionBadge}
                  </span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-[1.25]">
                {missionTitle}
              </h2>

              {missionSubtitle && (
                <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans">
                  {missionSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Column 2 (Right) */}
          <div className="flex flex-col gap-12 lg:gap-[80px]">
            {/* Top: Our Vision Content */}
            <div className="flex flex-col gap-6 items-start">
              {visionBadge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                    {visionBadge}
                  </span>
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-[1.25]">
                {visionTitle}
              </h2>

              {visionSubtitle && (
                <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans">
                  {visionSubtitle}
                </p>
              )}
            </div>

            {/* Bottom: Image with Student Ratings Card */}
            <div className="relative w-full aspect-[580/690] overflow-hidden shadow-sm">
              <Image
                src={visionImage}
                alt="Student with laptop and phone"
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
              />

              {/* Floating Ratings Card */}
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 max-w-[calc(100%-2rem)] bg-black/45 backdrop-blur-md border border-white/20 rounded-[10px] p-3 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-xl">
                {/* Overlapping Avatars */}
                <div className="flex items-center -space-x-3.5">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-1.png"
                      alt="Student reviewer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-2.png"
                      alt="Student reviewer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-3.png"
                      alt="Student reviewer"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Rating details */}
                <div className="flex flex-col pl-1 font-inter text-white">
                  <span className="text-base sm:text-lg font-semibold leading-tight">{studentRatingsCount}</span>
                  <span className="text-xs sm:text-sm text-white/90 leading-tight">{studentRatingsLabel}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 pt-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-3.5">
              {/* Number */}
              <div className="text-3xl sm:text-5xl lg:text-[64px] font-semibold text-[#00506b] font-inter leading-none">
                {stat.number}
              </div>

              {/* Label */}
              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] font-sans leading-snug">
                {stat.label}
              </p>

              {/* Progress Line */}
              <div className="w-full max-w-[243px] h-[2px] bg-[#8ae2ff] rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-[#00506b]" 
                  style={{ width: stat.progress }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
