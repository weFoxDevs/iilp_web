import React from "react";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";

export interface GivingChannelItem {
  title: string;
  description: string;
  actionText?: string;
  actionUrl?: string;
  badge?: string;
}

export const defaultGivingChannels: GivingChannelItem[] = [
  {
    title: "Online Card & Wire Transfer",
    description:
      "Support directly through recurring monthly or one-off international bank wire transfers.",
    actionText: "View Bank Details",
    actionUrl: "mailto:donate@iilp.org?subject=Wire%20Transfer%20Details",
    badge: "Fast & Direct",
  },
  {
    title: "Endowments & Fellowships",
    description:
      "Establish a named research chair, academic scholarship fund, or junior fellowship program.",
    actionText: "Partner with Us",
    actionUrl: "/contact",
    badge: "Institutional",
  },
  {
    title: "Institutional & DAF Giving",
    description:
      "Direct philanthropic contributions via Donor-Advised Funds, foundation grants, or institutional partnerships.",
    actionText: "Contact Advancement",
    actionUrl: "mailto:giving@iilp.org",
    badge: "Tax-Exempt",
  },
];

interface WaysToGiveSectionProps {
  data?: Partial<PageSectionData>;
}

export function WaysToGiveSection({ data }: WaysToGiveSectionProps) {
  if (data?.isActive === false) return null;

  const badge = data?.badge || "Ways to Give";
  const title = data?.title || "Direct Channels & Institutional Giving";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "Explore diverse avenues to partner with and support the International Institute for Law and Politics.";

  const channels: GivingChannelItem[] =
    Array.isArray(data?.metadata?.channels) && data.metadata.channels.length > 0
      ? (data.metadata.channels as GivingChannelItem[])
      : defaultGivingChannels;

  return (
    <section className="bg-[#f8fcff] border-t border-[#d8f0fa] py-12 sm:py-20 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-12">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto">
          <div className="border border-[#00698c] px-3.5 py-1.5 rounded-full bg-white shadow-2xs">
            <span className="font-sans font-semibold text-xs uppercase tracking-wider text-[#00698c]">
              {badge}
            </span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#0a0d12] tracking-tight">
            {title}
          </h2>
          <p className="font-sans text-gray-600 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Giving Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {channels.map((channel, idx) => {
            const isInternal = channel.actionUrl?.startsWith("/");
            return (
              <div
                key={`giving-ch-${idx}`}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-[#cbeaf7] shadow-xs flex flex-col justify-between gap-6 hover:shadow-md hover:border-[#00698c] transition-all"
              >
                <div className="space-y-3">
                  {channel.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#e6f9ff] text-[#00698c] font-bold text-[11px] uppercase tracking-wider">
                      {channel.badge}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-xl text-[#000080]">
                    {channel.title}
                  </h3>
                  <p className="font-sans text-sm text-gray-600 leading-relaxed">
                    {channel.description}
                  </p>
                </div>

                {channel.actionUrl && (
                  <div className="pt-2">
                    {isInternal ? (
                      <Link
                        href={channel.actionUrl}
                        className="inline-flex items-center gap-2 font-sans font-bold text-xs sm:text-sm text-[#00698c] hover:text-[#000080] transition-colors"
                      >
                        <span>{channel.actionText || "Learn More"}</span>
                        <span>&rarr;</span>
                      </Link>
                    ) : (
                      <a
                        href={channel.actionUrl}
                        className="inline-flex items-center gap-2 font-sans font-bold text-xs sm:text-sm text-[#00698c] hover:text-[#000080] transition-colors"
                      >
                        <span>{channel.actionText || "Learn More"}</span>
                        <span>&rarr;</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
