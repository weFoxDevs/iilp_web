import React, { useState } from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";
import { submitContactInquiry } from "@/common/services/contact.service";

interface ContactFormSectionProps {
  data?: PageSectionData | null;
  mapData?: PageSectionData | null;
}

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

export function ContactFormSection({ data, mapData }: ContactFormSectionProps) {
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
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showImageMap, setShowImageMap] = useState(false);

  // Dynamic values from CMS
  const formBadge = data?.badge || "Send a Message";
  const formTitle = data?.title || "Contact Form";

  // Map dynamic configuration
  const mapMeta = (mapData?.metadata || {}) as Record<string, unknown>;
  const configuredMapType = String(mapMeta.mapType || mapMeta.map_type || "embed");
  const embedUrl = String(
    mapMeta.embedUrl ||
      mapMeta.embed_url ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977789308!2d90.3492857469792!3d23.78077772076043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
  );
  const mapImageUrl = String(
    mapMeta.mapImage || mapMeta.map_image || mapData?.bgImage || "/images/contact-map.png"
  );
  const mapTitle = mapData?.title || "Dhaka Campus & Head Office";
  const mapAddress = String(mapMeta.address || mapData?.subtitle || "Dhaka, Bangladesh");
  const mapActionUrl =
    mapData?.actionUrl ||
    String(mapMeta.actionUrl || "https://maps.google.com/?q=Dhaka,+Bangladesh");
  const mapActionText = mapData?.actionText || "Open in Google Maps";

  const isInteractiveMap = configuredMapType === "embed" && !showImageMap;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage("");
      setIsRateLimited(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setErrorMessage("");
    setIsRateLimited(false);

    try {
      await submitContactInquiry({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneCode: formData.phoneCode,
        phoneNumber: formData.phoneNumber,
        organization: formData.organization,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit message";
      setErrorMessage(msg);
      if (
        msg.toLowerCase().includes("rate limit") ||
        msg.toLowerCase().includes("too many")
      ) {
        setIsRateLimited(true);
      }
    } finally {
      setIsSubmitting(false);
    }
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
    setErrorMessage("");
    setIsRateLimited(false);
  };

  return (
    <section
      className="bg-white flex gap-10 lg:gap-14 xl:gap-[80px] items-stretch justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] py-12 sm:py-20 lg:py-[140px] relative w-full"
      data-node-id="150:72789"
    >
      <div className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-[80px] items-stretch justify-center">
        {/* Left Side: Contact Form Container (Figma node 150:72796) */}
        <div
          className="bg-[#e6f9ff] flex flex-col gap-6 sm:gap-[28px] items-start p-4 sm:p-8 lg:p-[32px] relative shrink-0 w-full lg:w-[852px] rounded-xl sm:rounded-none"
          data-node-id="150:72796"
        >
          {/* Section Heading & Pill */}
          <div
            className="flex flex-col gap-3 sm:gap-4 items-start relative shrink-0 w-full"
            data-node-id="150:73090"
          >
            {/* Pill Badge */}
            <div
              className="border border-[#00698c] border-solid flex flex-col items-start px-3.5 py-1.5 sm:px-[12px] sm:py-[8px] relative rounded-full shrink-0"
              data-node-id="150:73091"
            >
              <span
                className="font-sans font-semibold leading-tight sm:leading-[17.6px] text-[#0a0d12] text-xs sm:text-[16px] uppercase"
                data-node-id="150:73093"
              >
                {formBadge}
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-3xl sm:text-4xl lg:text-[36px] tracking-[-0.72px] w-full max-w-[580px]"
              data-node-id="150:73094"
            >
              {formTitle}
            </h2>
          </div>

          {/* Rate Limit / Error Banner */}
          {errorMessage && (
            <div
              className={`w-full p-4 rounded-xl border flex items-start gap-3 text-sm ${
                isRateLimited
                  ? "bg-amber-50 border-amber-300 text-amber-900"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isRateLimited ? (
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-bold">
                  {isRateLimited ? "Submission Rate Limit" : "Submission Failed"}
                </div>
                <div className="text-xs sm:text-sm mt-0.5">{errorMessage}</div>
              </div>
            </div>
          )}

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
                Your message has been successfully received. Our inquiries and
                partnerships team will review your message and reply promptly to{" "}
                <span className="font-semibold text-gray-800">
                  {formData.email}
                </span>
                .
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="mt-4 inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#00bfff] text-white font-semibold hover:bg-[#009cd9] transition-colors shadow-xs cursor-pointer"
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
              {/* Row 1: First Name & Last Name */}
              <div
                className="flex flex-col sm:flex-row gap-[16px] items-start justify-center relative shrink-0 w-full"
                data-node-id="150:72798"
              >
                {/* First Name */}
                <div
                  className="flex flex-1 flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-auto"
                  data-node-id="150:72799"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>First Name</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex h-[48px] items-center px-[16px] py-[14px] relative w-full transition-colors">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="e.g. Eleanor"
                      required
                      className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div
                  className="flex flex-1 flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-auto"
                  data-node-id="150:72802"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>Last Name</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex h-[48px] items-center px-[16px] py-[14px] relative w-full transition-colors">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="e.g. Vance"
                      required
                      className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email & Phone Number */}
              <div
                className="flex flex-col sm:flex-row gap-[16px] items-start justify-center relative shrink-0 w-full"
                data-node-id="150:72805"
              >
                {/* Email Address */}
                <div
                  className="flex flex-1 flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-auto"
                  data-node-id="150:72806"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>Email Address</span>
                    <span className="text-[#c70036]">*</span>
                  </label>
                  <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex h-[48px] items-center px-[16px] py-[14px] relative w-full transition-colors">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. eleanor@example.org"
                      required
                      className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div
                  className="flex flex-1 flex-col gap-[10px] items-start relative shrink-0 w-full sm:w-auto"
                  data-node-id="150:72809"
                >
                  <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                    <span>Phone Number</span>
                  </label>
                  <div className="flex w-full h-[48px] items-center">
                    {/* Country Code Select */}
                    <div className="relative bg-[#f9fafb] border border-r-0 border-[#e5e7eb] focus-within:border-[#000080] h-full flex items-center px-3 transition-colors">
                      <select
                        name="phoneCode"
                        value={formData.phoneCode}
                        onChange={handleChange}
                        className="bg-transparent font-sans text-sm text-[#101828] outline-hidden cursor-pointer pr-4 appearance-none"
                      >
                        {countryDialCodes.map((item, idx) => (
                          <option key={idx} value={item.code}>
                            {item.flag} {item.code}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Number Input */}
                    <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex-1 h-full flex items-center px-[16px] py-[14px] transition-colors">
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="1819 254425"
                        className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Organization */}
              <div
                className="flex flex-col gap-[10px] items-start relative shrink-0 w-full"
                data-node-id="150:72812"
              >
                <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                  <span>Organization / Institution</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex h-[48px] items-center px-[16px] py-[14px] relative w-full transition-colors">
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="e.g. Harvard Law School / United Nations / Independent Scholar"
                    required
                    className="w-full bg-transparent font-sans text-base text-[#101828] placeholder-[#6a7282] outline-hidden leading-[24px]"
                  />
                </div>
              </div>

              {/* Row 4: Subject Select */}
              <div
                className="flex flex-col gap-[10px] items-start relative shrink-0 w-full"
                data-node-id="150:72815"
              >
                <label className="flex gap-[4px] items-center text-sm font-medium leading-[20px] text-[#101828]">
                  <span>Subject</span>
                  <span className="text-[#c70036]">*</span>
                </label>
                <div className="bg-[#f9fafb] border border-[#e5e7eb] focus-within:border-[#000080] shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex h-[48px] items-center px-[16px] relative w-full transition-colors">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent font-sans text-base text-[#101828] outline-hidden appearance-none cursor-pointer pr-8 leading-[24px]"
                  >
                    <option value="" disabled className="text-gray-400">
                      Select inquiry subject
                    </option>
                    {subjectOptions.map((subj, idx) => (
                      <option key={idx} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
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
                    placeholder="Write your detailed inquiry or collaboration proposal here..."
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
                <span className="font-['Source_Sans_Pro:SemiBold',sans-serif] font-semibold text-white text-[16px] leading-[24px] whitespace-nowrap flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    "Send Message"
                  )}
                </span>
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Dynamic Map Container (Figma node 150:73378) */}
        <div
          className="flex-1 min-w-px relative self-stretch min-h-[480px] lg:min-h-0 rounded-2xl overflow-hidden border border-gray-200/80 shadow-xs flex flex-col bg-[#eaf4f7]"
          data-node-id="150:73378"
          data-name="image 1"
        >
          {/* Map view: Interactive Iframe vs Image */}
          <div className="relative w-full h-full min-h-[420px] flex-1">
            {isInteractiveMap ? (
              <iframe
                title={mapTitle}
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full absolute inset-0"
              />
            ) : (
              <Image
                src={mapImageUrl}
                alt={mapTitle}
                fill
                priority
                className="object-cover size-full"
                sizes="(max-width: 1024px) 100vw, 508px"
              />
            )}
          </div>

          {/* Floating/Bottom Address Card Overlay */}
          <div className="p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{mapTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium mt-0.5 truncate max-w-sm">
                {mapAddress}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              {/* Toggle map view button if embed url exists */}
              {configuredMapType === "embed" && (
                <button
                  type="button"
                  onClick={() => setShowImageMap(!showImageMap)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
                  title="Toggle between Interactive Map and Satellite View"
                >
                  {showImageMap ? "Interactive Map" : "Photo View"}
                </button>
              )}

              {mapActionUrl && (
                <a
                  href={mapActionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#000080] hover:bg-[#000066] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                >
                  <span>{mapActionText}</span>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
