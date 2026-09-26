import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface ProfileDetailItem {
  label: string;
  value: string;
}

const defaultProfileDetails: ProfileDetailItem[] = [
  { label: 'Established', value: '1 January 2026' },
  { label: 'Type', value: 'Independent, Non-Profit' },
  { label: 'Focus', value: 'Law, Politics & Governance' },
  { label: 'Motto', value: '"Knowledge, Justice, and Leadership for Global Change."' },
];

interface InstitutionalProfileProps {
  data?: Partial<PageSectionData>;
}

export default function InstitutionalProfile({ data }: InstitutionalProfileProps) {
  const badge = data?.badge ?? 'Who We Are';
  const title = data?.title ?? 'Institutional Profile';
  const subtitle =
    data?.subtitle ??
    'The International Institute for Law and Politics (IILP) is an independent, non-profit academic, research, policy, and leadership institute committed to strengthening the discourse, learning, and practice of international law, governance, politics, human rights, forced displacement and statelessness, humanitarian affairs, peacebuilding, and sustainable development through inclusive higher education, research, training, policy dialogue, and global cooperation.';
  const actionText = data?.actionText || 'Apply for Fellowship';
  const actionUrl = data?.actionUrl || '/fellowships';

  const meta = (data?.metadata || {}) as {
    secondaryActionText?: string;
    secondaryActionUrl?: string;
    image1?: string;
    image2?: string;
    badgeIcon?: string;
    badgeText?: string;
    profileDetails?: ProfileDetailItem[];
  };

  const secondaryActionText = meta.secondaryActionText || 'Learn More';
  const secondaryActionUrl = meta.secondaryActionUrl || '/about';
  const image1 = meta.image1 || '/assets/about-institutional-1.png';
  const image2 = meta.image2 || '/assets/about-institutional-2.png';
  const badgeIcon = meta.badgeIcon || '/assets/about-badge-icon.svg';
  const badgeText = meta.badgeText || '/assets/about-badge-text.png';
  const profileDetails = meta.profileDetails || defaultProfileDetails;

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-[120px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-10 sm:gap-12 lg:gap-[80px]">
        
        {/* Left Side: Overlapping Images and Stamp Badge */}
        <div className="w-full lg:w-[590px] h-[360px] sm:h-[500px] lg:h-[600px] relative shrink-0 mx-auto max-w-[590px]">
          {/* Top Left Image: Professor & Student */}
          <div className="w-[62%] sm:w-[348px] h-[250px] sm:h-[400px] lg:h-[448px] relative overflow-hidden shadow-sm rounded-lg sm:rounded-none">
            <Image
              src={image1}
              alt="Faculty and student in discussion"
              fill
              unoptimized
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
              unoptimized
              sizes="(max-width: 768px) 60vw, 348px"
              className="object-cover"
            />
          </div>

          {/* Circular Heritage Badge */}
          <div className="absolute right-2 sm:right-auto sm:left-[410px] top-[16px] sm:top-[60px] w-[80px] sm:w-[120px] h-[80px] sm:h-[120px] rounded-full bg-white border border-[#641320] flex items-center justify-center shadow-lg z-20">
            {/* Center Wreath Icon */}
            <div className="relative w-[36px] sm:w-[62px] h-[28px] sm:h-[50px] z-10">
              <Image
                src={badgeIcon}
                alt="Heritage award icon"
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            {/* Circular Rotating Badge Text */}
            <div className="absolute inset-[-6px] sm:inset-[-12px] flex items-center justify-center animate-[spin_25s_linear_infinite] pointer-events-none">
              <Image
                src={badgeText}
                alt="Next-Gen Toward Education Since 1995"
                width={140}
                height={140}
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Content & Details */}
        <div className="flex-1 w-full flex flex-col gap-8 lg:gap-[40px]">
          
          {/* Header Block */}
          <div className="flex flex-col gap-4 items-start">
            {/* Pill Tag */}
            {badge && (
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                  {badge}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-[1.25]">
              {title}
            </h2>

            {/* Description with 'See more...' */}
            {subtitle && (
              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans mt-2">
                {subtitle}{' '}
                <button 
                  type="button" 
                  className="text-[#00aee8] hover:underline font-medium inline cursor-pointer"
                >
                  See more...
                </button>
              </p>
            )}
          </div>

          {/* Key Facts / Highlight Cards */}
          <div className="flex flex-col gap-4 lg:gap-[24px] w-full">
            {profileDetails.map((item, index) => (
              <div 
                key={index}
                className="bg-[#e6f9ff] border border-[#b0ebff] p-5 lg:p-[24px] flex flex-col gap-1 transition-all hover:border-[#00bfff]/60 hover:shadow-xs"
              >
                <span className="text-[#000036]/70 text-sm md:text-[16px] lg:text-[18px] font-sans">
                  {item.label}
                </span>
                <span className="text-[#000080] text-lg md:text-xl lg:text-[24px] font-serif font-bold tracking-tight">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center pt-2 font-sans w-full">
            {actionText && (
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#009fd4] text-white px-6 py-3.5 text-sm md:text-base font-semibold shadow-xs transition-colors text-center"
              >
                {actionText}
              </Link>
            )}
            {secondaryActionText && (
              <Link
                href={secondaryActionUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#f9fafb] border border-[#e5e7eb] hover:bg-gray-100 text-[#4a5565] px-6 py-3.5 text-sm md:text-base font-semibold shadow-xs transition-colors text-center"
              >
                {secondaryActionText}
              </Link>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
