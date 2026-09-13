import React from "react";
import Image from "next/image";
import Link from "next/link";

const researchAreas = [
  "Provide strategic advice on institutional growth and long-term development.",
  "Support the advancement of academic excellence and research quality.",
  "Strengthen the Institute's international reputation and visibility.",
  "Facilitate connections with universities, research institutions, international organizations, and professional networks.",
  "Advise on governance, policy development, and institutional strategy.",
  "Support international collaboration and partnership-building efforts.",
  "Contribute expertise on emerging global legal, political, and humanitarian issues.",
];

export default function DepartmentOverview() {
  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start gap-12 lg:gap-[80px]">
        {/* Left Column: Content Blocks */}
        <div className="flex-1 w-full flex flex-col gap-12 lg:gap-[80px]">
          {/* 1. Overview */}
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <div className="flex flex-col gap-4 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Overview
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[24px] text-[#0a0d12]">
                Department Overview
              </h2>
            </div>
            <p className="font-sans text-base sm:text-[20px] text-[#0a0d12]/70 leading-relaxed sm:leading-[30px]">
              The Department of Law and International Legal Studies is dedicated to
              advancing rigorous scholarship and education in law, legal systems, and
              international legal frameworks. It examines how laws shape societies,
              govern relations between states, protect individuals, and provide the
              foundation for justice and order in the global community.
            </p>
          </div>

          {/* 2. Purpose */}
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <div className="flex flex-col gap-4 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Purpose
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[24px] text-[#0a0d12]">
                Department Mission
              </h2>
            </div>
            <p className="font-sans text-base sm:text-[20px] text-[#0a0d12]/70 leading-relaxed sm:leading-[30px]">
              To advance legal scholarship, foster critical thinking, and equip students
              and researchers with the knowledge and analytical tools necessary to
              navigate and contribute to the development of local, national, and
              international legal systems in service of justice, human rights, and good
              governance.
            </p>
          </div>

          {/* 3. Areas of Focus */}
          <div className="flex flex-col gap-6 lg:gap-[30px]">
            <div className="flex flex-col gap-4 items-start">
              <div className="border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                  Areas of Focus
                </span>
              </div>
              <h2 className="font-serif font-bold text-2xl sm:text-[24px] text-[#0a0d12]">
                Research Areas
              </h2>
            </div>

            {/* Checkmark List */}
            <div className="flex flex-col gap-4 sm:gap-4">
              {researchAreas.map((area, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="relative shrink-0 w-6 h-6 mt-0.5">
                    <Image
                      src="/assets/checkmark-circle-sky.svg"
                      alt="Check"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                  <p className="flex-1 font-sans text-base sm:text-[18px] text-[#00506b] leading-[28px]">
                    {area}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Action Sidebars */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-8 lg:gap-[80px]">
          {/* Card 1: Apply to IILP */}
          <div className="bg-[#00506b] border border-[#b0ebff] rounded-none p-6 sm:p-[30px] flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-white">
              <h3 className="font-serif font-bold text-xl sm:text-[24px] text-white">
                Apply to IILP
              </h3>
              <p className="font-sans text-base sm:text-[18px] text-white/90 leading-[28px]">
                Take the next step toward advancing your legal education, research, and
                professional journey with IILP.
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-3 items-center w-full">
              <Link
                href="/fellowships"
                className="flex-1 inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-5 py-3.5 rounded-full transition-colors whitespace-nowrap drop-shadow-xs text-center"
              >
                Apply Online
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-[#f9fafb] hover:bg-white text-[#4a5565] border border-[#e5e7eb] font-sans font-semibold text-sm sm:text-base px-5 py-3.5 rounded-full transition-colors whitespace-nowrap drop-shadow-xs text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Card 2: Publications & Research */}
          <div className="bg-white border border-[#b0ebff] rounded-none p-6 sm:p-[30px] flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="font-serif font-bold text-xl sm:text-[24px] text-[#000080]">
                Publications &amp; Research
              </h3>
              <p className="font-sans text-base sm:text-[18px] text-[#00506b] leading-[28px]">
                Department publications, working papers, and research outputs are
                available in the Research &amp; Publications section.
              </p>
            </div>
            <div>
              <Link
                href="/fellowships"
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#00a3db] text-white font-sans font-semibold text-sm sm:text-base px-6 py-3.5 rounded-full transition-colors whitespace-nowrap drop-shadow-xs"
              >
                View Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
