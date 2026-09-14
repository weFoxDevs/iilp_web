import React, { useState } from "react";

export function NewsletterArchive() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    }
  };

  return (
    <section className="bg-white pb-16 lg:pb-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto w-full">
        <div className="bg-[#160d03] rounded-[8px] min-h-[460px] lg:h-[550px] p-8 sm:p-12 lg:pl-[64px] lg:pr-[76px] lg:pt-[61px] lg:pb-[69px] flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-16">
          {/* Left Column: Heading 2 */}
          <div className="w-full lg:max-w-[451px] shrink-0 pt-2 lg:pt-4">
            <h2 className="font-serif font-medium text-3xl sm:text-4xl md:text-5xl lg:text-[48px] text-white tracking-[-1.5px] leading-tight lg:leading-[62.4px]">
              Newsletter Archive
            </h2>
          </div>

          {/* Right Column: Description & Subscribe Form */}
          <div className="flex flex-col items-start gap-8 w-full lg:max-w-[500px] my-auto">
            <p className="font-serif font-bold text-xl sm:text-2xl lg:text-[24px] text-white leading-snug">
              IILP&apos;s newsletter will be published regularly with research
              highlights, event announcements, and institutional updates. Past
              editions will be archived here.
            </p>

            {isSubscribed ? (
              <div className="w-full bg-[#00bfff]/20 border border-[#00bfff] rounded-full px-6 py-3.5 text-white font-sans text-sm font-medium flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00bfff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Thank you for subscribing to IILP updates!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="w-full border border-[#00bfff] rounded-[40px] flex items-center h-[50px] bg-black/20 overflow-hidden"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL..."
                  className="flex-1 bg-transparent px-5 py-3 text-[16px] font-sans text-white placeholder-[#fdfdfd]/80 outline-none uppercase tracking-wider"
                />

                <button
                  type="submit"
                  className="bg-[#00bfff] hover:bg-sky-400 h-[50px] rounded-[30px] flex items-center gap-3.5 pl-2.5 pr-6 shrink-0 text-white font-sans font-semibold text-[16px] uppercase tracking-wider leading-[17.6px] transition-colors cursor-pointer"
                >
                  <span className="size-7 rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00bfff"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
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
