import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface GlobalEngagementProps {
  data?: Partial<PageSectionData>;
}

const defaultBodyParagraphs = [
  'The International Institute for Law and Politics is committed to fostering meaningful international cooperation and intellectual exchange across disciplines, cultures, and regions.',
  'The Institute seeks to build a vibrant global network of scholars, researchers, universities, policymakers, civil society organizations, international institutions, and professionals dedicated to advancing justice, ethical governance, peace, human rights, and sustainable development.',
  'Through research collaboration, academic partnerships, professional exchanges, policy engagement, and leadership initiatives, IILP strives to contribute to informed global dialogue and evidence-based solutions addressing the complex challenges facing contemporary societies.',
];

const defaultCommitmentParagraphs = [
  'The International Institute for Law and Politics is committed to serving as a platform where ideas are transformed into knowledge, knowledge is translated into policy, and policy contributes to positive social change.',
  'By bringing together scholarship, leadership, and public engagement, the Institute seeks to make a meaningful contribution to the advancement of justice, responsible governance, human rights, humanitarian values, and sustainable development for present and future generations.',
];

const defaultRatingAvatars = [
  '/assets/about-rating-avatar-1.png',
  '/assets/about-rating-avatar-2.png',
  '/assets/about-rating-avatar-3.png',
];

export default function GlobalEngagement({ data }: GlobalEngagementProps) {
  const badge = data?.badge ?? 'Our Global Reach';
  const title = data?.title ?? 'Global Engagement';
  const bgImage = data?.bgImage || '/assets/about-mission-student.png';

  const bodyParagraphs = data?.bodyContent
    ? data.bodyContent.split('\n\n').filter(Boolean)
    : defaultBodyParagraphs;

  const meta = (data?.metadata || {}) as {
    commitmentTitle?: string;
    commitmentContent?: string;
    studentRatingsCount?: string;
    studentRatingsLabel?: string;
    ratingAvatars?: string[];
  };

  const commitmentTitle = meta.commitmentTitle || 'Institutional Commitment';
  const commitmentParagraphs = meta.commitmentContent
    ? meta.commitmentContent.split('\n\n').filter(Boolean)
    : defaultCommitmentParagraphs;
  const studentRatingsCount = meta.studentRatingsCount || '5000';
  const studentRatingsLabel = meta.studentRatingsLabel || 'Student ratings';
  const ratingAvatars = meta.ratingAvatars || defaultRatingAvatars;

  return (
    <section className="w-full bg-[#e6f9ff] py-16 lg:py-[140px] px-4 md:px-8 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-12 lg:gap-[80px]">
        
        {/* Left: Portrait Student Image with Floating Rating Card */}
        <div className="w-full lg:w-[580px] h-[520px] sm:h-[620px] lg:h-auto min-h-[520px] lg:min-h-[720px] relative shrink-0 overflow-hidden shadow-sm">
          <Image
            src={bgImage}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 580px"
            className="object-cover"
          />

          {/* Floating Ratings Card */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-black/45 backdrop-blur-md border border-white/20 rounded-[10px] p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xl">
            {/* Overlapping Avatars */}
            <div className="flex items-center -space-x-3.5">
              {ratingAvatars.map((avatar, idx) => (
                <div key={idx} className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                  <Image
                    src={avatar}
                    alt={`Reviewer avatar ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Ratings text */}
            <div className="flex flex-col pl-1 font-inter text-white">
              <span className="text-base sm:text-lg font-semibold leading-tight">{studentRatingsCount}</span>
              <span className="text-xs sm:text-sm text-white/90 leading-tight">{studentRatingsLabel}</span>
            </div>
          </div>
        </div>

        {/* Right: Content + Institutional Commitment Card */}
        <div className="flex-1 w-full flex flex-col justify-between gap-8 lg:gap-[40px]">
          
          {/* Top text block */}
          <div className="flex flex-col gap-6 items-start">
            {badge && (
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[1.25]">
              {title}
            </h2>

            <div className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans flex flex-col gap-4">
              {bodyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* Bottom Card: Institutional Commitment */}
          <div className="bg-white border border-[#b0ebff] p-6 sm:p-8 lg:p-[30px] flex flex-col gap-4 shadow-sm">
            <h3 className="text-[#000080] font-serif font-bold text-xl lg:text-[24px] tracking-tight leading-snug">
              {commitmentTitle}
            </h3>
            <div className="text-[#00506b] text-base lg:text-[18px] leading-relaxed lg:leading-[28px] font-sans flex flex-col gap-3">
              {commitmentParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
