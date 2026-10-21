import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';
import {
  fetchPublicLeadershipMembers,
  createSlugFromName,
} from '@/common/services/leadership.service';
import { LeadershipMemberData } from './LeadershipProfileModal';

interface MemberCardProps {
  member: LeadershipMemberData;
}

function MemberCard({ member }: MemberCardProps) {
  const [imgError, setImgError] = useState(false);
  const memberIdOrSlug = member.id || member._id || createSlugFromName(member.name);
  const initials =
    member.initials ||
    member.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() ||
    'LP';

  return (
    <Link
      href={`/leadership/${memberIdOrSlug}`}
      className="flex flex-col items-start w-full group cursor-pointer"
    >
      <div className="relative w-full aspect-[277.5/370] overflow-hidden bg-slate-100 rounded-sm">
        {member.image && !imgError ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#000080] via-[#003399] to-[#00bfff] text-white p-4">
            <span className="text-4xl sm:text-5xl font-bold font-serif">{initials}</span>
            <span className="text-xs uppercase tracking-wider text-white/80 mt-2 font-sans text-center line-clamp-1">
              {member.role}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 items-start mt-5 lg:mt-[30px] w-full">
        <h3 className="text-xl lg:text-[24px] font-serif font-bold text-[#0a0d12] leading-tight group-hover:text-[#00bfff] transition-colors line-clamp-2">
          {member.name}
        </h3>
        <p className="text-base md:text-[20px] text-[#414651] font-sans leading-[30px] line-clamp-2">
          {member.role}
        </p>
      </div>
    </Link>
  );
}

interface InstitutionalLeadershipProps {
  data?: Partial<PageSectionData>;
  members?: LeadershipMemberData[];
}

export default function InstitutionalLeadership({
  data,
  members,
}: InstitutionalLeadershipProps) {
  const [membersList, setMembersList] = useState<LeadershipMemberData[]>(members || []);
  const [isLoading, setIsLoading] = useState(!members);

  const badge = data?.badge ?? 'Our Team';
  const title = data?.title ?? 'Institutional Leadership';
  const subtitle =
    data?.subtitle ??
    "The Institute is led by a diverse team of dedicated professionals committed to advancing IILP's mission of knowledge, justice, and global change.";
  const actionText = data?.actionText ?? 'Contact Us';
  const actionUrl = data?.actionUrl ?? '/contact';

  useEffect(() => {
    if (members) {
      setMembersList(members);
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    fetchPublicLeadershipMembers()
      .then((apiMembers) => {
        if (active && Array.isArray(apiMembers)) {
          setMembersList(apiMembers);
        }
      })
      .catch((err) => {
        console.warn('Could not load public leadership members from API:', err);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [members]);

  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
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

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-tight sm:leading-[44px]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[#0a0d12] text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans max-w-[850px]">
                {subtitle}
              </p>
            )}
          </div>

          {actionText && (
            <div className="shrink-0 w-full sm:w-auto">
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans whitespace-nowrap w-full sm:w-auto text-center"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>

        {/* Member Grid / Skeletons / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-[24px] w-full animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-start w-full">
                <div className="w-full aspect-[277.5/370] rounded-sm bg-slate-200" />
                <div className="mt-5 w-full space-y-2">
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : membersList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-[24px] w-full">
            {membersList.map((member, index) => (
              <MemberCard
                key={member.id || member._id || index}
                member={member}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 text-center text-gray-500 font-sans border border-dashed border-gray-200 rounded-2xl">
            No leadership directory profiles currently available.
          </div>
        )}
      </div>
    </section>
  );
}
