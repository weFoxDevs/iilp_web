import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { PageSectionData } from "@/common/services/cms.service";

interface AdmissionProgramPathway {
  id: string;
  name: string;
  icon: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
}

const defaultProgramPathways: AdmissionProgramPathway[] = [
  {
    id: "diploma",
    name: "Diploma Programs",
    icon: "/assets/tab-planet.svg",
    title: "Postgraduate Diploma Programs",
    description:
      "Comprehensive postgraduate-level programs designed for graduates and early-to-mid career professionals seeking deep specialization in law, politics, and international affairs.",
    eligibility: [
      "Bachelor's degree or higher in law, social sciences, or related discipline",
      "Demonstrated interest in international legal and political issues",
      "Proficiency in English (or primary instruction language)",
      "Official academic certificate, transcripts, and personal statement",
    ],
    benefits: [
      "Professional qualification recognized by international academic bodies",
      "In-depth curriculum taught by global leading faculty and practitioners",
      "Direct research supervision and policy brief publishing opportunities",
      "Full alumni access to IILP research library and global network",
    ],
  },
  {
    id: "certificate",
    name: "Certificate Programs",
    icon: "/assets/tab-hat.svg",
    title: "Specialized Certificate Programs",
    description:
      "Targeted, intensive credentials focused on core contemporary themes such as human rights law, public policy, humanitarian affairs, and peace studies.",
    eligibility: [
      "Minimum higher secondary or undergraduate standing",
      "Clear academic or professional interest in chosen study area",
      "Statement of purpose outlining motivations and career goals",
      "Commitment to participating in online discussions and assessments",
    ],
    benefits: [
      "Official IILP Academic Certificate upon successful completion",
      "Flexible online study format designed for working professionals",
      "Applied case study discussions and international policy analysis",
      "Networking with an international cohort of peer scholars",
    ],
  },
  {
    id: "training",
    name: "Professional Training",
    icon: "/assets/tab-trophy.svg",
    title: "Professional & Executive Training",
    description:
      "Executive-level workshops and training modules tailored for public officials, civil society leaders, legal counsel, and diplomats.",
    eligibility: [
      "Working professional with minimum 2-3 years in public or private sector",
      "Professional CV highlighting legal, policy, or leadership responsibilities",
      "Commitment to executive workshop schedules and simulation exercises",
      "Interest in multilateral diplomacy, arbitration, or human rights advocacy",
    ],
    benefits: [
      "Executive Certificate of Completion from IILP",
      "Applied skills in policy negotiation, advocacy, and strategic diplomacy",
      "Exclusive peer roundtables and Chatham House rule dialogues",
      "Inclusion in IILP Executive Practitioner Directory",
    ],
  },
  {
    id: "short-course",
    name: "Short Courses",
    icon: "/assets/tab-planet.svg",
    title: "Modular Short Courses",
    description:
      "Focused modular courses spanning 2 to 6 weeks, providing rapid foundational knowledge on critical global legal and governance issues.",
    eligibility: [
      "Open admission for students, researchers, and curious practitioners",
      "Basic interest in contemporary global political and legal issues",
      "Willingness to engage in weekly online readings and assignments",
      "No formal prerequisite degree strictly mandated",
    ],
    benefits: [
      "Modular Certificate of Participation and digital credential",
      "Self-paced interactive lectures and curated reading packs",
      "Direct feedback from course instructors and discussion forums",
      "Pathway credit transfer toward full IILP Diploma programs",
    ],
  },
];

interface AdmissionCategoriesProps {
  initialTab?: string;
  data?: Partial<PageSectionData>;
  onSelectProgramType?: (type: string) => void;
}

