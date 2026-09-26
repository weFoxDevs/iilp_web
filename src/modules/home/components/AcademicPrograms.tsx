import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';
import { fetchDepartments } from '@/common/services/departments.service';

interface DepartmentItem {
  number: string;
  title: string;
  description: string;
  image?: string;
  isActive: boolean;
  slug?: string;
}

const defaultDepartments: DepartmentItem[] = [
  {
    number: "01",
    title: "Law & International Legal Studies",
    description: "Advancing legal scholarship, international law, and justice systems in a changing global order.",
    image: "/assets/academic-thumbnail-1.png",
    isActive: false,
    slug: "law-international-legal-studies",
  },
  {
    number: "02",
    title: "Political Science & Governance",
    description: "Examining governance frameworks, democratic institutions, and political systems worldwide.",
    image: "/assets/academic-thumbnail-1.png",
    isActive: true,
    slug: "political-science-governance",
  },
  {
    number: "03",
    title: "Human Rights & Humanitarian Studies",
    description: "Promoting human dignity, rights-based approaches, and humanitarian action globally.",
    image: "/assets/academic-thumbnail-1.png",
    isActive: false,
    slug: "human-rights-humanitarian-studies",
  },
];

interface AcademicProgramsProps {
  data?: Partial<PageSectionData>;
}

export function AcademicPrograms({ data }: AcademicProgramsProps) {
  const [apiDepartments, setApiDepartments] = useState<DepartmentItem[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchDepartments({ limit: 3, activeOnly: true })
      .then((items) => {
        if (isMounted && Array.isArray(items) && items.length > 0) {
          setApiDepartments(
            items.slice(0, 3).map((d, idx) => ({
              number: d.number || String(idx + 1).padStart(2, "0"),
              title: d.name,
              description: d.description,
              image: d.image || "/assets/academic-thumbnail-1.png",
              isActive: Boolean(d.isHighlighted),
              slug: d.slug,
            }))
          );
        }
      })
      .catch(() => {
        // graceful fallback to section metadata or defaults
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const section = {
    badge: data?.badge ?? 'Academic Programs',
    title: data?.title ?? 'Six Academic Departments',
    subtitle:
      data?.subtitle ??
      'Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.',
    actionText: data?.actionText || 'Explore All Departments',
    actionUrl: data?.actionUrl || '/academics',
    metadata: data?.metadata ?? {
      departments: defaultDepartments,
    },
  };

  const rawDepartments =
    apiDepartments ||
    ((section.metadata || {}).departments as DepartmentItem[]) ||
    defaultDepartments;

  const departments = (Array.isArray(rawDepartments) ? rawDepartments : defaultDepartments).slice(0, 3);

  return (
    <section className="w-full bg-[#e6f9ff] py-12 sm:py-16 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-10 sm:gap-[60px] lg:gap-[80px]">
        
        {/* Header */}
        <div className="flex flex-col items-center max-w-[680px] text-center gap-3 sm:gap-4">
          {section.badge && (
            <div className="border border-[#00698c] rounded-full px-3.5 py-1.5 sm:px-[12px] sm:py-[8px]">
              <span className="font-inter font-semibold text-xs sm:text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                {section.badge}
              </span>
            </div>
          )}

          <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12] max-w-[580px]">
            {section.title}
          </h2>

          <p className="font-inter font-normal text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]">
            {section.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-[30px] w-full">
          {departments.map((dept, index) => (
            <Link 
              key={index} 
              href={dept.slug ? `/academics/${dept.slug}` : (section.actionUrl || "/academics")} 
              className="flex flex-col gap-5 sm:gap-[30px] items-center w-full group cursor-pointer"
            >
              <div className="relative w-full aspect-[413/390] overflow-visible rounded-sm">
                <div className="absolute inset-0 overflow-hidden rounded-sm">
                  <Image 
                    src={dept.image || "/assets/academic-thumbnail-1.png"} 
                    alt={dept.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Number Badge */}
                <div className={`absolute top-3 left-3 sm:top-[20px] sm:left-[20px] w-16 h-16 sm:w-[91px] sm:h-[92px] flex items-center justify-center font-inter font-semibold text-2xl sm:text-[32px] leading-none transition-colors duration-300 z-10 rounded-xs shadow-xs
                  ${dept.isActive 
                    ? 'bg-[#00bfff] text-white' 
                    : 'bg-[#e6f9ff] text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-white'
                  }`}
                >
                  {dept.number}
                </div>

                {/* Arrow Button (Active / Hover State) */}
                <div className={`absolute bottom-2 right-2 sm:-bottom-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-[#f9fafb] border border-[#e5e7eb] rounded-full flex items-center justify-center shadow-md z-20 transition-all duration-300 group-hover:scale-110
                  ${dept.isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <Image 
                    src="/assets/academic-arrow-right.svg" 
                    alt="Arrow Right" 
                    width={20} 
                    height={20} 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 sm:gap-[10px] items-start justify-center w-full">
                <h3 className={`font-['Soria',var(--font-playfair),serif] font-bold text-xl sm:text-[24px] leading-tight sm:leading-[32px] transition-colors duration-300
                  ${dept.isActive ? 'text-[#00bfff]' : 'text-[#111111] group-hover:text-[#00bfff]'}`}
                >
                  {dept.title}
                </h3>
                <p className="font-source font-normal text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-[28px] text-[#666666]">
                  {dept.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Button */}
        {section.actionText && (
          <Link 
            href={section.actionUrl || "/academics"} 
            className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a2d6] px-6 py-3 sm:px-[24px] sm:py-[14px] shadow-sm transition-colors w-full sm:w-auto text-center min-h-[44px]"
          >
            <span className="font-source font-semibold text-white text-sm sm:text-[16px] leading-[24px]">
              {section.actionText}
            </span>
          </Link>
        )}

      </div>
    </section>
  );
}
