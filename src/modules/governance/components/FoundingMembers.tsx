import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';
import {
  fetchPublicLeadershipMembers,
  createSlugFromName,
} from '@/common/services/leadership.service';
import { LeadershipMemberData } from '@/modules/leadership-directory/components/LeadershipProfileModal';

export type FoundingMemberItem = LeadershipMemberData & {
  id?: string;
  _id?: string;
  isActive?: boolean;
};

interface FoundingMembersProps {
  data?: Partial<PageSectionData>;
  initialMembers?: FoundingMemberItem[];
}

function processFoundingMembers(
  apiMembers: FoundingMemberItem[]
): FoundingMemberItem[] {
  if (!Array.isArray(apiMembers) || apiMembers.length === 0) {
    return [];
  }

  return apiMembers
    .filter((m) => m && m.isActive !== false)
    .map((m) => {
      let displayRole = m.role || 'Founding Member';
      if (
        displayRole.toLowerCase().includes('founder') &&
        displayRole.toLowerCase().includes('president')
      ) {
        displayRole = 'Founder & President';
      }

      return {
        ...m,
        role: displayRole,
        image: m.image || '/assets/governance-founding-member.png',
      };
    });
}

const PAGE_SIZE = 4;

export default function FoundingMembers({
  data,
  initialMembers,
}: FoundingMembersProps) {
  const [membersList, setMembersList] = useState<FoundingMemberItem[]>(() => {
    if (initialMembers && initialMembers.length > 0) {
      return processFoundingMembers(initialMembers);
    }
    return [];
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const title = data?.title ?? 'Board of Founding Members';
  const subtitle =
    data?.subtitle ??
    'The Board of Founding Members comprises the individuals who supported the founder during the establishment process of the International Institute for Law and Politics and provided guidance on institutional, strategic, and organizational foundation.';

  useEffect(() => {
    if (initialMembers && initialMembers.length > 0) {
      const processed = processFoundingMembers(initialMembers);
      setMembersList(processed);
      setHasMore(initialMembers.length >= PAGE_SIZE);
      return;
    }

    // Initial fetch if no initialMembers were supplied
    let active = true;
    fetchPublicLeadershipMembers({ limit: PAGE_SIZE, page: 1 })
      .then((apiMembers) => {
        if (!active || !Array.isArray(apiMembers)) return;
        const processed = processFoundingMembers(apiMembers);
        setMembersList(processed);
        setHasMore(apiMembers.length >= PAGE_SIZE);
      })
      .catch((err) => {
        console.warn('Could not load public leadership members for founding board:', err);
      });

    return () => {
      active = false;
    };
  }, [initialMembers]);

  const handleLoadMore = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const newMembers = await fetchPublicLeadershipMembers({
        limit: PAGE_SIZE,
        page: nextPage,
      });

      if (Array.isArray(newMembers) && newMembers.length > 0) {
        const processed = processFoundingMembers(newMembers);

        setMembersList((prev) => {
          const existingIds = new Set(
            prev.map((m) => (m.id || m.name || '').trim().toLowerCase())
          );
          const fresh = processed.filter(
            (m) => !existingIds.has((m.id || m.name || '').trim().toLowerCase())
          );
          return [...prev, ...fresh];
        });

        setCurrentPage(nextPage);

        // If returned members are fewer than PAGE_SIZE, no more pages exist
        if (newMembers.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn('Error loading more members from API:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <section className="w-full bg-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header - Clean, bold, matching reference design */}
        <div className="max-w-4xl mb-10 sm:mb-14 text-left">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold uppercase tracking-tight text-[#1a142e] font-serif sm:font-sans leading-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-4 text-[#374151] text-base sm:text-lg lg:text-[18px] leading-relaxed font-sans">
              {subtitle}
            </p>
          )}
        </div>

        {/* 4-Column Portrait Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {membersList.map((member, index) => {
            const memberSlug = createSlugFromName(member.name);
            return (
              <Link
                key={member._id || member.id || `${member.name}-${index}`}
                href={`/leadership/${memberSlug}`}
                className="flex flex-col items-center text-center group cursor-pointer transition-all duration-300"
              >
                {/* Portrait image with softly rounded top corners */}
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gray-100 shadow-xs">
                  <Image
                    src={member.image || '/assets/governance-founding-member.png'}
                    alt={member.name || 'Founding Member'}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Name & Role centered below image */}
                <div className="mt-4 w-full flex flex-col items-center px-1">
                  <h3 className="text-base sm:text-lg font-bold text-[#111827] group-hover:text-[#00698c] transition-colors leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#4b5563] mt-1 leading-snug max-w-[260px]">
                    {member.role || 'Founding Member'}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* LOAD MORE Button - Fetches next 4 from API */}
        {hasMore && (
          <div className="flex justify-center mt-12 sm:mt-16">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center justify-center rounded-full bg-[#93186c] hover:bg-[#7e145b] active:scale-95 text-white px-9 py-3.5 text-sm sm:text-[15px] font-bold tracking-wider uppercase shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-70 select-none"
            >
              {isLoadingMore ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                'LOAD MORE'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
