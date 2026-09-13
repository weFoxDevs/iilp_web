import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ProgramDepartment {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  highlighted?: boolean;
  hasActionButton?: boolean;
}

const programDepartments: ProgramDepartment[] = [
  {
    id: "law",
    number: "01",
    title: "Law & International Legal Studies",
    description:
      "Advancing legal scholarship, international law, and justice systems in a changing global order.",
    image: "/assets/academic-thumbnail-1.png",
  },
  {
    id: "political-science",
    number: "02",
    title: "Political Science & Governance",
    description:
      "Examining governance frameworks, democratic institutions, and political systems worldwide.",
    image: "/assets/academic-thumbnail-1.png",
    highlighted: true,
    hasActionButton: true,
  },
  {
    id: "human-rights",
    number: "03",
    title: "Human Rights & Humanitarian Studies",
    description:
      "Promoting human dignity, rights-based approaches, and humanitarian action globally.",
    image: "/assets/academic-thumbnail-1.png",
  },
];

export default function DepartmentAcademicPrograms() {
  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-12 lg:gap-[80px]">
        {/* Centered Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[680px]">
          {/* Pill Badge */}
          <div className="border border-[#00698c] rounded-full px-3.5 py-1.5">
            <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
              Academic Programs
            </span>
          </div>

          {/* Title */}
          <h2 className="font-sans font-semibold text-3xl sm:text-4xl lg:text-[40px] text-[#0a0d12] leading-tight sm:leading-[50px]">
            Six Academic Departments
          </h2>

          {/* Subtitle */}
          <p className="font-sans text-base sm:text-lg lg:text-[20px] text-[#0a0d12]/80 leading-relaxed sm:leading-[30px]">
            Interdisciplinary programs advancing law, governance, human rights, and
            development through rigorous research and scholarship.
          </p>
        </div>

        {/* 3 Department Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[30px] w-full">
          {programDepartments.map((dept) => (
            <Link
              key={dept.id}
              href="/department-details"
              className="flex flex-col gap-[30px] group cursor-pointer"
            >
              {/* Image Container with Badge */}
              <div className="relative aspect-[413/390] w-full rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={dept.image}
                  alt={dept.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Number Badge */}
                <div
                  className={`absolute top-5 left-5 w-[70px] h-[70px] sm:w-[91px] sm:h-[92px] flex items-center justify-center font-sans font-semibold text-2xl sm:text-[32px] leading-none transition-colors ${
                    dept.highlighted
                      ? "bg-[#00bfff] text-white"
                      : "bg-[#e6f9ff] text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-white"
                  }`}
                >
                  {dept.number}
                </div>

                {/* Action Arrow Button */}
                {dept.hasActionButton && (
                  <div className="absolute right-4 bottom-4 w-12 h-12 rounded-full bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center shadow-md hover:bg-white transition-all">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Text Container */}
              <div className="flex flex-col gap-2.5">
                <h3 className="font-serif font-bold text-xl sm:text-[24px] text-[#111111] leading-snug group-hover:text-[#00698c] transition-colors">
                  {dept.title}
                </h3>
                <p className="font-sans text-base sm:text-[18px] text-[#666666] leading-[28px]">
                  {dept.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div>
          <Link
            href="/academics"
            className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full drop-shadow-xs transition-colors duration-200"
          >
            Explore All Departments
          </Link>
        </div>
      </div>
    </section>
  );
}
