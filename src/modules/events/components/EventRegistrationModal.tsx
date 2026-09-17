import React, { useState } from "react";
import { EventItem, RegistrationFormData } from "../types";
import { submitEventRegistration } from "@/common/services/events.service";

interface EventRegistrationModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const countryDialCodes = [
  { code: "+1", flag: "🇺🇸", country: "United States" },
  { code: "+44", flag: "🇬🇧", country: "United Kingdom" },
  { code: "+1", flag: "🇨🇦", country: "Canada" },
  { code: "+61", flag: "🇦🇺", country: "Australia" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+880", flag: "🇧🇩", country: "Bangladesh" },
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+81", flag: "🇯🇵", country: "Japan" },
  { code: "+65", flag: "🇸🇬", country: "Singapore" },
  { code: "+971", flag: "🇦🇪", country: "United Arab Emirates" },
];

const countryOptions = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Bangladesh",
  "India",
  "Japan",
  "Singapore",
  "Switzerland",
  "Netherlands",
  "Sweden",
  "Other",
];

export function EventRegistrationModal({
  event,
  isOpen,
  onClose,
}: EventRegistrationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedStatus, setConfirmedStatus] = useState<string>("CONFIRMED");
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    organization: "",
    country: "",
  });

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitEventRegistration(event.id, formData);
      if (res.success && res.data) {
        setConfirmedStatus(res.data.registrationStatus || "CONFIRMED");
        setIsSubmitted(true);
      } else {
        setErrorMessage(res.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-[24px] shadow-2xl w-full max-w-[760px] p-6 sm:p-10 relative overflow-hidden flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute right-5 top-5 sm:right-7 sm:top-7 size-10 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer z-20"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Header Area */}
            <div className="flex items-start gap-4 pr-12">
              {/* Date Box */}
              <div className="bg-[#e6f9ff] text-[#00698c] size-[56px] rounded-xl flex flex-col items-center justify-center shrink-0 leading-tight">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {event.month}
                </span>
                <span className="text-[20px] font-bold leading-none">
                  {event.day}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1.5">
                <div className="inline-flex items-center border border-[#00698c] rounded-full px-2.5 py-0.5 w-fit">
                  <span className="font-sans font-semibold text-[11px] text-[#0a0d12] uppercase tracking-wider">
                    Event Registration
                  </span>
                </div>

                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-gray-950 leading-snug">
                  {event.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  {event.fullDate} · {event.venues.map((v) => v.name).join(" / ")} · {event.time}
                </p>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0 text-red-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff] transition-all"
                />
              </div>

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-900">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff] transition-all"
                  />
                </div>

                {/* Phone Number with Country Code */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-900">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex bg-[#f9fafb] border border-gray-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00bfff] transition-all">
                    <select
                      value={formData.phoneCountryCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneCountryCode: e.target.value,
                        })
                      }
                      className="bg-transparent pl-3 pr-2 py-3 text-sm text-gray-700 font-medium outline-none cursor-pointer border-r border-gray-200"
                    >
                      {countryDialCodes.map((item, idx) => (
                        <option key={idx} value={item.code}>
                          {item.flag} {item.code}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                      className="flex-1 px-3 py-3 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Organization / Institution */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">
                  Organization / Institution{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) =>
                    setFormData({ ...formData, organization: e.target.value })
                  }
                  placeholder="Enter your university or organization name"
                  className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff] transition-all"
                />
              </div>

              {/* Country Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-900">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-[#f9fafb] border border-gray-200 rounded-xl text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Country</option>
                    {countryOptions.map((c, idx) => (
                      <option key={idx} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 bg-[#00bfff] hover:bg-sky-400 disabled:opacity-60 text-white font-sans font-semibold text-[16px] py-3.5 px-6 rounded-full shadow-md shadow-sky-200 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          </>
        ) : (
          /* Registration Confirmed / Waitlisted View */
          <div className="flex flex-col items-center text-center py-8 px-4 gap-6 animate-in zoom-in-95 duration-200">
            {/* Success Check Badge */}
            <div className="relative size-24 flex items-center justify-center">
              <svg
                width="96"
                height="96"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 0C54.8 0 59.2 3.2 61.6 7.4C64.6 6.3 68 6.4 71 7.7C73.9 9.1 76.1 11.6 77 14.7C80 15 82.8 16.5 84.7 18.9C86.6 21.3 87.2 24.5 86.4 27.4C89 29.2 90.7 32 91.1 35.1C91.5 38.2 90.5 41.3 88.5 43.6C90.3 46 91 49.1 90.4 52.1C89.8 55.1 87.9 57.7 85.2 59.1C86.3 62 86 65.3 84.4 68C82.8 70.6 80.1 72.3 77 72.6C77.1 75.7 75.8 78.7 73.5 80.8C71.2 82.8 68.1 83.7 65.1 83.2C64.1 86.1 61.9 88.4 59 89.6C56.1 90.8 52.8 90.7 50 89.4C47.2 90.7 43.9 90.8 41 89.6C38.1 88.4 35.9 86.1 34.9 83.2C31.9 83.7 28.8 82.8 26.5 80.8C24.2 78.7 22.9 75.7 23 72.6C19.9 72.3 17.2 70.6 15.6 68C14 65.3 13.7 62 14.8 59.1C12.1 57.7 10.2 55.1 9.6 52.1C9 49.1 9.7 46 11.5 43.6C9.5 41.3 8.5 38.2 8.9 35.1C9.3 32 11 29.2 13.6 27.4C12.8 24.5 13.4 21.3 15.3 18.9C17.2 16.5 20 15 23 14.7C23.9 11.6 26.1 9.1 29 7.7C32 6.4 35.4 6.3 38.4 7.4C40.8 3.2 45.2 0 50 0Z"
                  fill={confirmedStatus === 'WAITLISTED' ? '#f59e0b' : '#00C853'}
                />
                <path
                  d="M32 50L44 62L68 38"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Confirmation Title */}
            <div className="flex flex-col gap-3 max-w-[500px]">
              <h3 className="font-serif font-bold text-3xl sm:text-4xl text-gray-950">
                {confirmedStatus === 'WAITLISTED'
                  ? 'Added to Waitlist!'
                  : 'Registration Confirmed!'}
              </h3>
              <p className="font-sans text-base text-gray-600 leading-relaxed">
                {confirmedStatus === 'WAITLISTED' ? (
                  <>
                    Capacity for <strong className="text-gray-900 font-semibold">{event.title}</strong> has been reached. You have been placed on the priority waitlist. If a seat becomes available, a confirmation email will be sent to{' '}
                    <span className="text-[#0284c7] font-medium">{formData.email}</span>.
                  </>
                ) : (
                  <>
                    You have been successfully registered for{' '}
                    <strong className="text-gray-900 font-semibold">{event.title}</strong>. A confirmation email with event access links and preparation materials has been sent to{' '}
                    <span className="text-[#0284c7] font-medium">{formData.email || 'your email'}</span>.
                  </>
                )}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[420px] pt-2">
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: event.title,
                      text: `I just registered for ${event.title}!`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Event link copied to clipboard!");
                  }
                }}
                className="flex-1 bg-[#00bfff] hover:bg-sky-400 text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full shadow-md shadow-sky-200 transition-all cursor-pointer"
              >
                Share Event
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-sans font-semibold text-base py-3.5 px-6 rounded-full transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
