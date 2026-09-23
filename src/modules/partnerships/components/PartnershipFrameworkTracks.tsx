import React from "react";
import { PageSectionData } from "@/common/services/cms.service";

interface TrackItem {
  icon: string;
  title: string;
  description: string;
}

const defaultTopTracks: TrackItem[] = [
  {
    icon: "🎓",
    title: "University Partnerships",
    description:
      "Collaborative academic programs, joint research initiatives, student and faculty exchanges, and shared educational resources with universities worldwide.",
  },
  {
    icon: "🔬",
    title: "Research Collaborations",
    description:
      "Co-authorship of research publications, joint research projects, shared methodologies, and collaborative grant applications with research institutions.",
  },
  {
    icon: "🌐",
    title: "International Organizations",
    description:
      "Engagement with UN agencies, regional organizations, and international bodies to advance policy dialogue, advocacy, and institutional reform.",
  },
];

const defaultBottomTracks: TrackItem[] = [
  {
    icon: "🤝",
    title: "NGO Partnerships",
    description:
      "Strategic partnerships with non-governmental organizations working on human rights, humanitarian affairs, development, and civic society engagement.",
  },
  {
    icon: "🏛️",
    title: "Government Partnerships",
    description:
      "Advisory and policy engagement with government ministries, agencies, and institutions committed to evidence-based governance and policy reform.",
  },
];

interface PartnershipFrameworkTracksProps {
  data?: Partial<PageSectionData>;
}

export default function PartnershipFrameworkTracks({ data }: PartnershipFrameworkTracksProps) {
  const badge = data?.badge || "Global Network";
  const title = data?.title || "Partnership Framework";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "IILP actively seeks partnerships across five tracks, each designed to amplify the impact of collaborative knowledge-building and policy engagement.";

  const customTracks =
    Array.isArray(data?.metadata?.tracks) && data?.metadata?.tracks.length > 0
      ? (data?.metadata?.tracks as TrackItem[])
      : null;
  const topTracks = customTracks ? customTracks.slice(0, 3) : defaultTopTracks;
  const bottomTracks = customTracks ? customTracks.slice(3) : defaultBottomTracks;

  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px] items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
            <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
            {subtitle}
          </p>
        </div>

        {/* Tracks Grid */}
        <div className="flex flex-col gap-6 w-full">
          {/* Top Row: 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {topTracks.map((track, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#b0ebff] rounded-xl p-6 flex flex-col gap-6 items-start hover:shadow-md transition-shadow"
              >
                {/* Icon Container */}
                <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-lg w-16 h-16 flex items-center justify-center text-2xl shrink-0">
                  <span>{track.icon}</span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                    {track.title}
                  </h3>
                  <p className="font-sans font-normal text-base text-[#414651] leading-relaxed">
                    {track.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          {bottomTracks.length > 0 && (
            <div
              className={`grid grid-cols-1 ${
                bottomTracks.length === 1
                  ? "md:grid-cols-1 max-w-2xl mx-auto"
                  : "md:grid-cols-2"
              } gap-6 w-full`}
            >
              {bottomTracks.map((track, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#b0ebff] rounded-xl p-6 flex flex-col gap-6 items-start hover:shadow-md transition-shadow"
                >
                  {/* Icon Container */}
                  <div className="bg-[#e6f9ff] border border-[#b0ebff] rounded-lg w-16 h-16 flex items-center justify-center text-2xl shrink-0">
                    <span>{track.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3">
                    <h3 className="font-serif text-[#000080] text-2xl font-bold leading-tight">
                      {track.title}
                    </h3>
                    <p className="font-sans font-normal text-base text-[#414651] leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
