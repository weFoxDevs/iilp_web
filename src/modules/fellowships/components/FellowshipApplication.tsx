import React, { useState } from "react";
import Image from "next/image";

export default function FellowshipApplication() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+12",
    phone: "",
    country: "",
    institution: "",
    degree: "",
    researchInterest: "",
    fellowshipType: "",
    statement: "",
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="bg-[#e6f9ff] py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px] items-center">
        {/* Section Header */}
        <div className="flex flex-col items-center gap-4 text-center max-w-[850px]">
          {/* Pill Badge */}
          <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
            <span className="font-sans font-semibold text-sm sm:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]">
              Fellowship Application
            </span>
          </div>

          {/* Title */}
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight lg:leading-[44px]">
            Apply for Fellowship
          </h2>

          {/* Subtitle */}
          <p className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12] leading-relaxed lg:leading-[30px]">
            Complete the form below to apply for the IILP Global Fellowship Network.
          </p>
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
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    countryCode: "+12",
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
                    <div className="flex border border-[#e5e7eb] overflow-hidden shadow-xs bg-[#f9fafb]">
                      {/* Country Code Selector */}
                      <div className="flex items-center gap-1.5 px-4 py-3.5 border-r border-[#e5e7eb] bg-[#f9fafb] text-[#4a5565] font-sans text-sm sm:text-base font-medium shrink-0">
                        <span className="text-base">🇺🇸</span>
                        <span>{formData.countryCode}</span>
                        <Image
                          src="/assets/input-angle-down.svg"
                          alt="Dropdown"
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 opacity-70"
                        />
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] transition-colors cursor-pointer"
              >
                Submit Fellowship Application
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
