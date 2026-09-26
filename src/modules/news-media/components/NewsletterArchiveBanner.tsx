import React, { useState } from "react";
import { PageSectionData } from "@/common/services/cms.service";

interface NewsletterArchiveBannerProps {
  data?: Partial<PageSectionData>;
}

export default function NewsletterArchiveBanner({ data }: NewsletterArchiveBannerProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const title = data?.title || "Newsletter Archive";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "IILP's newsletter will be published regularly with research highlights, event announcements, and institutional updates. Past editions will be archived here.";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <section className="bg-white pb-12 sm:pb-24 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="bg-[#160d03] rounded-[8px] sm:rounded-xl min-h-[380px] lg:h-[550px] p-6 sm:p-12 lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] lg:pb-[69px] flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-16">
          {/* Left Column: Heading */}
          <div className="w-full lg:max-w-[451px] shrink-0 pt-2 lg:pt-4">
            <h2 className="font-serif font-medium text-2xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-tight sm:tracking-[-1.5px] leading-tight lg:leading-[62.4px]">
              {title}
            </h2>
          </div>

          {/* Right Column: Description & Subscribe Form */}
          <div className="flex flex-col items-start gap-6 lg:gap-[32px] w-full lg:max-w-[500px] my-auto">
            <p className="font-serif font-bold text-base sm:text-xl lg:text-[24px] text-white leading-normal">
              {subtitle}
            </p>

            {subscribed ? (
              <div className="bg-[#00bfff]/20 border border-[#00bfff] rounded-full px-6 py-3 text-white font-sans text-sm font-medium">
                Thank you for subscribing to our newsletter!
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="border border-[#00bfff] rounded-2xl sm:rounded-[40px] flex flex-col sm:flex-row items-stretch sm:items-center w-full min-h-[50px] overflow-hidden bg-black/20 p-1 sm:p-0 gap-2 sm:gap-0"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL..."
                  required
                  className="flex-1 bg-transparent px-4 py-3 sm:px-[20px] sm:py-[15px] text-sm sm:text-[16px] font-sans text-white placeholder-[#fdfdfd]/80 outline-none uppercase tracking-wider"
                />
                <button
                  type="submit"
                  className="bg-[#00bfff] hover:bg-sky-400 h-11 sm:h-[50px] rounded-xl sm:rounded-[30px] flex items-center justify-center gap-3 sm:gap-[14px] px-4 sm:pl-[9px] sm:pr-[24px] py-2 sm:py-[11px] shrink-0 text-white font-sans font-semibold text-sm sm:text-[16px] uppercase tracking-wider leading-[17.6px] transition-colors cursor-pointer"
                >
                  <span className="size-6 sm:size-[28px] rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg
                      width="12"
                      height="14"
                      viewBox="0 0 14 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 8H13M13 8L7 2M13 8L7 14"
                        stroke="#00bfff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>subscribe</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
