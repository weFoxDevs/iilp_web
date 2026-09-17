import React, { useState } from "react";
import Image from "next/image";

interface ValueCardItem {
  nodeId: string;
  emoji: string;
  title: string;
  description: string;
}

const valueCards: ValueCardItem[] = [
  {
    nodeId: "155:76744",
    emoji: "🎓",
    title: "Fund Research & Scholarships",
    description:
      "Support emerging scholars and researchers advancing human rights, governance, and development.",
  },
  {
    nodeId: "155:76760",
    emoji: "📚",
    title: "Publications & Policy Briefs",
    description:
      "Enable the production of open-access research, policy briefs, and scholarly publications.",
  },
  {
    nodeId: "155:76777",
    emoji: "🌐",
    title: "Global Fellowship Network",
    description:
      "Support the Global Fellowship Network connecting researchers and emerging leaders worldwide.",
  },
  {
    nodeId: "155:76769",
    emoji: "🎤",
    title: "Conferences & Events",
    description:
      "Fund conferences, seminars, and workshops that advance policy dialogue and knowledge exchange.",
  },
  {
    nodeId: "155:76784",
    emoji: "🏛️",
    title: "Institutional Development",
    description:
      "Contribute to IILP's long-term institutional capacity building and growth.",
  },
];

import { PageSectionData } from "@/common/services/cms.service";

const presetAmounts = [25, 50, 100, 150];

interface DonateMainSectionProps {
  data?: Partial<PageSectionData>;
}

