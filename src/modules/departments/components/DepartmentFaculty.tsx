import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchPublicLeadershipMembers,
  createSlugFromName,
  LeadershipMemberItem,
} from "@/common/services/leadership.service";

const PAGE_SIZE = 4;

export default function DepartmentFaculty() {
  const [facultyMembers, setFacultyMembers] = useState<LeadershipMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Fetch exclusively academic leadership members from the API
    fetchPublicLeadershipMembers({ type: "academic-leadership", limit: PAGE_SIZE, page: 1 })
      .then((data) => {
        if (!isMounted) return;
        const members = data || [];
        setFacultyMembers(members);
        setHasMore(members.length >= PAGE_SIZE);
      })
      .catch((err) => {
        console.warn("[DepartmentFaculty] Failed to load academic leadership members:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const newMembers = await fetchPublicLeadershipMembers({
        type: "academic-leadership",
        limit: PAGE_SIZE,
        page: nextPage,
      });

      if (Array.isArray(newMembers) && newMembers.length > 0) {
        setFacultyMembers((prev) => {
          const existingIds = new Set(
            prev.map((m) => (m.id || m.name || "").trim().toLowerCase())
          );
          const fresh = newMembers.filter(
            (m) => !existingIds.has((m.id || m.name || "").trim().toLowerCase())
          );
          return [...prev, ...fresh];
        });
        setCurrentPage(nextPage);
        if (newMembers.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.warn("Error loading more academic faculty from API:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="w-full bg-white py-14 sm:py-20 lg:py-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 border-t border-gray-100">
      <div className="max-w-[1360px] mx-auto">
        {/* Section Header - Clean, bold, matching http://localhost:3000/governance */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-3xl flex flex-col items-start gap-3">
            {/* Pill Badge */}
            <div className="border border-[#00698c] rounded-full px-3.5 py-1 bg-[#e6f9ff]/40">
              <span className="font-sans font-semibold text-xs uppercase tracking-wider text-[#00698c]">
                Departmental Leadership
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold uppercase tracking-tight text-[#1a142e] font-serif sm:font-sans leading-tight">
              Distinguished Faculty.
            </h2>

            <p className="text-[#374151] text-base sm:text-lg leading-relaxed font-sans">
              The Department of Law and International Legal Studies is led by distinguished active scholars and practitioners from leading international universities and institutes.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/leadership-directory"
              className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-sm sm:text-base px-6 py-3 rounded-full shadow-xs transition-colors duration-200 w-full sm:w-auto text-center"
            >
              View Leadership Directory
            </Link>
          </div>
        </div>

        {/* 4-Column Portrait Cards Grid or Skeleton Loader */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center animate-pulse">
                <div className="w-full aspect-[3/4] bg-gray-200 rounded-t-2xl sm:rounded-t-3xl overflow-hidden shadow-xs" />
                <div className="mt-4 w-full flex flex-col items-center px-2 space-y-2">
                  <div className="h-5 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : facultyMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {facultyMembers.map((member, index) => {
              const memberSlug = createSlugFromName(member.name);
              const hasImg = member.image && !failedImages[member.id];
              const initials =
                member.initials ||
                member.name
                  ?.split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase() ||
                "DF";

              return (
                <Link
                  key={member.id || `${member.name}-${index}`}
                  href={`/leadership/${memberSlug}`}
                  className="flex flex-col items-center text-center group cursor-pointer transition-all duration-300"
                >
                  {/* Portrait image with softly rounded top corners (matches Governance page) */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-t-2xl sm:rounded-t-3xl bg-gray-100 shadow-xs border border-gray-100/80">
                    {hasImg ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                        onError={() => handleImageError(member.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00698c] to-[#00bfff] text-white text-3xl sm:text-4xl font-bold font-serif">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Name & Role centered below image */}
                  <div className="mt-4 w-full flex flex-col items-center px-2">
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] group-hover:text-[#00698c] transition-colors leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#4b5563] mt-1 leading-snug max-w-[260px]">
                      {member.role || "Distinguished Faculty"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 border border-gray-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 font-serif mb-2">
              No Academic Leadership Members Listed
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Faculty profiles and academic chairs are designated through the leadership administration directory.
            </p>
            <Link
              href="/governance"
              className="inline-flex items-center justify-center rounded-full bg-[#00698c] hover:bg-[#00516c] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Explore Institutional Governance
            </Link>
          </div>
        )}

        {/* Load More Button - matches Governance page if more than 4 members exist */}
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
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
