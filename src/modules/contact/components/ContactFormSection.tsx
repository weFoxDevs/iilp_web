import React, { useState } from "react";
import Image from "next/image";

const countryDialCodes = [
  { code: "+12", label: "+12", flag: "🇺🇸" },
  { code: "+1", label: "+1", flag: "🇺🇸" },
  { code: "+44", label: "+44", flag: "🇬🇧" },
  { code: "+61", label: "+61", flag: "🇦🇺" },
  { code: "+49", label: "+49", flag: "🇩🇪" },
  { code: "+33", label: "+33", flag: "🇫🇷" },
  { code: "+880", label: "+880", flag: "🇧🇩" },
  { code: "+91", label: "+91", flag: "🇮🇳" },
  { code: "+81", label: "+81", flag: "🇯🇵" },
  { code: "+65", label: "+65", flag: "🇸🇬" },
  { code: "+971", label: "+971", flag: "🇦🇪" },
];

const subjectOptions = [
  "General Inquiry",
  "Admissions & Academic Programs",
  "Fellowship Opportunities",
  "Conferences & Events",
  "Institutional Partnerships",
  "Research Collaboration & Publications",
  "Media & Press Relations",
];

export function ContactFormSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneCode: "+12",
    phoneNumber: "",
    organization: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.organization.trim() ||
      !formData.subject ||
      !formData.message.trim()
    ) {
      setErrorMessage("Please fill out all required fields marked with *");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneCode: "+12",
      phoneNumber: "",
      organization: "",
      subject: "",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <section
      className="bg-white flex gap-10 lg:gap-14 xl:gap-[80px] items-stretch justify-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] py-16 sm:py-24 lg:py-[140px] relative w-full"
      data-node-id="150:72789"
    >
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-[80px] items-stretch justify-center">
        {/* Left Side: Contact Form Container (Figma node 150:72796) */}
        <div
          className="bg-[#e6f9ff] flex flex-col gap-[28px] items-start p-6 sm:p-8 lg:p-[32px] relative shrink-0 w-full lg:w-[852px]"
          data-node-id="150:72796"
        >
          {/* Section Heading & Pill */}
          <div
            className="flex flex-col gap-4 items-start relative shrink-0 w-full"
            data-node-id="150:73090"
          >
            {/* Pill Badge */}
            <div
              className="border border-[#00698c] border-solid flex flex-col items-start px-[12px] py-[8px] relative rounded-[1000px] shrink-0"
              data-node-id="150:73091"
            >
              <span
                className="font-sans font-semibold leading-[17.6px] text-[#0a0d12] text-[16px] uppercase whitespace-nowrap"
                data-node-id="150:73093"
              >
                Send a Message
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-3xl sm:text-4xl lg:text-[36px] tracking-[-0.72px] w-full max-w-[580px]"
              data-node-id="150:73094"
            >
              Contact Form
            </h2>
          </div>

          {submitted ? (
            <div className="bg-white rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center gap-4 my-auto min-h-[440px] w-full shadow-xs">
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
                Thank You for Reaching Out
              </h3>
              <p className="font-sans text-gray-600 max-w-[460px] leading-relaxed">
                Your message has been successfully received. Our admissions and inquiries team will review your message and reply promptly.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#00bfff] text-white font-semibold hover:bg-[#009cd9] transition-colors shadow-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[20px] items-start relative shrink-0 w-full"
              data-node-id="150:72797"
            >
              {errorMessage && (
                <div className="w-full p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: First name & Last Name */}
              <div
                className="flex flex-col sm:flex-row gap-[20px] items-start justify-center relative shrink-0 w-full"
                data-node-id="150:72798"
              >
                {/* First name */}
                <div
                  className="flex flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-[384px] sm:flex-1"
                  data-node-id="150:72799"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>First name</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Placeholder text"
                      required
                      className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div
                  className="flex flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-[384px] sm:flex-1"
                  data-node-id="150:72800"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>Last Name</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Write some text here"
                      required
                      className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address & Phone Number */}
              <div
                className="flex flex-col sm:flex-row gap-[20px] items-start justify-center relative shrink-0 w-full"
                data-node-id="150:72801"
              >
                {/* Email Address */}
                <div
                  className="flex flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-[384px] sm:flex-1"
                  data-node-id="150:72802"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>Email Address</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      required
                      className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div
                  className="flex flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-[384px] sm:flex-1"
                  data-node-id="150:72803"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>Phone Number</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div
                    className="border border-[#e5e7eb] flex items-center overflow-hidden relative shadow-[0px_1px_0.5px_0px_rgba(29,41,61,0.02)] shrink-0 w-full focus-within:border-[#000080] transition-colors"
                    data-node-id="150:72805"
                  >
                    {/* Country code prefix button matching Figma node 150:72806 */}
                    <div className="bg-[#f9fafb] border-r border-[#e5e7eb] flex gap-[6px] items-center justify-center px-[16px] sm:px-[20px] py-[14px] relative shrink-0">
                      <span className="text-base select-none">🇺🇸</span>
                      <select
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleChange}
                        className="bg-transparent text-[#4a5565] font-sans font-medium text-base outline-hidden cursor-pointer appearance-none pr-3"
                      >
                        {countryDialCodes.map((item, idx) => (
                          <option key={idx} value={item.code}>
                            {item.code}
                          </option>
                        ))}
                      </select>
                      <Image
                        src="/icons/contact/chevron.svg"
                        alt="Dropdown"
                        width={12}
                        height={12}
                        className="pointer-events-none absolute right-2 w-3 h-3 text-[#4a5565]"
                      />
                    </div>
                    {/* Phone input field */}
                    <div className="bg-[#f9fafb] flex flex-1 items-center px-[16px] py-[14px] relative">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                        className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Organization / Institution */}
              <div
                className="flex flex-col gap-[10px] items-start relative shrink-0 w-full"
                data-node-id="150:73146"
              >
                <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                  <span>Organization / Institution</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Placeholder text"
                    required
                    className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                  />
                </div>
              </div>

              {/* Row 4: Subject */}
              <div
                className="flex flex-col gap-[10px] items-start relative shrink-0 w-full"
                data-node-id="150:73097"
              >
                <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                  <span>Subject</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex items-center px-[16px] py-[14px] relative shrink-0 w-full transition-colors">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden appearance-none cursor-pointer leading-[24px]"
                  >
                    <option value="" disabled className="text-gray-400">
                      Select subject
                    </option>
                    {subjectOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 flex items-center">
                    <Image
                      src="/icons/contact/chevron.svg"
                      alt="Select Chevron"
                      width={16}
                      height={16}
                      className="w-4 h-4 opacity-70"
                    />
                  </div>
                </div>
              </div>

              {/* Row 5: Message */}
              <div
                className="flex flex-col gap-[10px] h-[210px] items-start relative shrink-0 w-full"
                data-node-id="150:72818"
              >
                <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                  <span>Message</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex flex-1 items-start px-[16px] py-[14px] relative w-full transition-colors">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    required
                    className="w-full h-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden resize-none leading-[24px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#00bfff] hover:bg-[#009cd9] active:bg-[#0086bc] drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex gap-[6px] items-center justify-center px-[24px] py-[14px] relative rounded-[100000px] shrink-0 w-full cursor-pointer transition-colors disabled:opacity-70 mt-1"
                data-node-id="150:72820"
              >
                <span className="font-['Source_Sans_Pro:SemiBold',sans-serif] font-semibold text-white text-[16px] leading-[24px] whitespace-nowrap">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Map Image Container (Figma node 150:73378) */}
        <div
          className="flex-1 min-w-px relative self-stretch min-h-[460px] lg:min-h-0 overflow-hidden"
          data-node-id="150:73378"
          data-name="image 1"
        >
          <Image
            src="/images/contact-map.png"
            alt="IILP Location Map"
            fill
            priority
            className="object-cover pointer-events-none size-full"
            sizes="(max-width: 1024px) 100vw, 508px"
          />
        </div>
      </div>
    </section>
  );
}
