import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";

interface Department {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  hasActionButton?: boolean;
  highlighted?: boolean;
}

const defaultDepartments: Department[] = [
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
    hasActionButton: true,
    highlighted: true,
  },
  {
    id: "human-rights",
    number: "03",
    title: "Human Rights & Humanitarian Studies",
    description:
      "Promoting human dignity, rights-based approaches, and humanitarian action globally.",
    image: "/assets/academic-thumbnail-1.png",
  },
  {
    id: "law-2",
    number: "04",
    title: "Law & International Legal Studies",
    description:
      "Advancing legal scholarship, international law, and justice systems in a changing global order.",
    image: "/assets/academic-thumbnail-1.png",
  },
  {
    id: "political-science-2",
    number: "05",
    title: "Political Science & Governance",
    description:
      "Examining governance frameworks, democratic institutions, and political systems worldwide.",
    image: "/assets/academic-thumbnail-1.png",
    hasActionButton: true,
    highlighted: true,
  },
  {
    id: "human-rights-2",
    number: "06",
    title: "Human Rights & Humanitarian Studies",
    description:
      "Promoting human dignity, rights-based approaches, and humanitarian action globally.",
    image: "/assets/academic-thumbnail-1.png",
  },
];

interface AcademicDepartmentsProps {
  data?: Partial<PageSectionData>;
}

export default function AcademicDepartments({ data }: AcademicDepartmentsProps) {
  const badge = data?.badge ?? "Our Disciplines";
  const title = data?.title ?? "Six Academic Departments";
  const subtitle =
    data?.subtitle ??
    "Each department provides dedicated research, programs, and scholarship addressing the critical issues of our time through an interdisciplinary lens.";
  const actionText = data?.actionText ?? "Contact Us";
  const actionUrl = data?.actionUrl ?? "/contact";

  const departmentsList: Department[] =
    Array.isArray(data?.metadata?.departments) && data.metadata.departments.length > 0
      ? (data.metadata.departments as Department[])
      : defaultDepartments;

  return (
    <section className="bg-white py-16 md:py-24 lg:py-[140px] px-6 sm:px-10 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex flex-col gap-4 max-w-[850px]">
            {/* Pill Badge */}
            {badge && (
              <div className="w-fit border border-[#00698c] rounded-full px-3 py-1.5">
                <span className="font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase text-[#0a0d12]">
                  {badge}
                </span>
              </div>
            )}

            {/* Heading */}
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight sm:leading-[44px]">
              {title}
            </h2>

            {/* Subtitle */}
            {subtitle && (
              <p className="font-sans text-base sm:text-lg lg:text-[20px] text-[#0a0d12]/80 leading-relaxed sm:leading-[30px]">
                {subtitle}
              </p>
            )}
          </div>

          {/* Contact Button */}
          {actionText && (
            <div className="shrink-0">
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full shadow-xs transition-colors duration-200"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>

        {/* 6 Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[30px]">
          {departmentsList.map((dept) => (
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

                {/* Hover/Active Arrow Button */}
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
      </div>
    </section>
  );
}
