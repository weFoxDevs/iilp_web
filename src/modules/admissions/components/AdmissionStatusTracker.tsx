import React, { useState, useEffect } from "react";
import {
  trackAdmissionApplication,
  TrackApplicationResponse,
  ADMISSION_STATUS_LABELS,
  AdmissionApplicationStatus,
} from "@/common/services/admission-application.service";

interface AdmissionStatusTrackerProps {
  initialRef?: string;
  initialEmail?: string;
}

const ALL_STATUS_STEPS: { key: AdmissionApplicationStatus; label: string }[] = [
  { key: "SUBMITTED", label: "Application Submitted" },
  { key: "UNDER_REVIEW", label: "Under Review" },
  { key: "ADDITIONAL_INFO_REQUIRED", label: "Additional Info" },
  { key: "ACCEPTED", label: "Decision (Accepted / Waitlisted)" },
  { key: "ENROLLMENT", label: "Enrollment" },
];

export default function AdmissionStatusTracker({
  initialRef = "",
  initialEmail = "",
}: AdmissionStatusTrackerProps) {
  const [refNumber, setRefNumber] = useState(initialRef);
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackApplicationResponse | null>(null);

  // Auto-fetch if both initial params are present
  useEffect(() => {
    if (initialRef && initialEmail) {
      handleTrack(initialRef, initialEmail);
    }
  }, [initialRef, initialEmail]);

  const handleTrack = async (r?: string, e?: string) => {
    const refToUse = (r || refNumber).trim();
    const emailToUse = (e || email).trim();

    if (!refToUse || !emailToUse) {
      setError("Please enter both your Application Reference Number and Email Address.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await trackAdmissionApplication(refToUse, emailToUse);
      setResult(data);
    } catch (err: any) {
      setResult(null);
      setError(
        err.message ||
          "Could not find an application matching this Reference Number and Email. Please check and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getStepProgressIndex = (status: AdmissionApplicationStatus): number => {
    switch (status) {
      case "SUBMITTED":
        return 0;
      case "UNDER_REVIEW":
        return 1;
      case "ADDITIONAL_INFO_REQUIRED":
        return 2;
      case "ACCEPTED":
      case "WAITLISTED":
      case "NOT_SELECTED":
        return 3;
      case "ENROLLMENT":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Search Box Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-10 mb-8">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00698c] bg-sky-50 px-3 py-1 rounded-full">
            Applicant Portal
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#000080] mt-2 mb-2">
            Track Your Admission Status
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Enter the Reference Number provided upon submission along with the email address you used to apply.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. IILP-2026-X9Y2Z"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff] font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Applicant Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-center gap-2">
              <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="text-center pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-[#000080] hover:bg-[#000066] text-white text-sm font-semibold rounded-full transition-colors shadow-md disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Checking Status...</span>
                </>
              ) : (
                <span>Check Application Status</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xl overflow-hidden p-6 sm:p-10 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Application Reference
              </span>
              <h3 className="font-mono text-2xl font-bold text-[#000080]">
                {result.referenceNumber}
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Current Status
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mt-1 ${
                  ADMISSION_STATUS_LABELS[result.status]?.bg || "bg-gray-100"
                } ${ADMISSION_STATUS_LABELS[result.status]?.color || "text-gray-700"}`}
              >
                {ADMISSION_STATUS_LABELS[result.status]?.label || result.status}
              </span>
            </div>
          </div>

          {/* Stepper Progress */}
          <div className="py-8">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 hidden sm:block"></div>
              <div
                className="absolute top-1/2 left-0 h-1 bg-[#00bfff] -translate-y-1/2 z-0 transition-all duration-500 hidden sm:block"
                style={{
                  width: `${(getStepProgressIndex(result.status) / (ALL_STATUS_STEPS.length - 1)) * 100}%`,
                }}
              ></div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {ALL_STATUS_STEPS.map((s, idx) => {
                  const currentIdx = getStepProgressIndex(result.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;

                  return (
                    <div key={s.key} className="flex sm:flex-col items-center gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                          isDone
                            ? "bg-[#000080] text-white shadow-xs"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        } ${isCurrent ? "ring-4 ring-sky-100 bg-[#00bfff] text-white" : ""}`}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span
                        className={`text-xs text-left sm:text-center ${
                          isCurrent
                            ? "font-bold text-[#000080]"
                            : isDone
                            ? "font-medium text-gray-800"
                            : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-[#f0faff] rounded-2xl p-5 sm:p-6 border border-sky-100 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500 block">Applicant Name:</span>
                <strong className="text-gray-900">{result.fullName}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Program Name:</span>
                <strong className="text-[#000080]">{result.programName}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">Program Category:</span>
                <span className="text-gray-900">{result.programType}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Area of Study:</span>
                <span className="text-gray-900">{result.areaOfStudy}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Submission Date:</span>
                <span className="text-gray-900">{result.signedDate || new Date(result.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Last Status Update:</span>
                <span className="text-gray-900">{new Date(result.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Status Context Guidance */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 text-xs text-gray-600 leading-relaxed">
            {result.status === "SUBMITTED" && (
              <p>
                Your application has been logged into the IILP Admissions system and is queued for initial administrative assessment.
              </p>
            )}
            {result.status === "UNDER_REVIEW" && (
              <p>
                Your file is currently with the Academic Admissions Committee for comprehensive review of credentials and statement of purpose.
              </p>
            )}
            {result.status === "ADDITIONAL_INFO_REQUIRED" && (
              <p className="text-amber-800 font-medium">
                The admissions committee requires additional information or updated supporting documents. Please check your email inbox for specific instructions.
              </p>
            )}
            {result.status === "ACCEPTED" && (
              <p className="text-emerald-800 font-semibold">
                Congratulations! Your application has been accepted for admission. Formal acceptance materials have been sent to your email.
              </p>
            )}
            {result.status === "WAITLISTED" && (
              <p className="text-purple-800 font-medium">
                Your application has been placed on the admissions waitlist. We will notify you if a cohort seat becomes available.
              </p>
            )}
            {result.status === "NOT_SELECTED" && (
              <p className="text-gray-600">
                Thank you for your interest in IILP. Due to competitive cohort capacities, we are unable to offer admission for this session.
              </p>
            )}
            {result.status === "ENROLLMENT" && (
              <p className="text-blue-800 font-medium">
                You are currently in the active enrollment and matriculation stage. Welcome to IILP!
              </p>
            )}

            <p className="mt-3 text-gray-500">
              For support or inquiries, contact <a href="mailto:admissions@iilp.org" className="text-[#0084b4] underline">admissions@iilp.org</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
