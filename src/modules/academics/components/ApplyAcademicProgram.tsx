import React from "react";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";

interface ApplyAcademicProgramProps {
  data?: Partial<PageSectionData>;
}

export default function ApplyAcademicProgram({ data }: ApplyAcademicProgramProps) {
  const title = data?.title ?? "Apply to an Academic Program";
  const subtitle =
    data?.subtitle ??
    "Apply for fellowship, certificate programs, and research initiatives across IILP's academic departments.";
  const actionText = data?.actionText ?? "Apply for Fellowship & Programs";
  const actionUrl = data?.actionUrl ?? "/fellowships";

  return (
    <section className="bg-white pb-16 sm:pb-24 lg:pb-[140px] px-4 sm:px-8 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="bg-[#160d03] rounded-[8px] min-h-[380px] lg:h-[550px] p-8 sm:p-12 lg:pb-[69px] lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] flex flex-col lg:flex-row justify-between items-start overflow-hidden relative">
          {/* Left Column: Main Title */}
          <div className="max-w-[451px]">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[48px] text-white leading-tight lg:leading-[62.4px] tracking-[-1.5px]">
              {title}
            </h2>
          </div>

          {/* Right Column: Subtitle & CTA Button */}
          <div className="flex flex-col gap-6 lg:gap-[32px] max-w-[500px] mt-8 lg:mt-[130px]">
            {subtitle && (
              <p className="font-serif text-lg sm:text-xl lg:text-[24px] text-white leading-snug lg:leading-normal">
                {subtitle}
              </p>
            )}

            {actionText && (
              <div>
                <Link
                  href={actionUrl}
                  className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] whitespace-nowrap"
                >
                  {actionText}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

