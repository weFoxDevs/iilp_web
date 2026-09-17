import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { PageSectionData } from "@/common/services/cms.service";

interface FellowshipPathway {
  id: "research" | "junior" | "honorary";
  name: string;
  icon: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
}

const defaultPathways: FellowshipPathway[] = [
  {
    id: "research",
    name: "Research Fellows",
    icon: "/assets/tab-planet.svg",
    title: "Research Fellows",
    description:
      "For established researchers and academics advancing IILP's scholarly agenda. Research Fellows lead institutional research initiatives, contribute to publications, and participate in academic governance.",
    eligibility: [
      "PhD or equivalent in a relevant field",
      "Established research record with publications",
      "Demonstrated expertise in IILP's areas of focus",
      "Commitment to advancing evidence-based policy",
    ],
    benefits: [
      "Institutional affiliation with IILP",
      "Access to IILP's research network and resources",
      "Co-authorship opportunities on IILP publications",
      "Participation in IILP conferences and events",
      "Recognition in IILP's Global Fellowship Directory",
    ],
  },
  {
    id: "junior",
    name: "Junior Fellows",
    icon: "/assets/tab-hat.svg",
    title: "Junior Fellows",
    description:
      "For emerging scholars and early-career professionals committed to impactful research. Junior Fellows contribute to research projects under senior mentorship and develop their scholarly profile.",
    eligibility: [
      "Master's degree or equivalent in a relevant field",
      "Strong academic record and research potential",
      "Interest in IILP's thematic areas",
      "Commitment to interdisciplinary scholarship",
    ],
    benefits: [
      "Mentorship from senior IILP researchers",
      "Institutional affiliation and profile",
      "Research support and publishing opportunities",
      "Training and capacity development programs",
      "Access to IILP's academic network",
    ],
  },
  {
    id: "honorary",
    name: "Honorary Fellows",
    icon: "/assets/tab-trophy.svg",
    title: "Honorary Fellows",
    description:
      "Recognizing distinguished individuals who have made exceptional contributions to the fields IILP serves. Honorary Fellows receive recognition without service obligations.",
    eligibility: [
      "Distinguished record of contributions to law, politics, human rights, or related fields",
      "National or international recognition in their domain",
      "Alignment with IILP's values and mission",
      "Nomination by IILP leadership or existing fellows",
    ],
    benefits: [
      "Recognition as an Honorary Fellow of IILP",
      "Listing in IILP's Official Fellowship Directory",
      "Invitation to IILP events and dialogues",
      "Association with IILP's global institutional network",
    ],
  },
];

interface FellowshipCategoriesProps {
  initialTab?: "research" | "junior" | "honorary";
  data?: Partial<PageSectionData>;
}

export default function FellowshipCategories({
  initialTab = "research",
  data,
}: FellowshipCategoriesProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"research" | "junior" | "honorary">(
    initialTab
  );

  const badge = data?.badge ?? "Fellowship Categories";
  const title = data?.title ?? "Three Fellowship Pathways";
  const subtitle =
    data?.subtitle ??
    "IILP offers three fellowship categories designed to engage scholars and professionals at different stages of their careers.";

  const pathwaysList: FellowshipPathway[] =
    Array.isArray(data?.metadata?.pathways) && data.metadata.pathways.length > 0
      ? (data.metadata.pathways as FellowshipPathway[])
      : defaultPathways;

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      const tab = router.query.tab as string;
      if (tab === "junior" || tab === "honorary" || tab === "research") {
        setActiveTab(tab);
      }
    } else if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [router.isReady, router.query.tab, initialTab]);

  const handleTabClick = (tabId: "research" | "junior" | "honorary") => {
    setActiveTab(tabId);
    if (router.isReady) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: tabId },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const currentPathway =
    pathwaysList.find((p) => p.id === activeTab) || pathwaysList[0];

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
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
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
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
        <div className="bg-[#e6f9ff] border border-[#e6f9ff] rounded-full p-1 flex flex-wrap sm:flex-nowrap gap-1 items-center justify-center">
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


        {/* Mission and Vision Container */}
        <div className="bg-[#00506b] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-[40px] w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-[23px] items-stretch w-full">
            {/* Column 1: Role Overview */}
            <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-xl p-6 sm:p-[30px] flex flex-col gap-6 justify-start">
              <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                {currentPathway.title}
              </h3>
              <p className="font-sans font-normal text-base sm:text-lg text-[#00506b] leading-relaxed lg:leading-[28px]">
                {currentPathway.description}
              </p>
            </div>

            {/* Column 2: Eligibility Criteria */}
            <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-xl p-6 sm:p-[30px] flex flex-col gap-6">
              <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                Eligibility Criteria
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

            {/* Column 3: Fellowship Benefits */}
            <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-xl p-6 sm:p-[30px] flex flex-col gap-6">
              <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                Fellowship Benefits
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
