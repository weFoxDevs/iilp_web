import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";

interface StatItem {
  number: string;
  label: string;
  progress: string;
}

const defaultStats: StatItem[] = [
  { number: "6+", label: "Academic Departments", progress: "58%" },
  { number: "18+", label: "Leadership Positions", progress: "58%" },
  { number: "3+", label: "Fellowship Types", progress: "58%" },
  { number: "5+", label: "Partnership Tracks", progress: "58%" },
];

interface MissionVisionProps {
  data?: Partial<PageSectionData>;
  missionData?: Partial<PageSectionData>;
  visionData?: Partial<PageSectionData>;
}

export function MissionVision({ data, missionData, visionData }: MissionVisionProps) {
  // Mission resolution (prefers missionData, falls back to legacy data or defaults)
  const mission = {
    badge: missionData?.badge ?? data?.badge ?? "Our Mission",
    title: missionData?.title ?? data?.title ?? "Advancing Interdisciplinary Scholarship",
    subtitle:
      missionData?.subtitle ??
      data?.subtitle ??
      "The mission of the International Institute for Law and Politics is to advance interdisciplinary scholarship, strengthen evidence-based policymaking, foster ethical leadership, and contribute to the development of informed and resilient institutions capable of addressing contemporary global challenges.",
    image:
      ((missionData?.bgImage as string) ||
      (missionData?.metadata?.missionImage as string) ||
      (data?.metadata?.missionImage as string) ||
      "/assets/about-vision-students.png") as string,
  };

  // Vision resolution (prefers visionData, falls back to legacy metadata or defaults)
  const legacyMeta = (data?.metadata || {}) as Record<string, any>;
  const visionMeta = (visionData?.metadata || {}) as Record<string, any>;

  const vision = {
    badge:
      (visionData?.badge as string) ||
      (visionMeta.visionBadge as string) ||
      (legacyMeta.visionBadge as string) ||
      "Our Vision",
    title:
      (visionData?.title as string) ||
      (visionMeta.visionTitle as string) ||
      (legacyMeta.visionTitle as string) ||
      "A Globally Respected Centre of Excellence",
    subtitle:
      (visionData?.subtitle as string) ||
      (visionMeta.visionSubtitle as string) ||
      (legacyMeta.visionSubtitle as string) ||
      "To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.",
    image:
      ((visionData?.bgImage as string) ||
      (visionMeta.visionImage as string) ||
      (legacyMeta.visionImage as string) ||
      "/assets/about-mission-student.png") as string,
    studentRatingsCount:
      visionMeta.studentRatingsCount ||
      legacyMeta.studentRatingsCount ||
      "5000",
    studentRatingsLabel:
      visionMeta.studentRatingsLabel ||
      legacyMeta.studentRatingsLabel ||
      "Student ratings",
    stats:
      (visionMeta.stats as StatItem[]) ||
      (legacyMeta.stats as StatItem[]) ||
      defaultStats,
  };

  const stats = vision.stats;

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 sm:gap-16 lg:gap-[120px]">
        
        {/* Top Two-Column Grid for Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-[80px] items-start">
          
          {/* Column 1 (Left): Image on top, Mission Content on bottom */}
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-[120px]">
            {/* Top: Image with Overlapping Badges */}
            <div className="relative w-full aspect-[540/600] overflow-hidden rounded-xs">
              <Image
                src={mission.image}
                alt="IILP Students on campus"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
                priority
              />

              {/* Overlapping Award Badges at top-left */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center">
                {/* Badge 1: Ultra Award */}
                <div className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
                  <div className="relative w-[36px] sm:w-[60px] h-[20px] sm:h-[30px]">
                    <Image
                      src="/assets/about-vision-badge-1.svg"
                      alt="Ultra Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Badge 2: Hyper Best Award (overlaps badge 1) */}
                <div className="w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] -ml-3 sm:-ml-4 rounded-full bg-[#c3f499] flex items-center justify-center shadow-md">
                  <div className="relative w-[38px] sm:w-[63px] h-[20px] sm:h-[30px]">
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
            <div className="flex flex-col gap-4 sm:gap-[30px] items-start">
              {mission.badge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-[1000px] px-[12px] py-[6px] sm:py-[8px]">
                  <span className="font-inter font-semibold text-xs sm:text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                    {mission.badge}
                  </span>
                </div>
              )}

              <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12]">
                {mission.title}
              </h2>

              <p className="font-source font-normal text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]/70">
                {mission.subtitle}
              </p>
            </div>
          </div>

          {/* Column 2 (Right): Vision Content on top, Image with Ratings on bottom */}
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-[120px] self-stretch justify-between">
            {/* Top: Our Vision Content */}
            <div className="flex flex-col gap-4 sm:gap-[30px] items-start">
              {vision.badge && (
                <div className="inline-flex items-center border border-[#00698c] rounded-[1000px] px-[12px] py-[6px] sm:py-[8px]">
                  <span className="font-inter font-semibold text-xs sm:text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                    {vision.badge}
                  </span>
                </div>
              )}

              <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12]">
                {vision.title}
              </h2>

              <p className="font-source font-normal text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]/70">
                {vision.subtitle}
              </p>
            </div>

            {/* Bottom: Image with Student Ratings Card */}
            <div className="relative w-full aspect-[540/600] lg:aspect-[580/690] overflow-hidden rounded-xs">
              <Image
                src={vision.image}
                alt="Student with laptop and phone"
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
                priority
              />

              {/* Floating Ratings Card - Fluid on mobile */}
              <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-black/55 backdrop-blur-md border border-white/20 rounded-[10px] p-2.5 sm:p-[15px] flex items-center gap-3 sm:gap-[15px] shadow-xl w-auto max-w-[calc(100%-2rem)] h-auto sm:h-[80px]">
                {/* Overlapping Avatars */}
                <div className="relative flex items-center -space-x-2 shrink-0">
                  <div className="relative w-8 h-8 sm:w-[50px] sm:h-[50px] rounded-full overflow-hidden border border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-1.png"
                      alt="Student reviewer 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-8 h-8 sm:w-[50px] sm:h-[50px] rounded-full overflow-hidden border border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-2.png"
                      alt="Student reviewer 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-8 h-8 sm:w-[50px] sm:h-[50px] rounded-full overflow-hidden border border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-3.png"
                      alt="Student reviewer 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Rating details */}
                <div className="flex flex-col font-inter text-white min-w-0">
                  <span className="font-medium text-xs sm:text-[16px] leading-tight">
                    {vision.studentRatingsCount}
                  </span>
                  <span className="font-normal text-[11px] sm:text-[16px] leading-tight text-white/90 mt-0.5 sm:mt-[5px] truncate">
                    {vision.studentRatingsLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 xl:gap-12 w-full pt-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-4 sm:gap-[40px] items-start w-full">
              {/* Number and Label container */}
              <div className="flex flex-col gap-1 sm:gap-[5px] items-start w-full">
                <div className="font-inter font-semibold text-3xl sm:text-5xl lg:text-[64px] leading-none text-[#00506b]">
                  {stat.number}
                </div>
                <p className="font-inter font-normal text-xs sm:text-base md:text-lg lg:text-[20px] leading-snug sm:leading-[30px] text-[#0a0d12]/70">
                  {stat.label}
                </p>
              </div>

              {/* Progress Line */}
              <div className="w-full max-w-[243px] h-[2px] bg-[#8ae2ff] relative overflow-hidden">
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
