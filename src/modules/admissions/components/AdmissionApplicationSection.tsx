import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { PageSectionData } from "@/common/services/cms.service";
import AdmissionApplicationForm from "./AdmissionApplicationForm";
import AdmissionStatusTracker from "./AdmissionStatusTracker";

interface AdmissionApplicationSectionProps {
  data?: Partial<PageSectionData>;
  initialProgramType?: string;
}

export default function AdmissionApplicationSection({
  data,
  initialProgramType,
}: AdmissionApplicationSectionProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"apply" | "track">("apply");

  const badge = data?.badge ?? "Online Application Portal";
  const title = data?.title ?? "Submit Your Admission Application";
  const subtitle =
    data?.subtitle ??
    "Complete the official admission form below for academic programs, diplomas, certificates, and professional training. You will receive an official reference number and automated confirmation email.";

  useEffect(() => {
    if (router.query.tab === "track") {
      setActiveTab("track");
    } else {
      setActiveTab("apply");
    }
  }, [router.query.tab]);

  const initialRef = typeof router.query.ref === "string" ? router.query.ref : "";
  const initialEmail = typeof router.query.email === "string" ? router.query.email : "";

  const handleTabSwitch = (tab: "apply" | "track") => {
    setActiveTab(tab);
    if (router.isReady) {
      const targetQuery = tab === "track" ? { ...router.query, tab: "track" } : { ...router.query };
      if (tab === "apply") {
        delete targetQuery.tab;
      }
      router.push(
        {
          pathname: "/apply",
          query: targetQuery,
          hash: "apply",
        },
        undefined,
        { shallow: true, scroll: false }
      );
    }
  };

  return (
    <section
      id="apply"
      className="bg-[#e6f9ff] py-12 sm:py-20 lg:py-[120px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] scroll-mt-24"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8 lg:gap-[48px] items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          {badge && (
            <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5 bg-white/60 backdrop-blur-xs">
              <span className="font-sans font-semibold text-xs sm:text-sm text-[#0a0d12] uppercase tracking-wider">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="font-serif font-medium text-2xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-tight leading-tight lg:leading-[44px]">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="font-sans font-normal text-sm sm:text-base lg:text-[18px] text-[#4a5565] leading-relaxed lg:leading-[28px] max-w-[760px]">
              {subtitle}
            </p>
          )}

          {/* Mode Switcher Tabs */}
          <div className="bg-white/90 backdrop-blur-xs border border-[#b0ebff] rounded-full p-1.5 inline-flex items-center gap-1.5 shadow-xs mt-1">
            <button
              type="button"
              onClick={() => handleTabSwitch("apply")}
              className={`px-5 py-2.5 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "apply"
                  ? "bg-[#000080] text-white shadow-xs"
                  : "text-[#4a5565] hover:text-[#000080] hover:bg-gray-50"
              }`}
            >
              New Application Form
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("track")}
              className={`px-5 py-2.5 rounded-full font-sans font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === "track"
                  ? "bg-[#000080] text-white shadow-xs"
                  : "text-[#4a5565] hover:text-[#000080] hover:bg-gray-50"
              }`}
            >
              Track Application Status
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div id="apply-form-container" className="w-full max-w-[920px]">
          {activeTab === "apply" ? (
            <AdmissionApplicationForm initialProgramType={initialProgramType} />
          ) : (
            <AdmissionStatusTracker
              initialRef={initialRef}
              initialEmail={initialEmail}
            />
          )}
        </div>
      </div>
    </section>
  );
}
