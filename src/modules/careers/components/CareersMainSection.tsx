import React, { useState, useRef } from "react";
import Image from "next/image";

interface ValueCardItem {
  id: string;
  title: string;
  description: string;
  nodeId: string;
}

const OPPORTUNITY_CARDS: ValueCardItem[] = [
  {
    id: "research",
    title: "Research & Academic",
    description: "Researchers, department heads, academic coordinators, and fellows.",
    nodeId: "155:77170",
  },
  {
    id: "communications",
    title: "Communications & Media",
    description: "Content writers, media officers, digital communications, and PR professionals.",
    nodeId: "155:77177",
  },
  {
    id: "program",
    title: "Program Management",
    description: "Finance officers, administrative assistants, and operations staff.",
    nodeId: "155:77966",
  },
  {
    id: "finance",
    title: "Finance & Administration",
    description: "Content writers, media officers, digital communications, and PR professionals.",
    nodeId: "155:77971",
  },
  {
    id: "ict",
    title: "ICT & Technology",
    description: "Web developers, ICT support, and digital media professionals.",
    nodeId: "155:77976",
  },
];

const COUNTRY_CODES = [
  { flag: "🇺🇸", code: "+12", label: "US (+12)" },
  { flag: "🇺🇸", code: "+1", label: "US (+1)" },
  { flag: "🇬🇧", code: "+44", label: "UK (+44)" },
  { flag: "🇨🇦", code: "+1", label: "CA (+1)" },
  { flag: "🇦🇺", code: "+61", label: "AU (+61)" },
  { flag: "🇩🇪", code: "+49", label: "DE (+49)" },
  { flag: "🇫🇷", code: "+33", label: "FR (+33)" },
  { flag: "🇨🇭", code: "+41", label: "CH (+41)" },
  { flag: "🇧🇩", code: "+880", label: "BD (+880)" },
];