export default function AdmissionCategories({
  initialTab = "diploma",
  data,
  onSelectProgramType,
}: AdmissionCategoriesProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const badge = data?.badge ?? "Academic & Training Tracks";
  const title = data?.title ?? "Four Educational Pathways";
  const subtitle =
    data?.subtitle ??
    "IILP offers specialized academic and professional programs designed to prepare future leaders in law, politics, human rights, and governance.";

  const pathwaysList: AdmissionProgramPathway[] =
    Array.isArray(data?.metadata?.pathways) && data.metadata.pathways.length > 0
      ? (data.metadata.pathways as AdmissionProgramPathway[])
      : defaultProgramPathways;

  useEffect(() => {
    if (router.isReady && router.query.track) {
      setActiveTab(router.query.track as string);
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [router.isReady, router.query.track, initialTab]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (router.isReady) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, track: tabId },
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  };

  const handleApplyForTrack = (trackName: string) => {
    let mappedType = trackName;
    if (trackName.toLowerCase().includes("diploma")) mappedType = "Diploma Program";
    else if (trackName.toLowerCase().includes("certificate")) mappedType = "Certificate Program";
    else if (trackName.toLowerCase().includes("training")) mappedType = "Professional Training Program";
    else if (trackName.toLowerCase().includes("short")) mappedType = "Short Course";

    if (onSelectProgramType) {
      onSelectProgramType(mappedType);
    }
    const el = document.getElementById("apply");
    if (el) {
      const headerOffset = 85;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  const currentPathway =
    pathwaysList.find((p) => p.id === activeTab) || pathwaysList[0];

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px] items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          {badge && (
            <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-1.5">
              <span className="font-sans font-semibold text-xs sm:text-sm text-[#0a0d12] uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}

          {/* Heading */}
          <h2 className="font-serif font-medium text-2xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-tight leading-tight lg:leading-[44px]">
            {title}
          </h2>

          {/* Subheading */}
          {subtitle && (
            <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
              {subtitle}
            </p>
          )}
        </div>

        {/* Tab Filter Pills */}
        <div className="bg-[#e6f9ff] border border-[#e6f9ff] rounded-2xl sm:rounded-full p-1.5 flex flex-wrap sm:flex-nowrap gap-1.5 items-center justify-center">
          {pathwaysList.map((pathway) => {
            const isActive = activeTab === pathway.id;
            return (
              <button
                key={pathway.id}
                onClick={() => handleTabClick(pathway.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans font-semibold text-sm transition-all drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] cursor-pointer ${
                  isActive
                    ? "bg-[#1e2939] text-white"
                    : "bg-white text-[#4a5565] border border-[#e5e7eb] hover:text-[#101828] hover:bg-gray-50"
                }`}
              >
                <span className="w-4 h-4 relative shrink-0 flex items-center justify-center">
                  <Image
                    src={pathway.icon}
                    alt={pathway.name}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </span>
                <span>{pathway.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mission and Content Container */}
        <div className="bg-[#00506b] rounded-2xl sm:rounded-3xl p-4 sm:p-10 lg:p-[40px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-[23px] items-stretch w-full">
            {/* Column 1: Program Overview */}
            <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-xl p-6 sm:p-[30px] flex flex-col gap-6 justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                  {currentPathway.title}
                </h3>
                <p className="font-sans font-normal text-base sm:text-lg text-[#00506b] leading-relaxed lg:leading-[28px]">
                  {currentPathway.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleApplyForTrack(currentPathway.name)}
                  className="inline-flex items-center justify-center bg-[#000080] hover:bg-[#000066] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-xs cursor-pointer"
                >
                  Apply for this Track &darr;
                </button>
              </div>
            </div>

            {/* Column 2: Eligibility Criteria */}
            <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-xl p-6 sm:p-[30px] flex flex-col gap-6">
              <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                Admission Criteria
              </h3>
              <ul className="flex flex-col gap-4">
                {currentPathway.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 shrink-0 relative mt-0.5">
                      <Image
                        src="/assets/checkmark-circle-sky.svg"
                        alt="Checkmark"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <span className="font-sans font-normal text-base sm:text-lg text-[#00506b] leading-relaxed lg:leading-[28px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Academic Benefits */}
            <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-xl p-6 sm:p-[30px] flex flex-col gap-6">
              <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                Program Benefits
              </h3>
              <ul className="flex flex-col gap-4">
                {currentPathway.benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-6 h-6 shrink-0 relative mt-0.5">
                      <Image
                        src="/assets/checkmark-circle-sky.svg"
                        alt="Checkmark"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                      />
                    </div>
                    <span className="font-sans font-normal text-base sm:text-lg text-[#00506b] leading-relaxed lg:leading-[28px]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
