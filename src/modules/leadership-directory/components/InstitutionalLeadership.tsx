import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';
import LeadershipProfileModal, {
  LeadershipMemberData,
} from './LeadershipProfileModal';

const MEMBERS: LeadershipMemberData[] = [
  {
    name: 'Mohammed Siraj',
    role: 'Vice President',
    initials: 'MS',
    image: '/assets/governance-founding-member.png',
    about:
      'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.',
    accountabilityFunctions: [
      'Assists the President in carrying out institutional responsibilities.',
      'Represents the Institute nationally and internationally.',
      'Engages with universities and organizations to build partnerships and collaboration.',
      'Supports governance and strategic planning processes.',
      'Facilitates coordination among leadership bodies and departments.',
      'Represents the Institute in official functions when delegated.',
      'Contributes to policy development and institutional decision-making.',
    ],
  },
  {
    name: 'Mujibur Rahman',
    role: 'Vice President',
    initials: 'MR',
    image: '/assets/governance-founding-member.png',
    about:
      'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.',
    accountabilityFunctions: [
      'Assists the President in carrying out institutional responsibilities.',
      'Represents the Institute nationally and internationally.',
      'Engages with universities and organizations to build partnerships and collaboration.',
      'Supports governance and strategic planning processes.',
      'Facilitates coordination among leadership bodies and departments.',
      'Represents the Institute in official functions when delegated.',
      'Contributes to policy development and institutional decision-making.',
    ],
  },
  {
    name: 'MD. Mahamudun Noby Rupok',
    role: 'Vice President',
    initials: 'MM',
    image: '/assets/governance-founding-member.png',
    about:
      'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.',
    accountabilityFunctions: [
      'Assists the President in carrying out institutional responsibilities.',
      'Represents the Institute nationally and internationally.',
      'Engages with universities and organizations to build partnerships and collaboration.',
      'Supports governance and strategic planning processes.',
      'Facilitates coordination among leadership bodies and departments.',
      'Represents the Institute in official functions when delegated.',
      'Contributes to policy development and institutional decision-making.',
    ],
  },
  {
    name: 'MD Mahamodul Hasan',
    role: 'Vice President',
    initials: 'MH',
    image: '/assets/governance-founding-member.png',
    about:
      'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.',
    accountabilityFunctions: [
      'Assists the President in carrying out institutional responsibilities.',
      'Represents the Institute nationally and internationally.',
      'Engages with universities and organizations to build partnerships and collaboration.',
      'Supports governance and strategic planning processes.',
      'Facilitates coordination among leadership bodies and departments.',
      'Represents the Institute in official functions when delegated.',
      'Contributes to policy development and institutional decision-making.',
    ],
  },
  {
    name: 'Mohammed Siraj',
    role: 'Founding Member',
    initials: 'MS',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'Mujibur Rahman',
    role: 'Founding Member',
    initials: 'MR',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'MD. Mahamudun Noby Rupok',
    role: 'Founding Member',
    initials: 'MM',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'MD Mahamodul Hasan',
    role: 'Founding Member',
    initials: 'MH',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'Mohammed Siraj',
    role: 'Founding Member',
    initials: 'MS',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'Mujibur Rahman',
    role: 'Founding Member',
    initials: 'MR',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'MD. Mahamudun Noby Rupok',
    role: 'Founding Member',
    initials: 'MM',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'MD Mahamodul Hasan',
    role: 'Founding Member',
    initials: 'MH',
    image: '/assets/governance-founding-member.png',
  },
];

interface InstitutionalLeadershipProps {
  data?: Partial<PageSectionData>;
}

export default function InstitutionalLeadership({ data }: InstitutionalLeadershipProps) {
  const [selectedMember, setSelectedMember] = useState<LeadershipMemberData | null>(null);

  const badge = data?.badge ?? 'Our Team';
  const title = data?.title ?? 'Institutional Leadership';
  const subtitle =
    data?.subtitle ??
    "The Institute is led by a diverse team of dedicated professionals committed to advancing IILP's mission of knowledge, justice, and global change.";
  const actionText = data?.actionText ?? 'Contact Us';
  const actionUrl = data?.actionUrl ?? '/contact';

  const membersList: LeadershipMemberData[] =
    Array.isArray(data?.metadata?.members) && data.metadata.members.length > 0
      ? (data.metadata.members as LeadershipMemberData[])
      : MEMBERS;

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px] items-start lg:items-end justify-between w-full">
          <div className="flex-1 flex flex-col gap-4 items-start">
            {badge && (
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[44px]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[#0a0d12] text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans max-w-[850px]">
                {subtitle}
              </p>
            )}
          </div>

          {actionText && (
            <div className="shrink-0">
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans whitespace-nowrap"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>

        {/* 12-Member Grid (4 columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-[24px] w-full">
          {membersList.map((member, index) => (
            <div
              key={index}
              onClick={() => setSelectedMember(member)}
              className="flex flex-col items-start w-full group cursor-pointer"
            >
              <div className="relative w-full aspect-[277.5/370] overflow-hidden bg-gray-100 rounded-sm">
                <Image
                  src={member.image || '/assets/governance-founding-member.png'}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-1.5 items-start mt-5 lg:mt-[30px] w-full">
                <h3 className="text-xl lg:text-[24px] font-serif font-bold text-[#0a0d12] leading-tight group-hover:text-[#00bfff] transition-colors">
                  {member.name}
                </h3>
                <p className="text-base md:text-[20px] text-[#414651] font-sans leading-[30px]">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Leadership Profile Modal */}
      <LeadershipProfileModal
        member={selectedMember}
        isOpen={Boolean(selectedMember)}
        onClose={() => setSelectedMember(null)}
      />
    </section>
  );
}