export function CareersMainSection() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+12",
    phoneNumber: "",
    position: "",
    organization: "",
    coverLetter: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCardClick = (card: ValueCardItem) => {
    setActiveCard(card.id);
    setFormData((prev) => ({
      ...prev,
      position: card.title,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+12",
      phoneNumber: "",
      position: "",
      organization: "",
      coverLetter: "",
    });
    setSelectedFile(null);
    setActiveCard(null);
    setIsSubmitted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section
      className="bg-white px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] py-16 sm:py-24 lg:py-[140px] w-full"
      data-node-id="155:77158"
      data-name="misson and vision"
    >
      <div
        className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-[80px] items-start w-full"
        data-node-id="155:77159"
      >
        {/* Left Column: Opportunities */}
        <div
          className="flex flex-col flex-1 w-full gap-8 lg:gap-[60px] xl:gap-[80px] items-start"
          data-node-id="155:77160"
          data-name="Container"
        >
          {/* Header Section */}
          <div
            className="flex flex-col gap-5 lg:gap-[30px] items-start w-full"
            data-node-id="155:77161"
          >
            <div
              className="flex flex-col gap-4 items-start w-full"
              data-node-id="155:77162"
            >
              {/* Badge */}
              <div
                className="border border-[#00698c] rounded-full px-3 py-2 flex items-center justify-center"
                data-node-id="155:77163"
              >
                <span
                  className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]"
                  data-node-id="155:77165"
                >
                  Opportunities
                </span>
              </div>

              {/* Section Heading */}
              <h2
                className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]"
                data-node-id="155:77166"
              >
                Work With IILP
              </h2>
            </div>

            {/* Subtitle / Intro paragraph */}
            <p
              className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12]/70 leading-relaxed lg:leading-[30px]"
              data-node-id="155:77168"
            >
              IILP is building a world-class team of researchers, educators,
              administrators, and communicators committed to advancing
              knowledge, justice, and leadership for global change.
            </p>
          </div>

          {/* ValueCards List */}
          <div
            className="flex flex-col gap-4 items-start w-full"
            data-node-id="155:77169"
          >
            {OPPORTUNITY_CARDS.map((card) => {
              const isSelected = activeCard === card.id;
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  data-node-id={card.nodeId}
                  data-name="ValueCard"
                  className={`w-full bg-white border p-6 transition-all cursor-pointer group ${
                    isSelected
                      ? "border-[#000080] shadow-sm ring-1 ring-[#000080]"
                      : "border-[#b0ebff] hover:border-[#000080] hover:shadow-xs"
                  }`}
                >
                  <div className="flex flex-col gap-3 items-start w-full">
                    <h3
                      className="font-serif font-bold text-2xl text-[#000080] leading-snug group-hover:text-[#00698c] transition-colors"
                      data-node-id={`${card.nodeId}-title`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="font-sans font-normal text-base text-[#414651] leading-[24px]"
                      data-node-id={`${card.nodeId}-desc`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Expression of Interest Form (Figma node 155:77981, p-[32px], gap-[28px]) */}
        <div
          className="bg-[#e6f9ff] flex flex-col flex-1 w-full gap-[28px] items-start p-6 sm:p-8 lg:p-[32px] relative"
          data-node-id="155:77981"
        >
          {/* Header */}
          <div
            className="flex flex-col gap-4 items-start w-full"
            data-node-id="155:77982"
          >
            {/* Apply Badge */}
            <div
              className="border border-[#00698c] rounded-full px-3 py-2 flex items-center justify-center bg-white/40 backdrop-blur-xs"
              data-node-id="155:77983"
            >
              <span
                className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]"
                data-node-id="155:77985"
              >
                Apply
              </span>
            </div>

            {/* Form Title */}
            <h2
              className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]"
              data-node-id="155:77986"
            >
              Expression of Interest
            </h2>
          </div>

          {/* Form Content / Submitted View */}
          {isSubmitted ? (
            <div className="w-full bg-white border border-[#b0ebff] rounded-xl p-8 flex flex-col items-center text-center gap-5 my-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-[#e6f9ff] border border-[#00bfff] flex items-center justify-center text-2xl">
                ✓
              </div>
              <h3 className="font-serif font-semibold text-2xl text-[#000080]">
                Thank you for your interest!
              </h3>
              <p className="font-sans text-base text-[#414651] max-w-md">
                We have received your expression of interest for{" "}
                <span className="font-semibold text-[#000080]">
                  {formData.position || "an opportunity at IILP"}
                </span>
                . Our team will review your profile and reach out if there is a
                suitable match.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-2 bg-[#00bfff] hover:bg-[#009ecc] text-white font-semibold py-3 px-8 rounded-full transition-colors cursor-pointer text-base shadow-xs"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 items-start w-full"
              data-node-id="155:77988"
            >
              {/* Row 1: First name & Last Name */}
              <div
                className="flex flex-col sm:flex-row gap-5 items-start w-full"
                data-node-id="155:77989"
              >
                {/* First name */}
                <div
                  className="flex flex-col gap-2.5 items-start flex-1 w-full"
                  data-node-id="155:77990"
                >
                  <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                    <span>First name</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] focus-within:bg-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Placeholder text"
                      required
                      className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div
                  className="flex flex-col gap-2.5 items-start flex-1 w-full"
                  data-node-id="155:77991"
                >
                  <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                    <span>Last Name</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] focus-within:bg-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Write some text here"
                      required
                      className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address & Phone Number */}
              <div
                className="flex flex-col sm:flex-row gap-5 items-start w-full"
                data-node-id="155:77992"
              >
                {/* Email Address */}
                <div
                  className="flex flex-col gap-2.5 items-start flex-1 w-full"
                  data-node-id="155:77993"
                >
                  <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                    <span>Email Address</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] focus-within:bg-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@company.com"
                      required
                      className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6"
                    />
                  </div>
                </div>

                {/* Phone Number with country dropdown */}
                <div
                  className="flex flex-col gap-2.5 items-start flex-1 w-full"
                  data-node-id="155:77994"
                >
                  <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                    <span>Phone Number</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div
                    className="flex items-stretch border border-[#e5e7eb] bg-[#f9fafb] focus-within:border-[#000080] focus-within:bg-white w-full shadow-[0px_1px_0.5px_0px_rgba(29,41,61,0.02)] transition-colors overflow-hidden"
                    data-node-id="155:77996"
                  >
                    {/* Country code prefix */}
                    <div
                      className="bg-[#f9fafb] border-r border-[#e5e7eb] flex items-center gap-1.5 px-3 py-3.5 shrink-0 relative"
                      data-node-id="155:77997"
                    >
                      <span className="text-base select-none">
                        {COUNTRY_CODES.find((c) => c.code === formData.phoneCode)
                          ?.flag || "🇺🇸"}
                      </span>
                      <select
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleInputChange}
                        className="bg-transparent font-sans font-medium text-base text-[#4a5565] outline-hidden cursor-pointer appearance-none pr-4"
                      >
                        {COUNTRY_CODES.map((item, idx) => (
                          <option key={idx} value={item.code}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-1 text-xs text-[#4a5565]">
                        ▼
                      </span>
                    </div>

                    {/* Phone input */}
                    <div className="flex-1 min-w-0" data-node-id="155:77998">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        required
                        className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Position / Area of Interest & Current Organization */}
              <div
                className="flex flex-col sm:flex-row gap-5 items-start w-full"
                data-node-id="159:78107"
              >
                {/* Position / Area of Interest */}
                <div
                  className="flex flex-col gap-2.5 items-start flex-1 w-full"
                  data-node-id="155:78002"
                >
                  <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                    <span>Position / Area of Interest</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] focus-within:bg-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors">
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="e.g. Research Coordinator, Officer"
                      required
                      className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6"
                    />
                  </div>
                </div>

                {/* Current Organization / Institution */}
                <div
                  className="flex flex-col gap-2.5 items-start flex-1 w-full"
                  data-node-id="159:78087"
                >
                  <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                    <span>Current Organization / Institution</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] focus-within:bg-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors">
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Your current employer"
                      required
                      className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Cover Letter / Motivation (textarea) */}
              <div
                className="flex flex-col gap-2.5 items-start w-full"
                data-node-id="155:78004"
              >
                <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                  <span>Cover Letter / Motivation</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <div className="w-full bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] focus-within:bg-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors">
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your background, skills, and why you want to work with IILP."
                    required
                    rows={5}
                    className="w-full px-4 py-3.5 bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-6 resize-none h-[170px] sm:h-[180px]"
                  />
                </div>
              </div>

              {/* Row 5: Upload CV */}
              <div
                className="flex flex-col gap-2.5 items-start w-full"
                data-node-id="159:78108"
              >
                <label className="flex gap-1 items-center font-sans font-medium text-sm text-[#101828]">
                  <span>Upload CV</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <label className="flex items-stretch border border-[#e5e7eb] bg-[#f9fafb] focus-within:border-[#000080] shadow-[0px_1px_0.5px_0px_rgba(29,41,61,0.02)] w-full cursor-pointer overflow-hidden transition-colors group">
                  <div className="bg-[#f3f4f6] group-hover:bg-[#e5e7eb] border-r border-[#e5e7eb] px-4 py-3.5 font-sans font-normal text-base text-[#4a5565] whitespace-nowrap transition-colors select-none">
                    Choose files
                  </div>
                  <div className="flex-1 px-4 py-3.5 font-sans font-normal text-base text-[#6a7282] truncate flex items-center">
                    {selectedFile ? (
                      <span className="text-[#101828] font-medium">
                        {selectedFile.name}
                      </span>
                    ) : (
                      "No file chosen"
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    required
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </label>
                <p className="font-sans font-normal text-xs text-[#4a5565] leading-[20px]">
                  PDF, DOC, or DOCX. Max 5MB.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-[#00bfff] hover:bg-[#009ecc] active:bg-[#0088b3] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-all cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed"
                data-node-id="155:78005"
              >
                {isSubmitting
                  ? "Submitting Application..."
                  : "Submit Expression of Interest"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
