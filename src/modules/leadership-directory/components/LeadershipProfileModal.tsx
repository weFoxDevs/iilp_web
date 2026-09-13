import React, { useEffect } from 'react';
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

const DEFAULT_ABOUT =
  'The Vice President supports the President in providing institutional leadership and contributes to strategic planning, governance, organizational coordination, and externally representing the Institute.';

const DEFAULT_FUNCTIONS = [
  'Assists the President in carrying out institutional responsibilities.',
  'Represents the Institute nationally and internationally.',
  'Engages with universities and organizations to build partnerships and collaboration.',
  'Supports governance and strategic planning processes.',
  'Facilitates coordination among leadership bodies and departments.',
  'Represents the Institute in official functions when delegated.',
  'Contributes to policy development and institutional decision-making.',
];

export default function LeadershipProfileModal({
  member,
  isOpen,
  onClose,
}: LeadershipProfileModalProps) {
  // Close modal on Escape key press
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

  const aboutText = member.about || DEFAULT_ABOUT;
  const functionsList = member.accountabilityFunctions || DEFAULT_FUNCTIONS;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/55 backdrop-blur-[8px] animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Card Container */}
      <div
        className="w-full max-w-[800px] bg-white border border-[#b0ebff] rounded-2xl p-6 sm:p-[30px] flex flex-col gap-6 relative shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close profile modal"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-[#e5e7eb] bg-white hover:bg-gray-100 flex items-center justify-center transition-colors shadow-xs cursor-pointer z-10"
        >
          <div className="relative w-5 h-5">
            <Image
              src="/assets/dismiss-icon.svg"
              alt="Close"
              fill
              className="object-contain"
            />
          </div>
        </button>

        {/* Top Header: Avatar & Name */}
        <div className="flex items-center gap-4 sm:gap-5 pr-12">
          {/* Avatar circle with custom gradient */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0 flex items-center justify-center text-white text-xl sm:text-2xl font-bold font-serif bg-gradient-to-br from-[#000080] to-[#00bfff] shadow-md">
            {initials}
          </div>

          <div className="flex flex-col gap-1.5 items-start">
            <div className="border border-[#00698c] rounded-full px-2.5 py-1 inline-flex">
              <span className="text-xs sm:text-[14px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[20px] font-sans">
                {member.role || 'Vice President'}
              </span>
            </div>

            <h3 className="text-xl sm:text-[24px] font-serif font-bold text-[#0a0d12] leading-tight">
              {member.name}
            </h3>
          </div>
        </div>

        {/* About Section */}
        <div className="flex flex-col gap-2.5 items-start">
          <h4 className="text-lg sm:text-[20px] font-serif font-bold text-[#000080] leading-[30px]">
            About
          </h4>
          <p className="text-sm sm:text-base text-[#00506b] font-sans font-normal leading-[24px]">
            {aboutText}
          </p>
        </div>

        {/* Accountability Functions Section */}
        <div className="flex flex-col gap-3 items-start">
          <h4 className="text-lg sm:text-[20px] font-serif font-bold text-[#000080] leading-[30px]">
            Accountability Functions
          </h4>

          <div className="flex flex-col gap-3.5 w-full">
            {functionsList.map((fn, idx) => (
              <div key={idx} className="flex items-start gap-3.5 w-full">
                <div className="relative w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5">
                  <Image
                    src="/assets/checkmark-circle-sky.svg"
                    alt="Checkmark"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="flex-1 text-sm sm:text-base text-[#00506b] font-sans font-normal leading-[24px]">
                  {fn}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