export function DonateMainSection({ data }: DonateMainSectionProps = {}) {
  const badge = data?.badge || "Why Give";
  const title = data?.title || "Support IILP's Mission";
  const subtitle =
    data?.subtitle ||
    data?.bodyContent ||
    "Your donation directly supports IILP's mission of advancing knowledge, justice, and leadership for global change. Every contribution — large or small — makes a meaningful difference.";

  const [frequency, setFrequency] = useState<"Monthly" | "One-Time">("Monthly");
  const [selectedPreset, setSelectedPreset] = useState<number | "custom">("custom");
  const [customAmount, setCustomAmount] = useState("30");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentAmount =
    selectedPreset === "custom"
      ? Number(customAmount) || 0
      : selectedPreset;

  const handlePresetClick = (amount: number) => {
    setSelectedPreset(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomClick = () => {
    setSelectedPreset("custom");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMessage("Please fill out all required fields marked with *");
      return;
    }
    if (currentAmount <= 0) {
      setErrorMessage("Please enter a valid donation amount.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({ fullName: "", email: "", message: "" });
    setSubmitted(false);
  };

  return (
    <section
      className="bg-white flex flex-col gap-16 lg:gap-[120px] items-start px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] py-16 sm:py-24 lg:py-[140px] relative w-full"
      data-node-id="155:76605"
      data-name="misson and vision"
    >
      <div
        className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-[80px] items-start"
        data-node-id="155:76606"
      >
        {/* Left Column: Why Give (Figma node 155:76607) */}
        <div
          className="flex flex-1 flex-col gap-10 lg:gap-[80px] items-start w-full"
          data-node-id="155:76607"
          data-name="Container"
        >
          {/* Heading Container (Figma node 155:76661) */}
          <div
            className="flex flex-col gap-[30px] items-start relative shrink-0 w-full"
            data-node-id="155:76661"
          >
            <div
              className="flex flex-col gap-4 items-start relative shrink-0 w-full"
              data-node-id="155:76662"
            >
              {/* Pill Badge */}
              <div
                className="border border-[#00698c] border-solid flex flex-col items-start px-[12px] py-[8px] relative rounded-[1000px] shrink-0"
                data-node-id="155:76663"
              >
                <span
                  className="font-sans font-semibold leading-[17.6px] text-[#0a0d12] text-[16px] uppercase whitespace-nowrap"
                  data-node-id="155:76665"
                >
                  {badge}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-3xl sm:text-4xl lg:text-[36px] tracking-[-0.72px] w-full max-w-[580px]"
                data-node-id="155:76666"
              >
                {title}
              </h2>
            </div>

            {/* Description */}
            <p
              className="font-sans font-normal leading-[30px] text-[#0a0d12]/70 text-lg sm:text-[20px] max-w-[580px]"
              data-node-id="155:76668"
            >
              {subtitle}
            </p>
          </div>

          {/* 5 ValueCards List (Figma node 155:76768) */}
          <div
            className="flex flex-col gap-[16px] items-start relative shrink-0 w-full"
            data-node-id="155:76768"
          >
            {valueCards.map((card) => (
              <div
                key={card.nodeId}
                className="bg-white border border-[#b0ebff] flex gap-[24px] items-start p-[24px] relative shrink-0 w-full rounded-xl sm:rounded-none shadow-xs hover:border-[#00698c] transition-colors"
                data-node-id={card.nodeId}
                data-name="ValueCard"
              >
                {/* Emoji Icon Container (64x64) */}
                <div
                  className="bg-[#e6f9ff] border border-[#b0ebff] flex flex-col items-center justify-center p-[16px] relative shrink-0 w-[64px] h-[64px] rounded-lg sm:rounded-none"
                  data-name="Container"
                >
                  <span className="font-sans text-[24px] leading-[32px] select-none">
                    {card.emoji}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-[12px] items-start min-w-0">
                  <h3 className="font-serif font-bold text-[#000080] text-[24px] leading-normal w-full">
                    {card.title}
                  </h3>
                  <p className="font-sans font-normal text-[#414651] text-[16px] leading-[24px] w-full">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Make a Gift Form (Figma node 155:76791) */}
        <div
          className="bg-[#e6f9ff] flex flex-col gap-[28px] items-start p-6 sm:p-8 lg:p-[32px] relative shrink-0 w-full lg:w-[500px] rounded-2xl lg:rounded-none"
          data-node-id="155:76791"
        >
          {/* Header */}
          <div
            className="flex flex-col gap-4 items-start relative shrink-0 w-full"
            data-node-id="155:76792"
          >
            {/* Pill Badge */}
            <div
              className="border border-[#00698c] border-solid flex flex-col items-start px-[12px] py-[8px] relative rounded-[1000px] shrink-0"
              data-node-id="155:76793"
            >
              <span
                className="font-sans font-semibold leading-[17.6px] text-[#0a0d12] text-[16px] uppercase whitespace-nowrap"
                data-node-id="155:76795"
              >
                Make a Gift
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-3xl sm:text-4xl lg:text-[36px] tracking-[-0.72px] w-full"
              data-node-id="155:76796"
            >
              Donate to IILP
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white rounded-xl p-8 flex flex-col items-center justify-center text-center gap-4 my-auto min-h-[440px] w-full shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#e6f9ff] text-[#00698c] flex items-center justify-center mb-2">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0a0d12]">
                Thank You for Your Support!
              </h3>
              <p className="font-sans text-gray-600 max-w-[360px] leading-relaxed">
                Your generous gift of{" "}
                <span className="font-semibold text-[#000080]">
                  ${currentAmount} {frequency === "Monthly" ? "/ month" : ""}
                </span>{" "}
                empowers scholars and defenders of justice around the world.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#00bfff] text-white font-semibold hover:bg-[#009cd9] transition-colors shadow-xs"
              >
                Make Another Gift
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                  {errorMessage}
                </div>
              )}

              {/* Frequency Toggle (Figma node 155:76927) */}
              <div
                className="bg-white border border-[#e6f9ff] flex gap-[4px] items-start p-[4px] relative rounded-full shrink-0 w-full"
                data-node-id="155:76927"
              >
                <button
                  type="button"
                  onClick={() => setFrequency("Monthly")}
                  className={`flex flex-1 items-center justify-center py-[10px] px-[16px] rounded-full font-sans font-semibold text-sm transition-all cursor-pointer ${
                    frequency === "Monthly"
                      ? "bg-[#1e2939] text-white shadow-xs"
                      : "bg-white text-[#4a5565] hover:text-black"
                  }`}
                  data-node-id="155:76928"
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("One-Time")}
                  className={`flex flex-1 items-center justify-center py-[10px] px-[16px] rounded-full font-sans font-semibold text-sm transition-all cursor-pointer ${
                    frequency === "One-Time"
                      ? "bg-[#1e2939] text-white shadow-xs"
                      : "bg-white text-[#4a5565] hover:text-black"
                  }`}
                  data-node-id="155:76929"
                >
                  One-Time
                </button>
              </div>

              {/* Donation Amount Presets & Custom Input (Figma node 155:76996) */}
              <div
                className="flex flex-col gap-[8px] items-start relative shrink-0 w-full"
                data-node-id="155:76996"
              >
                {/* Presets Row */}
                <div
                  className="flex gap-[8px] items-start relative shrink-0 w-full flex-wrap sm:flex-nowrap"
                  data-node-id="155:76976"
                >
                  {presetAmounts.map((amt) => {
                    const isSelected = selectedPreset === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handlePresetClick(amt)}
                        className={`flex items-center justify-center px-[20px] py-[12px] border border-[#e5e7eb] font-sans font-semibold text-base transition-colors cursor-pointer flex-1 ${
                          isSelected
                            ? "bg-[#000080] text-white border-[#000080]"
                            : "bg-[#f9fafb] text-[#4a5565] hover:border-[#000080]"
                        }`}
                      >
                        ${amt}
                      </button>
                    );
                  })}

                  {/* Custom Button */}
                  <button
                    type="button"
                    onClick={handleCustomClick}
                    className={`flex flex-1 items-center justify-center px-[20px] py-[12px] border font-sans font-semibold text-base transition-colors cursor-pointer ${
                      selectedPreset === "custom"
                        ? "bg-[#000080] text-white border-[#000080]"
                        : "bg-[#f9fafb] text-[#4a5565] border-[#e5e7eb] hover:border-[#000080]"
                    }`}
                    data-node-id="155:77110"
                  >
                    Custom
                  </button>
                </div>

                {/* Amount Input with currency & spin controls */}
                <div
                  className="flex flex-col gap-[10px] items-start relative shrink-0 w-full"
                  data-node-id="155:77073"
                >
                  <div className="bg-[#f9fafb] border border-[#1447e6] flex gap-[8px] items-center px-[16px] py-[14px] relative shrink-0 w-full">
                    <span className="text-[#101828] font-sans font-semibold text-base">
                      $
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(e) => {
                        setSelectedPreset("custom");
                        setCustomAmount(e.target.value);
                      }}
                      className="w-full bg-transparent font-sans text-base text-[#101828] outline-hidden leading-[24px]"
                      placeholder="30"
                    />
                    <div className="relative shrink-0 size-[16px] pointer-events-none opacity-60">
                      <Image
                        src="/icons/donate/chevron-up-down.svg"
                        alt="Adjust amount"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor Inputs (Figma node 155:76798) */}
              <div
                className="flex flex-col gap-[20px] items-start relative shrink-0 w-full"
                data-node-id="155:76798"
              >
                {/* Row: Full Name & Email Address */}
                <div
                  className="flex flex-col sm:flex-row gap-[20px] items-start relative shrink-0 w-full"
                  data-node-id="155:77123"
                >
                  {/* Full Name */}
                  <div
                    className="flex flex-1 flex-col gap-[10px] items-start relative shrink-0 w-full"
                    data-node-id="155:76897"
                  >
                    <label className="flex gap-[4px] items-center font-sans font-medium text-sm leading-[20px] text-[#101828]">
                      <span>Full Name</span>
                      <span className="text-[#c70036]">*</span>
                    </label>
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Placeholder text"
                        required
                        className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div
                    className="flex flex-1 flex-col gap-[10px] items-start relative shrink-0 w-full"
                    data-node-id="155:76909"
                  >
                    <label className="flex gap-[4px] items-center font-sans font-medium text-sm leading-[20px] text-[#101828]">
                      <span>Email Address</span>
                      <span className="text-[#c70036]">*</span>
                    </label>
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@company.com"
                        required
                        className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Field (h-[113px]) */}
                <div
                  className="flex flex-col gap-[10px] h-[113px] items-start relative shrink-0 w-full"
                  data-node-id="155:76814"
                >
                  <label className="font-sans font-medium text-sm leading-[20px] text-[#101828]">
                    Message
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] flex flex-1 items-start px-[16px] py-[14px] relative w-full transition-colors">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Write your message here..."
                      className="w-full h-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden resize-none leading-[24px]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button (Figma node 155:76815) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00bfff] hover:bg-[#009cd9] active:bg-[#0086bc] drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex gap-[6px] items-center justify-center px-[24px] py-[14px] relative rounded-full shrink-0 w-full cursor-pointer transition-colors disabled:opacity-70 mt-1"
                data-node-id="155:76815"
              >
                <span className="font-sans font-semibold text-white text-[16px] leading-[24px] whitespace-nowrap">
                  {isSubmitting
                    ? "Processing..."
                    : `Donate $${currentAmount || 0}`}
                </span>
              </button>

              {/* Security Tag (Figma node 155:77124) */}
              <div
                className="flex gap-[6px] items-center justify-center px-[12px] py-[6px] relative rounded-full shrink-0 w-full"
                data-node-id="155:77124"
              >
                <div className="relative shrink-0 size-[14px]">
                  <Image
                    src="/icons/donate/lock.svg"
                    alt="Lock"
                    width={14}
                    height={14}
                    className="w-[14px] h-[14px]"
                  />
                </div>
                <p className="font-sans font-semibold text-[12px] leading-[20px] text-[#717680] text-center">
                  Secure donation. IILP is an independent non-profit institute.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
