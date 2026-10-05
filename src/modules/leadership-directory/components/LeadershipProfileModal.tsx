import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export interface LeadershipMemberData {
  name: string;
  role: string;
  initials?: string;
  image?: string;
  about?: string;
  accountabilityFunctions?: string[];
}

interface LeadershipProfileModalProps {
  member: LeadershipMemberData | null;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_FOUNDING_ABOUT =
  'As a member of the Board of Founding Members, contributes to the strategic direction, institutional stewardship, and foundational governance of the International Institute for Law and Politics (IILP), supporting the Institute\'s mission of knowledge, justice, and global change.';

const DEFAULT_VP_ABOUT =
  'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.';

const DEFAULT_FOUNDING_FUNCTIONS = [
  'Provides institutional, strategic, and organizational guidance to the Institute.',
  'Supports the Founder and Governing Council in upholding the founding mission and vision.',
  'Advises on long-term institutional development, ethics, and governance policies.',
  'Represents the Institute and fosters strategic partnerships with academic institutions globally.',
  'Participates in high-level consultative assemblies and strategic planning processes.',
];

const DEFAULT_FUNCTIONS = [
  'Assists the President in carrying out institutional responsibilities.',
  'Represents the Institute nationally and internationally.',
  'Engages with universities and organizations to build partnerships and collaboration.',
  'Supports governance and strategic planning processes.',
  'Facilitates coordination among leadership bodies and departments.',
  'Represents the Institute in official functions when delegated.',
  'Contributes to policy development and institutional decision-making.',
];

/**
 * Checks if a paragraph represents a section heading within the bio
 */
function isSectionHeading(text: string): boolean {
  if (text.length > 70) return false;
  const headingRegex =
    /^(academic background|research and scholarly interests|publications and academic contributions|institutional leadership and vision|biography|about|education|professional experience|background|selected publications|key areas of expertise|leadership and vision)/i;
  if (headingRegex.test(text.trim())) return true;
  return (
    text.length < 50 &&
    !text.endsWith('.') &&
    !text.endsWith(',') &&
    !text.includes(';')
  );
}

export default function LeadershipProfileModal({
  member,
  isOpen,
  onClose,
}: LeadershipProfileModalProps) {
  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever selected member or image changes
  useEffect(() => {
    setImageError(false);
  }, [member?.image]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !member) return null;

  // Calculate initials if not provided
  const initials =
    member.initials ||
    member.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  const isFounding =
    member.role?.toLowerCase().includes('founding') ||
    member.role?.toLowerCase().includes('founder');

  const defaultAbout = isFounding ? DEFAULT_FOUNDING_ABOUT : DEFAULT_VP_ABOUT;
  const aboutText = member.about?.trim() || defaultAbout;

  // Split into paragraphs by one or more newlines
  const paragraphs = aboutText
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const fallbackFunctions = isFounding
    ? DEFAULT_FOUNDING_FUNCTIONS
    : DEFAULT_FUNCTIONS;

  const functionsList =
    Array.isArray(member.accountabilityFunctions) &&
    member.accountabilityFunctions.length > 0
      ? member.accountabilityFunctions
      : fallbackFunctions;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="leadership-profile-modal-name"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 bg-slate-950/65 backdrop-blur-sm animate-overlay-in"
      onClick={onClose}
    >
      {/* Modal Card Container */}
      <div
        className="w-full max-w-[800px] max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden relative animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="shrink-0 bg-white border-b border-slate-100 px-5 py-4 sm:px-8 sm:py-5 flex items-start sm:items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3.5 sm:gap-5 flex-1 min-w-0">
            {/* Avatar Photo / Initials */}
            <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full shrink-0 overflow-hidden ring-3 sm:ring-4 ring-sky-100 border border-slate-200 shadow-xs flex items-center justify-center bg-gradient-to-br from-[#000080] to-[#00bfff] text-white text-lg sm:text-2xl font-bold font-serif select-none">
              {member.image && !imageError ? (
                <img
                  src={member.image}
                  alt={member.name}
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Name & Role Badge */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <div className="inline-flex max-w-full">
                <span className="inline-block px-2.5 py-1 rounded-md bg-sky-50 text-[#00698c] border border-sky-200/90 text-[11px] sm:text-xs font-semibold uppercase tracking-wider leading-snug break-words">
                  {member.role || 'Leadership'}
                </span>
              </div>

              <h3
                id="leadership-profile-modal-name"
                className="text-lg sm:text-2xl font-serif font-bold text-[#0a0d12] leading-tight break-words"
              >
                {member.name}
              </h3>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close profile modal"
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto modal-scroll px-5 py-5 sm:px-8 sm:py-7 space-y-6 overscroll-contain"
        >
          {/* About / Biography Section */}
          <div className="flex flex-col gap-3 items-start w-full">
            <h4 className="text-base sm:text-lg font-serif font-bold text-[#000080] tracking-wide">
              About & Biography
            </h4>

            {/<[a-z][\s\S]*>/i.test(aboutText) ? (
              <div
                className="w-full text-sm sm:text-[15px] text-slate-700 font-sans leading-relaxed sm:leading-[27px] [&>h1]:font-serif [&>h1]:text-xl sm:[&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-[#000080] [&>h1]:mt-6 [&>h1]:mb-2 [&>h2]:font-serif [&>h2]:text-lg sm:[&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-[#000080] [&>h2]:mt-5 [&>h2]:mb-2 [&>h3]:font-serif [&>h3]:text-base sm:[&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#000080] [&>h3]:mt-4 [&>h3]:mb-1.5 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[#00bfff] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-3 [&>blockquote]:text-slate-600 [&>a]:text-[#00698c] [&>a]:underline [&>strong]:font-semibold [&>strong]:text-slate-900"
                dangerouslySetInnerHTML={{ __html: aboutText }}
              />
            ) : (
              <div className="flex flex-col gap-3.5 w-full">
                {paragraphs.map((para, idx) => {
                  if (isSectionHeading(para)) {
                    return (
                      <h5
                        key={idx}
                        className="text-sm sm:text-base font-serif font-bold text-[#000080] pt-2 pb-1 border-b border-sky-100/80 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff] shrink-0" />
                        {para}
                      </h5>
                    );
                  }
                  return (
                    <p
                      key={idx}
                      className="text-sm sm:text-[15px] text-slate-700 font-sans font-normal leading-relaxed sm:leading-[26px]"
                    >
                      {para}
                    </p>
                  );
                })}
              </div>
            )}
          </div>

          {/* Accountability Functions Section */}
          {functionsList.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3 items-start">
              <h4 className="text-base sm:text-lg font-serif font-bold text-[#000080] tracking-wide">
                Accountability Functions
              </h4>

              <div className="flex flex-col gap-2.5 w-full">
                {functionsList.map((fn, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 w-full bg-slate-50/70 border border-slate-100/90 rounded-xl p-3 sm:p-3.5"
                  >
                    <div className="relative w-5 h-5 shrink-0 mt-0.5">
                      <Image
                        src="/assets/checkmark-circle-sky.svg"
                        alt="Checkmark"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="flex-1 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                      {fn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="shrink-0 bg-slate-50/80 border-t border-slate-100 px-5 py-3 sm:px-8 sm:py-3.5 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
