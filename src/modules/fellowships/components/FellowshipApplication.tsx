import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { PageSectionData } from "@/common/services/cms.service";
import { submitFellowshipApplication } from "@/common/services/fellowship-application.service";

interface CountryCodeOption {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

const COUNTRY_DIAL_CODES: CountryCodeOption[] = [
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "BD", dialCode: "+880", name: "Bangladesh", flag: "🇧🇩" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "CH", dialCode: "+41", name: "Switzerland", flag: "🇨🇭" },
  { code: "SE", dialCode: "+46", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", dialCode: "+47", name: "Norway", flag: "🇳🇴" },
  { code: "DK", dialCode: "+45", name: "Denmark", flag: "🇩🇰" },
  { code: "IE", dialCode: "+353", name: "Ireland", flag: "🇮🇪" },
  { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "MY", dialCode: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "KR", dialCode: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
  { code: "HK", dialCode: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "TW", dialCode: "+886", name: "Taiwan", flag: "🇹🇼" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", dialCode: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", dialCode: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "OM", dialCode: "+968", name: "Oman", flag: "🇴🇲" },
  { code: "BH", dialCode: "+973", name: "Bahrain", flag: "🇧🇭" },
  { code: "TR", dialCode: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "EG", dialCode: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "JO", dialCode: "+962", name: "Jordan", flag: "🇯🇴" },
  { code: "LB", dialCode: "+961", name: "Lebanon", flag: "🇱🇧" },
  { code: "PK", dialCode: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "NG", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", dialCode: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "GH", dialCode: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "ET", dialCode: "+251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", dialCode: "+52", name: "Mexico", flag: "🇲🇽" },
  { code: "AR", dialCode: "+54", name: "Argentina", flag: "🇦🇷" },
  { code: "CO", dialCode: "+57", name: "Colombia", flag: "🇨🇴" },
  { code: "CL", dialCode: "+56", name: "Chile", flag: "🇨🇱" },
  { code: "ID", dialCode: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "PH", dialCode: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "TH", dialCode: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", dialCode: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "LK", dialCode: "+94", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", dialCode: "+977", name: "Nepal", flag: "🇳🇵" },
  { code: "MM", dialCode: "+95", name: "Myanmar", flag: "🇲🇲" },
  { code: "AF", dialCode: "+93", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AT", dialCode: "+43", name: "Austria", flag: "🇦🇹" },
  { code: "BE", dialCode: "+32", name: "Belgium", flag: "🇧🇪" },
  { code: "PL", dialCode: "+48", name: "Poland", flag: "🇵🇱" },
  { code: "PT", dialCode: "+351", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", dialCode: "+30", name: "Greece", flag: "🇬🇷" },
  { code: "FI", dialCode: "+358", name: "Finland", flag: "🇫🇮" },
];

interface FellowshipApplicationProps {
  data?: Partial<PageSectionData>;
}

export default function FellowshipApplication({ data }: FellowshipApplicationProps) {
  const badge = data?.badge ?? "Fellowship Application";
  const title = data?.title ?? "Apply for Fellowship";
  const subtitle =
    data?.subtitle ??
    "Complete the form below to apply for the IILP Global Fellowship Network.";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+1",
    phone: "",
    country: "",
    institution: "",
    degree: "",
    researchInterest: "",
    fellowshipType: "",
    statement: "",
  });

  const [selectedCountry, setSelectedCountry] = useState<CountryCodeOption>(
    COUNTRY_DIAL_CODES[0]
  );
  const [isCountryCodeOpen, setIsCountryCodeOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const filteredCountryCodes = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRY_DIAL_CODES;
    const query = countrySearch.toLowerCase().trim();
    return COUNTRY_DIAL_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    );
  }, [countrySearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryCodeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const dataPayload = new FormData();
      dataPayload.append("firstName", formData.firstName);
      dataPayload.append("lastName", formData.lastName);
      dataPayload.append("email", formData.email);
      dataPayload.append("countryCode", formData.countryCode);
      dataPayload.append("phone", formData.phone);
      dataPayload.append("country", formData.country);
      if (formData.institution) {
        dataPayload.append("institution", formData.institution);
      }
      dataPayload.append("degree", formData.degree);
      if (formData.researchInterest) {
        dataPayload.append("researchInterest", formData.researchInterest);
      }
      dataPayload.append("fellowshipType", formData.fellowshipType);
      dataPayload.append("statement", formData.statement);

      if (selectedFiles && selectedFiles.length > 0) {
        for (let i = 0; i < selectedFiles.length; i++) {
          dataPayload.append("files", selectedFiles[i]);
        }
      }

      await submitFellowshipApplication(dataPayload);
      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to submit fellowship application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="apply" className="bg-[#e6f9ff] py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] scroll-mt-20">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px] items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          {badge && (
            <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
              <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
                {badge}
              </span>
            </div>
          )}

          {/* Title */}
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
            {title}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
              {subtitle}
            </p>
          )}
        </div>


        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 md:p-[32px] w-full max-w-[852px] shadow-xs">
          {submitted ? (
            <div className="p-8 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#e6f9ff] flex items-center justify-center text-[#00bfff]">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0a0d12]">
                Application Submitted Successfully!
              </h3>
              <p className="font-sans text-base text-[#4a5565] max-w-[500px]">
                Thank you for applying to the IILP Global Fellowship Network. Our
                committee will review your application and contact you soon.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setSelectedFiles(null);
                  setSelectedCountry(COUNTRY_DIAL_CODES[0]);
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    countryCode: "+1",
                    phone: "",
                    country: "",
                    institution: "",
                    degree: "",
                    researchInterest: "",
                    fellowshipType: "",
                    statement: "",
                  });
                }}
                className="mt-2 inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-sm px-6 py-2.5 rounded-full transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-7">
              <div className="flex flex-col gap-5">
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* First Name */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>First name</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Placeholder text"
                      required
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Last Name</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Write some text here"
                      required
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Email Address</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      required
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Phone Number</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <div className="flex border border-[#e5e7eb] shadow-xs bg-[#f9fafb] relative">
                      {/* Country Code Selector */}
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryCodeOpen((prev) => !prev)}
                          aria-label="Select Country Code"
                          className="flex items-center gap-1.5 px-3.5 py-3.5 border-r border-[#e5e7eb] bg-[#f9fafb] hover:bg-[#f0f4f8] text-[#4a5565] font-sans text-sm sm:text-base font-medium shrink-0 cursor-pointer transition-colors h-full select-none"
                        >
                          <span className="text-base leading-none">{selectedCountry.flag}</span>
                          <span>{selectedCountry.dialCode}</span>
                          <Image
                            src="/assets/input-angle-down.svg"
                            alt="Dropdown"
                            width={14}
                            height={14}
                            className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                              isCountryCodeOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Interactive Dropdown Menu */}
                        {isCountryCodeOpen && (
                          <div className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-white border border-[#b0ebff] rounded-xl shadow-2xl z-50 overflow-hidden font-sans">
                            {/* Search Header */}
                            <div className="p-2.5 border-b border-[#e5e7eb] bg-[#f9fafb]">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={countrySearch}
                                  onChange={(e) => setCountrySearch(e.target.value)}
                                  placeholder="Search country or dial code..."
                                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#b0ebff] rounded-lg text-[#101828] placeholder-[#9ca3af] outline-none focus:border-[#000080]"
                                  autoFocus
                                />
                                <svg
                                  className="w-4 h-4 text-[#9ca3af] absolute left-2.5 top-1/2 -translate-y-1/2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Options List */}
                            <div className="max-h-60 overflow-y-auto divide-y divide-[#f3f4f6]">
                              {filteredCountryCodes.map((item) => {
                                const isSelected =
                                  selectedCountry.code === item.code &&
                                  selectedCountry.dialCode === item.dialCode;
                                return (
                                  <button
                                    key={`${item.code}-${item.dialCode}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedCountry(item);
                                      setFormData((prev) => ({
                                        ...prev,
                                        countryCode: item.dialCode,
                                        country: prev.country ? prev.country : item.name,
                                      }));
                                      setIsCountryCodeOpen(false);
                                      setCountrySearch("");
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs sm:text-sm hover:bg-[#f4faff] cursor-pointer transition-colors ${
                                      isSelected
                                        ? "bg-[#e6f9ff] text-[#000080] font-semibold"
                                        : "text-[#374151]"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                      <span className="text-base shrink-0 leading-none">{item.flag}</span>
                                      <span className="truncate">{item.name}</span>
                                      <span className="text-[10px] text-[#9ca3af] font-mono shrink-0">({item.code})</span>
                                    </div>
                                    <span className="text-[#00698c] font-medium font-mono text-xs shrink-0">
                                      {item.dialCode}
                                    </span>
                                  </button>
                                );
                              })}
                              {filteredCountryCodes.length === 0 && (
                                <div className="p-4 text-xs text-center text-[#6a7282]">
                                  No countries matching &quot;{countrySearch}&quot;
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                        className="w-full bg-[#f9fafb] px-3.5 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Country of Residence & Current Institution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Country of Residence */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Country of Residence</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>

                  {/* Current Institution */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Current Institution / Organization</span>
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      placeholder="University or organization"
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 4: Highest Degree & Primary Research Interest */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Highest Degree */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Highest Degree / Qualification</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="e.g. PhD in International Law"
                      required
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>

                  {/* Primary Research Interest */}
                  <div className="flex flex-col gap-2.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Primary Research Interest</span>
                    </label>
                    <input
                      type="text"
                      name="researchInterest"
                      value={formData.researchInterest}
                      onChange={handleChange}
                      placeholder="e.g. Refugee Law, Human Rights"
                      className="bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 5: Fellowship Type Dropdown */}
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                    <span>Fellowship Type</span>
                    <span className="text-[#c70036] ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="fellowshipType"
                      value={formData.fellowshipType}
                      onChange={handleChange}
                      required
                      className={`w-full bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3.5 text-base font-sans ${
                        !formData.fellowshipType
                          ? "text-[#6a7282]"
                          : "text-[#101828]"
                      } focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none appearance-none cursor-pointer transition-colors`}
                    >
                      <option value="" disabled className="text-[#6a7282]">
                        Select Type
                      </option>
                      <option value="research" className="text-[#101828]">Research Fellows</option>
                      <option value="junior" className="text-[#101828]">Junior Fellows</option>
                      <option value="honorary" className="text-[#101828]">Honorary Fellows</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Image
                        src="/assets/input-chevron.svg"
                        alt="Select"
                        width={16}
                        height={16}
                        className="w-4 h-4 opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 6: Statement of Purpose */}
                <div className="flex flex-col gap-2.5">
                  <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                    <span>Statement of Purpose / Motivation</span>
                    <span className="text-[#c70036] ml-0.5">*</span>
                  </label>
                  <textarea
                    name="statement"
                    value={formData.statement}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe your research interests, motivation for applying, and how you hope to contribute to IILP's mission (300-500 words)."
                    required
                    className="w-full bg-[#f9fafb] border border-[#e5e7eb] p-4 text-base font-sans text-[#101828] placeholder-[#6a7282] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-none transition-colors resize-y"
                  />
                </div>

                {/* Row 7: Upload CV / Supporting Documents */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <label className="flex items-center text-sm font-medium text-[#101828] font-sans">
                      <span>Upload CV / Supporting Documents</span>
                      <span className="text-[#c70036] ml-0.5">*</span>
                    </label>
                    <Image
                      src="/assets/input-question.svg"
                      alt="Help info"
                      width={14}
                      height={14}
                      className="w-3.5 h-3.5 opacity-60"
                    />
                  </div>

                  {/* File Input UI Container */}
                  <label className="flex items-stretch border border-[#e5e7eb] overflow-hidden shadow-xs cursor-pointer group bg-[#f9fafb]">
                    <div className="bg-[#f3f4f6] group-hover:bg-[#e5e7eb] border-r border-[#e5e7eb] px-4 py-3.5 font-sans font-normal text-base text-[#4a5565] whitespace-nowrap transition-colors">
                      Choose files
                    </div>
                    <div className="flex-1 px-4 py-3.5 font-sans font-normal text-base text-[#6a7282] truncate">
                      {selectedFiles && selectedFiles.length > 0
                        ? Array.from(selectedFiles)
                            .map((f) => f.name)
                            .join(", ")
                        : "No file chosen"}
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      required={!selectedFiles || selectedFiles.length === 0}
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs font-sans text-[#4a5565]">
                    Accepted: PDF, DOC, DOCX. Include CV, cover letter, and any
                    relevant publications.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-500 hover:text-red-800 text-xs font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Fellowship Application</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
