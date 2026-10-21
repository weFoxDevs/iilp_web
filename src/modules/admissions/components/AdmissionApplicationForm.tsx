import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { submitAdmissionApplication } from "@/common/services/admission-application.service";

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
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", dialCode: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", dialCode: "+974", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", dialCode: "+965", name: "Kuwait", flag: "🇰🇼" },
  { code: "TR", dialCode: "+90", name: "Turkey", flag: "🇹🇷" },
  { code: "EG", dialCode: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "PK", dialCode: "+92", name: "Pakistan", flag: "🇵🇰" },
  { code: "NG", dialCode: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "ZA", dialCode: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "BR", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "KE", dialCode: "+254", name: "Kenya", flag: "🇰🇪" },
];

const PROGRAM_TYPES = [
  "Diploma Program",
  "Certificate Program",
  "Professional Training Program",
  "Short Course",
  "Other",
];

const PROGRAM_NAME_SUGGESTIONS: Record<string, string[]> = {
  "Diploma Program": [
    "Postgraduate Diploma in International Law and Diplomacy",
    "Postgraduate Diploma in Human Rights and Humanitarian Law",
    "Postgraduate Diploma in Political Science and Governance",
    "Diploma in Refugee and Forced Displacement Studies",
    "Other (Please specify)",
  ],
  "Certificate Program": [
    "Certificate in International Human Rights Law",
    "Certificate in Public Policy and Global Governance",
    "Certificate in Conflict Resolution and Peacebuilding",
    "Certificate in International Relations and Diplomacy",
    "Other (Please specify)",
  ],
  "Professional Training Program": [
    "Executive Leadership in Public Policy and Governance",
    "Legal Advocacy and International Arbitration Workshop",
    "Humanitarian Assistance and Emergency Response Training",
    "Strategic Political Communication and Analysis",
    "Other (Please specify)",
  ],
  "Short Course": [
    "Introduction to International Refugee Protection",
    "Gender, Law and Democratic Governance",
    "Climate Change and International Legal Frameworks",
    "Comparative Constitutional Law",
    "Other (Please specify)",
  ],
  "Other": ["Other Academic / Training Program"],
};

const AREAS_OF_STUDY = [
  "Law and International Legal Studies",
  "Political Science and Governance",
  "Human Rights and Humanitarian Studies",
  "Refugee and Forced Displacement Studies",
  "Social and Development Studies",
  "Peace and Conflict Studies",
  "Public Policy and Governance",
  "International Relations",
  "Other",
];

const HIGHEST_EDUCATION_LEVELS = [
  "Secondary Education",
  "Higher Secondary / College",
  "Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctoral Degree",
  "Other",
];

const CURRENT_EDUCATIONAL_STATUSES = [
  "Currently studying",
  "Recently graduated",
  "Working professional",
  "Other",
];

const AREAS_OF_EXPERIENCE_OPTIONS = [
  "Research",
  "Law",
  "Politics",
  "Human Rights",
  "Humanitarian Affairs",
  "Refugee Studies",
  "International Relations",
  "Education",
  "Public Policy",
  "Development",
  "Civil Society",
  "Other",
];

const SKILLS_OPTIONS = [
  "Academic Research",
  "Academic Writing",
  "Policy Analysis",
  "Leadership",
  "Public Speaking",
  "Teaching",
  "Advocacy",
  "Community Engagement",
  "Digital Communication",
  "Project Management",
  "International Relations",
  "Human Rights Advocacy",
  "Other",
];

interface FormDataState {
  // Section 1: Program Preferences
  programType: string;
  programNameSelect: string;
  customProgramName: string;
  areaOfStudy: string;
  studyFormat: string;

  // Section 2: Personal Profile
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  gender: string;
  genderOther: string;
  nationality: string;
  countryOfResidence: string;
  city: string;
  email: string;
  countryCode: string;
  phone: string;
  preferredLanguage: string;

  // Section 3: Educational Background
  highestEducationLevel: string;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: string;
  currentEducationalStatus: string;

  // Section 4: Professional Experience
  currentOccupation: string;
  organization: string;
  yearsOfExperience: string;
  areasOfExperience: string[];
  experienceSummary: string;

  // Section 5: Statement of Purpose
  whyIilp: string;
  academicProfessionalGoals: string;
  careerContribution: string;
  fieldInterest: string;

  // Section 6: Research Interests
  primaryResearchInterests: string;
  currentlyInResearch: string; // 'yes' | 'no'
  currentResearchDetails: string;
  hasPublications: string; // 'yes' | 'no'
  publicationDetails: string;

  // Section 7: Skills
  skills: string[];
  languagesSpoken: string;

  // Section 9: Accessibility
  requiresAccommodation: string; // 'Yes' | 'No' | 'Prefer not to disclose'
  accommodationDetails: string;

  // Section 10: Declaration
  confirmAccurate: boolean;
  agreePolicies: boolean;
  electronicSignature: string;
  signedDate: string;
}

const INITIAL_FORM_STATE: FormDataState = {
  programType: "Diploma Program",
  programNameSelect: "Postgraduate Diploma in International Law and Diplomacy",
  customProgramName: "",
  areaOfStudy: "Law and International Legal Studies",
  studyFormat: "Online",

  fullName: "",
  preferredName: "",
  dateOfBirth: "",
  gender: "Prefer not to disclose",
  genderOther: "",
  nationality: "",
  countryOfResidence: "",
  city: "",
  email: "",
  countryCode: "+1",
  phone: "",
  preferredLanguage: "English",

  highestEducationLevel: "Bachelor's Degree",
  institutionName: "",
  fieldOfStudy: "",
  graduationYear: "",
  currentEducationalStatus: "Working professional",

  currentOccupation: "",
  organization: "",
  yearsOfExperience: "1-2 years",
  areasOfExperience: [],
  experienceSummary: "",

  whyIilp: "",
  academicProfessionalGoals: "",
  careerContribution: "",
  fieldInterest: "",

  primaryResearchInterests: "",
  currentlyInResearch: "no",
  currentResearchDetails: "",
  hasPublications: "no",
  publicationDetails: "",

  skills: [],
  languagesSpoken: "English",

  requiresAccommodation: "No",
  accommodationDetails: "",

  confirmAccurate: false,
  agreePolicies: false,
  electronicSignature: "",
  signedDate: new Date().toISOString().split("T")[0],
};

const STORAGE_KEY = "iilp_admission_application_draft_v3";

interface AdmissionApplicationFormProps {
  initialProgramType?: string;
}

export default function AdmissionApplicationForm({
  initialProgramType,
}: AdmissionApplicationFormProps = {}) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_STATE);

  // File uploads state
  const [academicFiles, setAcademicFiles] = useState<File[]>([]);
  const [resumeFiles, setResumeFiles] = useState<File[]>([]);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  // Country Code Dropdown
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // UI state
  const [hasRestoredDraft, setHasRestoredDraft] = useState<boolean>(false);
  const [draftSavedTimestamp, setDraftSavedTimestamp] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceNumber: string;
    programName: string;
    email: string;
    fullName: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  // Handle external program selection (e.g. from Categories pathway cards)
  useEffect(() => {
    if (initialProgramType) {
      const match = PROGRAM_TYPES.find(
        (t) => t.toLowerCase() === initialProgramType.toLowerCase()
      );
      if (match) {
        setFormData((prev) => ({
          ...prev,
          programType: match,
          programNameSelect: (PROGRAM_NAME_SUGGESTIONS[match] || [])[0] || prev.programNameSelect,
        }));
      }
    }
  }, [initialProgramType]);

  // Click outside country dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            signedDate: new Date().toISOString().split("T")[0],
          }));
          setHasRestoredDraft(true);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save draft periodically on form changes
  useEffect(() => {
    if (submissionSuccess) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        setDraftSavedTimestamp(
          new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        );
      } catch {
        // ignore
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData, submissionSuccess]);

  // Sync electronic signature with full name initially
  useEffect(() => {
    if (formData.fullName && !formData.electronicSignature) {
      setFormData((prev) => ({ ...prev, electronicSignature: prev.fullName }));
    }
  }, [formData.fullName, formData.electronicSignature]);

  const handleChange = (
    field: keyof FormDataState,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleToggleArrayItem = (
    field: "areasOfExperience" | "skills",
    item: string
  ) => {
    setFormData((prev) => {
      const current = prev[field];
      const exists = current.includes(item);
      const updated = exists
        ? current.filter((x) => x !== item)
        : [...current, item];
      return { ...prev, [field]: updated };
    });
  };

  /**
   * Smoothly scrolls to the top of the unified form card with clearance below fixed header.
   */
  const scrollToFormTop = () => {
    const target = formTopRef.current || document.getElementById("apply-form-container");
    if (target) {
      const headerOffset = 85;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }
  };

  /**
   * Smoothly scrolls directly to the first element with validation error and focuses it.
   */
  const scrollToFirstError = (newErrors: Record<string, string>) => {
    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length === 0) return;
    const firstKey = errorKeys[0];
    const el = document.querySelector(`[data-field="${firstKey}"]`) as HTMLElement | null;
    if (el) {
      const headerOffset = 110;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
      const input = el.querySelector("input, select, textarea, button") as HTMLElement | null;
      if (input && typeof input.focus === "function") {
        setTimeout(() => input.focus(), 250);
      }
    } else {
      scrollToFormTop();
    }
  };

  // Step Validation logic
  const getStepErrors = (step: number): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.programType) newErrors.programType = "Please select a program category.";
      const progName =
        formData.programNameSelect === "Other (Please specify)" ||
        formData.programType === "Other"
          ? formData.customProgramName
          : formData.programNameSelect;
      if (!progName.trim()) newErrors.programName = "Please select or specify a program name.";
      if (!formData.areaOfStudy) newErrors.areaOfStudy = "Please select your preferred area of study.";

      if (!formData.fullName.trim()) newErrors.fullName = "Full legal name is required.";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required.";
      if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required.";
      if (!formData.countryOfResidence.trim())
        newErrors.countryOfResidence = "Country of residence is required.";
      if (!formData.city.trim()) newErrors.city = "City / Region of residence is required.";
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!formData.phone.trim())
        newErrors.phone = "Phone or WhatsApp number is required.";
    }

    if (step === 2) {
      if (!formData.highestEducationLevel)
        newErrors.highestEducationLevel = "Please select highest completed education.";
      if (!formData.institutionName.trim())
        newErrors.institutionName = "Institution / University name is required.";
      if (!formData.fieldOfStudy.trim())
        newErrors.fieldOfStudy = "Field / Major of study is required.";
      if (!formData.graduationYear.trim())
        newErrors.graduationYear = "Year of completion / expected year is required.";
    }

    if (step === 3) {
      if (!formData.whyIilp.trim())
        newErrors.whyIilp = "Please describe why you wish to study at IILP.";
      if (!formData.academicProfessionalGoals.trim())
        newErrors.academicProfessionalGoals =
          "Please describe your academic and professional goals.";
      if (!formData.careerContribution.trim())
        newErrors.careerContribution = "Please describe future career or community impact.";
      if (!formData.fieldInterest.trim())
        newErrors.fieldInterest = "Please describe the specific issue of interest.";
    }

    if (step === 4) {
      // Research & Skills optional / lenient validation
    }

    if (step === 5) {
      if (resumeFiles.length === 0) {
        newErrors.resumeDocuments = "Please upload your updated CV or Resume.";
      }
      if (!formData.confirmAccurate)
        newErrors.confirmAccurate =
          "You must confirm that the provided information is accurate.";
      if (!formData.agreePolicies)
        newErrors.agreePolicies = "You must agree to the IILP admission policies.";
      if (!formData.electronicSignature.trim())
        newErrors.electronicSignature =
          "Electronic signature / confirmation is required.";
    }

    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = getStepErrors(currentStep);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
      setTimeout(scrollToFormTop, 40);
    } else {
      scrollToFirstError(stepErrors);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    setTimeout(scrollToFormTop, 40);
  };

  const handleStepJump = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      setTimeout(scrollToFormTop, 40);
    } else if (targetStep === currentStep + 1) {
      const stepErrors = getStepErrors(currentStep);
      setErrors(stepErrors);
      if (Object.keys(stepErrors).length === 0) {
        setCurrentStep(targetStep);
        setTimeout(scrollToFormTop, 40);
      } else {
        scrollToFirstError(stepErrors);
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const stepErrors = getStepErrors(5);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      scrollToFirstError(stepErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const resolvedProgramName =
        formData.programNameSelect === "Other (Please specify)" ||
        formData.programType === "Other"
          ? formData.customProgramName.trim()
          : formData.programNameSelect.trim();

      const resolvedGender =
        formData.gender === "Other" ? formData.genderOther.trim() || "Other" : formData.gender;

      const payload = new FormData();
      payload.append("programType", formData.programType);
      payload.append("programName", resolvedProgramName);
      payload.append("areaOfStudy", formData.areaOfStudy);
      payload.append("studyFormat", formData.studyFormat);

      payload.append("fullName", formData.fullName.trim());
      if (formData.preferredName) payload.append("preferredName", formData.preferredName.trim());
      payload.append("dateOfBirth", formData.dateOfBirth);
      payload.append("gender", resolvedGender);
      payload.append("nationality", formData.nationality.trim());
      payload.append("countryOfResidence", formData.countryOfResidence.trim());
      payload.append("city", formData.city.trim());
      payload.append("email", formData.email.trim());
      payload.append("countryCode", formData.countryCode);
      payload.append("phone", formData.phone.trim());
      if (formData.preferredLanguage) payload.append("preferredLanguage", formData.preferredLanguage.trim());

      payload.append("highestEducationLevel", formData.highestEducationLevel);
      payload.append("institutionName", formData.institutionName.trim());
      payload.append("fieldOfStudy", formData.fieldOfStudy.trim());
      payload.append("graduationYear", formData.graduationYear.trim());
      if (formData.currentEducationalStatus) payload.append("currentEducationalStatus", formData.currentEducationalStatus);

      if (formData.currentOccupation) payload.append("currentOccupation", formData.currentOccupation.trim());
      if (formData.organization) payload.append("organization", formData.organization.trim());
      if (formData.yearsOfExperience) payload.append("yearsOfExperience", formData.yearsOfExperience);
      if (formData.areasOfExperience && formData.areasOfExperience.length > 0) {
        payload.append("areasOfExperience", JSON.stringify(formData.areasOfExperience));
      }
      if (formData.experienceSummary) payload.append("experienceSummary", formData.experienceSummary.trim());

      payload.append("whyIilp", formData.whyIilp.trim());
      payload.append("academicProfessionalGoals", formData.academicProfessionalGoals.trim());
      payload.append("careerContribution", formData.careerContribution.trim());
      payload.append("fieldInterest", formData.fieldInterest.trim());

      if (formData.primaryResearchInterests) payload.append("primaryResearchInterests", formData.primaryResearchInterests.trim());
      payload.append("currentlyInResearch", formData.currentlyInResearch);
      if (formData.currentResearchDetails) payload.append("currentResearchDetails", formData.currentResearchDetails.trim());
      payload.append("hasPublications", formData.hasPublications);
      if (formData.publicationDetails) payload.append("publicationDetails", formData.publicationDetails.trim());

      if (formData.skills && formData.skills.length > 0) {
        payload.append("skills", JSON.stringify(formData.skills));
      }
      if (formData.languagesSpoken) payload.append("languagesSpoken", formData.languagesSpoken.trim());

      payload.append("requiresAccommodation", formData.requiresAccommodation);
      if (formData.accommodationDetails) payload.append("accommodationDetails", formData.accommodationDetails.trim());

      payload.append("confirmAccurate", String(formData.confirmAccurate));
      payload.append("agreePolicies", String(formData.agreePolicies));
      payload.append("electronicSignature", formData.electronicSignature.trim());
      payload.append("signedDate", formData.signedDate);

      // Files
      resumeFiles.forEach((file) => payload.append("resumeDocuments", file));
      academicFiles.forEach((file) => payload.append("academicDocuments", file));
      additionalFiles.forEach((file) => payload.append("additionalDocuments", file));

      const result = await submitAdmissionApplication(payload);

      // Clear draft on successful submit
      localStorage.removeItem(STORAGE_KEY);

      setSubmissionSuccess({
        referenceNumber: result.referenceNumber,
        programName: result.programName,
        email: result.email,
        fullName: result.fullName,
      });
      setTimeout(scrollToFormTop, 40);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while submitting your application. Please check all fields and try again."
      );
      setTimeout(scrollToFormTop, 40);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Program & Profile", desc: "Track & contact details" },
    { num: 2, title: "Education & Career", desc: "Qualifications & experience" },
    { num: 3, title: "Statement of Purpose", desc: "Admissions essays" },
    { num: 4, title: "Research & Skills", desc: "Interests & capabilities" },
    { num: 5, title: "Documents & Sign", desc: "Uploads & declaration" },
  ];

  const currentCountry =
    COUNTRY_DIAL_CODES.find((c) => c.dialCode === formData.countryCode) ||
    COUNTRY_DIAL_CODES[0];

  // ================= SUCCESS SCREEN =================
  if (submissionSuccess) {
    return (
      <div ref={formTopRef} className="w-full max-w-[852px] mx-auto">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#b0ebff] shadow-sm p-6 sm:p-12 text-center animate-fadeIn">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#e6f9ff] text-[#00bfff] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <span className="inline-block px-3.5 py-1 bg-[#e6f9ff] text-[#00698c] rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Application Received
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#0a0d12] mb-3">
            Thank you, {submissionSuccess.fullName}!
          </h2>
          <p className="text-[#4a5565] max-w-lg mx-auto text-sm sm:text-base mb-8 leading-relaxed">
            Your admission application for <strong>{submissionSuccess.programName}</strong> has been
            successfully received by the International Institute for Law and Politics.
          </p>

          {/* Reference Card */}
          <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-2xl p-5 sm:p-7 max-w-md mx-auto mb-8 text-left shadow-xs">
            <p className="text-[11px] font-semibold text-[#6a7282] uppercase tracking-wider mb-1">
              Application Reference Number
            </p>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#000080] tracking-wide">
                {submissionSuccess.referenceNumber}
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(submissionSuccess.referenceNumber);
                  alert("Reference number copied to clipboard!");
                }}
                className="px-3.5 py-1.5 bg-white border border-[#b0ebff] hover:bg-[#e6f9ff] text-[#00698c] text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-[#6a7282] mt-3 pt-3 border-t border-[#e5e7eb]">
              Confirmation email sent to <strong>{submissionSuccess.email}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/apply?tab=track&ref=${encodeURIComponent(
                submissionSuccess.referenceNumber
              )}&email=${encodeURIComponent(submissionSuccess.email)}#apply`}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#000080] hover:bg-[#000066] text-white text-sm font-semibold rounded-full transition-colors text-center shadow-xs"
            >
              Track Application Status
            </Link>
            <button
              type="button"
              onClick={() => {
                setSubmissionSuccess(null);
                setFormData(INITIAL_FORM_STATE);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-gray-100 hover:bg-gray-200 text-[#4a5565] text-sm font-semibold rounded-full transition-colors text-center cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={formTopRef} className="w-full max-w-[920px] mx-auto">
      {/* Draft Restore Notification */}
      {hasRestoredDraft && (
        <div className="mb-4 sm:mb-6 p-4 bg-[#f0faff] border border-[#b0ebff] rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm text-[#00698c]">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 shrink-0 text-[#00bfff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Restored your saved application draft. {draftSavedTimestamp && `(Auto-saved ${draftSavedTimestamp})`}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("Clear saved draft and start fresh?")) {
                localStorage.removeItem(STORAGE_KEY);
                setFormData(INITIAL_FORM_STATE);
                setHasRestoredDraft(false);
              }
            }}
            className="text-xs font-semibold text-[#000080] hover:underline shrink-0 cursor-pointer"
          >
            Clear Draft
          </button>
        </div>
      )}

      {/* Main Unified Form Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#b0ebff] shadow-md overflow-hidden transition-all">
        {/* ================= INTEGRATED STEPPER HEADER ================= */}
        <div className="bg-gradient-to-b from-[#f4fcff] via-[#f9fdff] to-white border-b border-[#b0ebff]/60 p-4 sm:p-6 lg:p-7">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#000080] uppercase tracking-wider text-xs sm:text-sm">
                Step {currentStep} of 5:
              </span>
              <span className="text-[#00506b] font-medium hidden sm:inline">
                {stepsList[currentStep - 1].title}
              </span>
            </div>
            <span className="font-bold text-[#00698c] bg-[#e6f9ff] border border-[#b0ebff] px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs">
              {Math.round((currentStep / 5) * 100)}% Completed
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4 sm:mb-5">
            <div
              className="h-full bg-gradient-to-r from-[#00bfff] via-[#00698c] to-[#000080] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>

          {/* Desktop Stepper Tabs */}
          <div className="hidden sm:grid grid-cols-5 gap-2">
            {stepsList.map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => handleStepJump(step.num)}
                  disabled={step.num > currentStep + 1}
                  className={`flex flex-col items-start p-2.5 rounded-xl text-left transition-all ${
                    isCurrent
                      ? "bg-white border-2 border-[#000080] shadow-xs"
                      : isCompleted
                      ? "bg-[#e6f9ff]/60 border border-[#b0ebff] hover:bg-[#e6f9ff] cursor-pointer"
                      : "bg-gray-50/70 border border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 w-full">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        isCompleted
                          ? "bg-[#000080] text-white"
                          : isCurrent
                          ? "bg-[#00bfff] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? "✓" : step.num}
                    </span>
                    <span className={`text-xs font-bold truncate ${isCurrent ? "text-[#000080]" : "text-gray-700"}`}>
                      {step.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 truncate w-full pl-6">
                    {step.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Step Indicators */}
          <div className="sm:hidden grid grid-cols-5 gap-1.5">
            {stepsList.map((step) => {
              const isCompleted = currentStep > step.num;
              const isCurrent = currentStep === step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => handleStepJump(step.num)}
                  disabled={step.num > currentStep + 1}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isCurrent
                      ? "bg-[#000080] text-white shadow-xs"
                      : isCompleted
                      ? "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
                      : "bg-gray-100 text-gray-400 opacity-70"
                  }`}
                >
                  <span>{isCompleted ? "✓" : step.num}</span>
                </button>
              );
            })}
          </div>
        </div>

        {submitError && (
          <div className="m-4 sm:m-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs sm:text-sm flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        {/* ================= FORM BODY ================= */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-7 md:p-9">
          {/* ================= STEP 1: PROGRAM & PERSONAL ================= */}
          {currentStep === 1 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              {/* Header */}
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                  Sections 1 & 2
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0d12] mt-0.5">
                  Program Selection & Personal Information
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                  Select your intended course of study and provide contact details for admissions processing.
                </p>
              </div>

              {/* Sub-section: Program Preferences */}
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Program Preferences
                </div>

                {/* Program Type Tiles */}
                <div data-field="programType">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-2">
                    <span>Select Program Category</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
                    {PROGRAM_TYPES.map((type) => {
                      const isSelected = formData.programType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            handleChange("programType", type);
                            const suggestions = PROGRAM_NAME_SUGGESTIONS[type] || [];
                            if (suggestions.length > 0) {
                              handleChange("programNameSelect", suggestions[0]);
                            }
                          }}
                          className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all flex flex-col items-center justify-center gap-1 min-h-[58px] cursor-pointer ${
                            isSelected
                              ? "bg-[#e6f9ff] border-[#000080] text-[#000080] shadow-xs ring-1 ring-[#000080]"
                              : "border-[#d0d5dd] hover:border-gray-400 text-gray-700 bg-white"
                          }`}
                        >
                          <span className="leading-tight">{type}</span>
                          {isSelected && <span className="text-[10px] text-[#000080]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                  {errors.programType && (
                    <p className="text-xs text-rose-500 mt-1.5">{errors.programType}</p>
                  )}
                </div>

                {/* Specific Program Name */}
                <div data-field="programName">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    <span>Specific Program Name</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <select
                    value={formData.programNameSelect}
                    onChange={(e) => handleChange("programNameSelect", e.target.value)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none transition-all"
                  >
                    {(PROGRAM_NAME_SUGGESTIONS[formData.programType] || ["Other (Please specify)"]).map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>

                  {(formData.programNameSelect === "Other (Please specify)" ||
                    formData.programType === "Other") && (
                    <div className="mt-2.5">
                      <input
                        type="text"
                        placeholder="Type custom program title..."
                        value={formData.customProgramName}
                        onChange={(e) => handleChange("customProgramName", e.target.value)}
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                      />
                    </div>
                  )}
                  {errors.programName && (
                    <p className="text-xs text-rose-500 mt-1">{errors.programName}</p>
                  )}
                </div>

                {/* Area of Study & Study Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div data-field="areaOfStudy">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Preferred Area of Study</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <select
                      value={formData.areaOfStudy}
                      onChange={(e) => handleChange("areaOfStudy", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm text-[#101828] rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none transition-all"
                    >
                      {AREAS_OF_STUDY.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                    {errors.areaOfStudy && (
                      <p className="text-xs text-rose-500 mt-1">{errors.areaOfStudy}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Study Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Online", "Hybrid / Distance"].map((fmt) => {
                        const isChecked = formData.studyFormat === fmt;
                        return (
                          <label
                            key={fmt}
                            className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                              isChecked
                                ? "bg-[#e6f9ff] border-[#000080] text-[#000080] font-bold shadow-xs"
                                : "bg-[#f9fafb] border-[#d0d5dd] text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="studyFormat"
                              value={fmt}
                              checked={isChecked}
                              onChange={(e) => handleChange("studyFormat", e.target.value)}
                              className="w-4 h-4 text-[#000080] focus:ring-[#000080]"
                            />
                            <span>{fmt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-section: Personal Profile */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Personal & Contact Details
                </div>

                {/* Full Name & Preferred Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div data-field="fullName">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Full Legal Name</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="As written on passport or national ID"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.fullName
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Preferred Name / Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amina, Dr., Mr."
                      value={formData.preferredName}
                      onChange={(e) => handleChange("preferredName", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                    />
                  </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div data-field="dateOfBirth">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Date of Birth</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.dateOfBirth
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.dateOfBirth && <p className="text-xs text-rose-500 mt-1">{errors.dateOfBirth}</p>}
                  </div>

                  <div>
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Gender Identity</span>
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Prefer not to disclose">Prefer not to disclose</option>
                      <option value="Other">Other</option>
                    </select>
                    {formData.gender === "Other" && (
                      <input
                        type="text"
                        placeholder="Specify gender..."
                        value={formData.genderOther}
                        onChange={(e) => handleChange("genderOther", e.target.value)}
                        className="w-full mt-2 bg-[#f9fafb] border border-[#d0d5dd] px-4 py-2 text-xs rounded-xl"
                      />
                    )}
                  </div>
                </div>

                {/* Nationality, Country, City */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div data-field="nationality">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Nationality</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangladeshi, British"
                      value={formData.nationality}
                      onChange={(e) => handleChange("nationality", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.nationality
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.nationality && <p className="text-xs text-rose-500 mt-1">{errors.nationality}</p>}
                  </div>

                  <div data-field="countryOfResidence">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Country of Residence</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Country of residence"
                      value={formData.countryOfResidence}
                      onChange={(e) => handleChange("countryOfResidence", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.countryOfResidence
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.countryOfResidence && (
                      <p className="text-xs text-rose-500 mt-1">{errors.countryOfResidence}</p>
                    )}
                  </div>

                  <div data-field="city">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>City / Location</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. London, Dhaka"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.city
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
                  </div>
                </div>

                {/* Email, Phone & Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div data-field="email">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Email Address</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.email
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                  </div>

                  <div data-field="phone">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Phone / WhatsApp Number</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <div
                      className={`flex rounded-xl border bg-[#f9fafb] transition-all overflow-visible relative ${
                        errors.phone ? "border-rose-400" : "border-[#d0d5dd] focus-within:border-[#000080] focus-within:ring-2 focus-within:ring-[#000080]/15 focus-within:bg-white"
                      }`}
                    >
                      {/* Country Code Trigger */}
                      <div className="relative" ref={countryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsCountryDropdownOpen((p) => !p)}
                          className="flex items-center gap-1.5 px-3 py-3 border-r border-[#d0d5dd] hover:bg-gray-100 text-xs sm:text-sm font-medium text-gray-700 cursor-pointer h-full select-none"
                        >
                          <span>{currentCountry.flag}</span>
                          <span>{currentCountry.dialCode}</span>
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isCountryDropdownOpen && (
                          <div className="absolute top-full left-0 mt-1.5 w-64 max-h-60 overflow-y-auto bg-white border border-[#b0ebff] rounded-xl shadow-2xl z-50 p-1">
                            {COUNTRY_DIAL_CODES.map((c) => (
                              <button
                                key={`${c.code}-${c.dialCode}`}
                                type="button"
                                onClick={() => {
                                  handleChange("countryCode", c.dialCode);
                                  setIsCountryDropdownOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-[#e6f9ff] text-left cursor-pointer"
                              >
                                <span className="flex items-center gap-2 truncate">
                                  <span>{c.flag}</span>
                                  <span className="truncate">{c.name}</span>
                                </span>
                                <span className="font-mono text-gray-500 shrink-0">{c.dialCode}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="flex-1 bg-transparent px-3.5 py-3 text-sm text-[#101828] outline-none"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Preferred Language */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Preferred Language of Study
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English, French, Spanish"
                    value={formData.preferredLanguage}
                    onChange={(e) => handleChange("preferredLanguage", e.target.value)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 2: EDUCATION & EXPERIENCE ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                  Sections 3 & 4
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0d12] mt-0.5">
                  Educational Background & Professional Experience
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                  Provide details of your academic qualifications and professional career record.
                </p>
              </div>

              {/* Sub-section: Education */}
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Academic Qualifications
                </div>

                <div data-field="highestEducationLevel">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-2">
                    <span>Highest Level of Education Completed</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {HIGHEST_EDUCATION_LEVELS.map((level) => {
                      const isSelected = formData.highestEducationLevel === level;
                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleChange("highestEducationLevel", level)}
                          className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#e6f9ff] border-[#000080] text-[#000080] shadow-xs ring-1 ring-[#000080]"
                              : "border-[#d0d5dd] hover:border-gray-400 text-gray-700 bg-white"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  {errors.highestEducationLevel && (
                    <p className="text-xs text-rose-500 mt-1">{errors.highestEducationLevel}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div data-field="institutionName">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Name of Institution</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oxford, Dhaka University"
                      value={formData.institutionName}
                      onChange={(e) => handleChange("institutionName", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.institutionName
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.institutionName && (
                      <p className="text-xs text-rose-500 mt-1">{errors.institutionName}</p>
                    )}
                  </div>

                  <div data-field="fieldOfStudy">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Field / Major of Study</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. International Law, Politics"
                      value={formData.fieldOfStudy}
                      onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.fieldOfStudy
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.fieldOfStudy && (
                      <p className="text-xs text-rose-500 mt-1">{errors.fieldOfStudy}</p>
                    )}
                  </div>

                  <div data-field="graduationYear">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      <span>Year of Completion</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2024"
                      value={formData.graduationYear}
                      onChange={(e) => handleChange("graduationYear", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm rounded-xl outline-none transition-all ${
                        errors.graduationYear
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.graduationYear && (
                      <p className="text-xs text-rose-500 mt-1">{errors.graduationYear}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Current Educational Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CURRENT_EDUCATIONAL_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleChange("currentEducationalStatus", status)}
                        className={`p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          formData.currentEducationalStatus === status
                            ? "bg-[#e6f9ff] border-[#000080] text-[#000080] font-bold shadow-xs ring-1 ring-[#000080]"
                            : "border-[#d0d5dd] hover:border-gray-400 text-gray-700 bg-white"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-section: Professional Background */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Professional Experience
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Current Occupation / Job Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Legal Associate, Policy Analyst"
                      value={formData.currentOccupation}
                      onChange={(e) => handleChange("currentOccupation", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Current Organization / Employer
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ministry of Foreign Affairs, NGO"
                      value={formData.organization}
                      onChange={(e) => handleChange("organization", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Total Years of Relevant Experience
                  </label>
                  <select
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleChange("yearsOfExperience", e.target.value)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                  >
                    <option value="None / Student">None / Student</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-2">
                    Primary Areas of Experience (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AREAS_OF_EXPERIENCE_OPTIONS.map((area) => {
                      const isSelected = formData.areasOfExperience.includes(area);
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => handleToggleArrayItem("areasOfExperience", area)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#000080] text-white shadow-xs"
                              : "bg-[#f9fafb] border border-[#d0d5dd] text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {isSelected ? `✓ ${area}` : `+ ${area}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Brief Summary of Professional Background (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a short synopsis of your key roles, initiatives, or responsibilities..."
                    value={formData.experienceSummary}
                    onChange={(e) => handleChange("experienceSummary", e.target.value)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] p-4 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: STATEMENT OF PURPOSE ================= */}
          {currentStep === 3 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                  Section 5
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0d12] mt-0.5">
                  Statement of Purpose & Admissions Essays
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                  Please answer the four admissions questions below. Be thoughtful, direct, and specific (recommended 150-350 words per essay).
                </p>
              </div>

              {/* Tip Callout */}
              <div className="p-4 bg-[#f0faff] border border-[#b0ebff] rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-[#00698c]">
                <span className="text-base">💡</span>
                <p className="leading-relaxed">
                  <strong>Admissions Committee Advice:</strong> The committee values demonstrated intellectual curiosity, alignment with IILP&apos;s mission, and practical commitment to advancing the rule of law and human dignity.
                </p>
              </div>

              {/* Essay 1 */}
              <div data-field="whyIilp" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828]">
                    <span>Why do you wish to study at the International Institute for Law and Politics (IILP)?</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formData.whyIilp.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Outline your motivation, why IILP's faculty or curriculum appeal to you, and what you hope to achieve..."
                  value={formData.whyIilp}
                  onChange={(e) => handleChange("whyIilp", e.target.value)}
                  className={`w-full bg-[#f9fafb] border p-4 text-sm rounded-xl outline-none transition-all ${
                    errors.whyIilp
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                  }`}
                />
                {errors.whyIilp && <p className="text-xs text-rose-500">{errors.whyIilp}</p>}
              </div>

              {/* Essay 2 */}
              <div data-field="academicProfessionalGoals" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828]">
                    <span>What are your primary academic and professional goals?</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formData.academicProfessionalGoals.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe your immediate short-term plans and long-term career aspirations..."
                  value={formData.academicProfessionalGoals}
                  onChange={(e) => handleChange("academicProfessionalGoals", e.target.value)}
                  className={`w-full bg-[#f9fafb] border p-4 text-sm rounded-xl outline-none transition-all ${
                    errors.academicProfessionalGoals
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                  }`}
                />
                {errors.academicProfessionalGoals && (
                  <p className="text-xs text-rose-500">{errors.academicProfessionalGoals}</p>
                )}
              </div>

              {/* Essay 3 */}
              <div data-field="careerContribution" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828]">
                    <span>How will this program contribute to your future career or community leadership?</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formData.careerContribution.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Explain how the competencies gained will enable you to make tangible contributions to your organization or country..."
                  value={formData.careerContribution}
                  onChange={(e) => handleChange("careerContribution", e.target.value)}
                  className={`w-full bg-[#f9fafb] border p-4 text-sm rounded-xl outline-none transition-all ${
                    errors.careerContribution
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                  }`}
                />
                {errors.careerContribution && (
                  <p className="text-xs text-rose-500">{errors.careerContribution}</p>
                )}
              </div>

              {/* Essay 4 */}
              <div data-field="fieldInterest" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828]">
                    <span>Describe a specific issue in international law, politics, or human rights that interests you deeply.</span>
                    <span className="text-[#c70036] ml-1">*</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {formData.fieldInterest.length} chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Identify a contemporary conflict, institutional challenge, policy dilemma, or human rights situation you are passionate about..."
                  value={formData.fieldInterest}
                  onChange={(e) => handleChange("fieldInterest", e.target.value)}
                  className={`w-full bg-[#f9fafb] border p-4 text-sm rounded-xl outline-none transition-all ${
                    errors.fieldInterest
                      ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                      : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                  }`}
                />
                {errors.fieldInterest && (
                  <p className="text-xs text-rose-500">{errors.fieldInterest}</p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 4: RESEARCH & SKILLS ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                  Sections 6, 7 & 9
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0d12] mt-0.5">
                  Research Interests, Key Skills & Accessibility
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                  Share your scholarship interests, practical capabilities, and any special support requirements.
                </p>
              </div>

              {/* Sub-section: Research */}
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Research & Scholarship
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Primary Research Interests or Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What specific themes or research questions do you aim to explore during your studies?"
                    value={formData.primaryResearchInterests}
                    onChange={(e) => handleChange("primaryResearchInterests", e.target.value)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] p-4 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Are you currently engaged in any research activity?
                    </label>
                    <div className="flex gap-4 pt-1">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="currentlyInResearch"
                            value={val}
                            checked={formData.currentlyInResearch === val}
                            onChange={(e) => handleChange("currentlyInResearch", e.target.value)}
                            className="w-4 h-4 text-[#000080] focus:ring-[#000080]"
                          />
                          <span className="capitalize">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Do you have published writing, policy papers, or articles?
                    </label>
                    <div className="flex gap-4 pt-1">
                      {["yes", "no"].map((val) => (
                        <label key={val} className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer">
                          <input
                            type="radio"
                            name="hasPublications"
                            value={val}
                            checked={formData.hasPublications === val}
                            onChange={(e) => handleChange("hasPublications", e.target.value)}
                            className="w-4 h-4 text-[#000080] focus:ring-[#000080]"
                          />
                          <span className="capitalize">{val}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {(formData.currentlyInResearch === "yes" || formData.hasPublications === "yes") && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Publication / Research Details or Web Links
                    </label>
                    <textarea
                      rows={2}
                      placeholder="List titles, publications, links, or brief descriptions..."
                      value={formData.publicationDetails}
                      onChange={(e) => handleChange("publicationDetails", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] p-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Sub-section: Skills */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Skills & Languages
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-2">
                    Key Practical & Academic Skills (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS_OPTIONS.map((skill) => {
                      const isSelected = formData.skills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleArrayItem("skills", skill)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#000080] text-white shadow-xs"
                              : "bg-[#f9fafb] border border-[#d0d5dd] text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {isSelected ? `✓ ${skill}` : `+ ${skill}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Languages Spoken / Written
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. English (Fluent), French (Intermediate), Bengali (Native)"
                    value={formData.languagesSpoken}
                    onChange={(e) => handleChange("languagesSpoken", e.target.value)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] px-4 py-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                  />
                </div>
              </div>

              {/* Sub-section: Accessibility */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Accessibility & Learning Support
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                    Do you require any accessibility accommodation or special learning support?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["No", "Yes", "Prefer not to disclose"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleChange("requiresAccommodation", opt)}
                        className={`p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          formData.requiresAccommodation === opt
                            ? "bg-[#e6f9ff] border-[#000080] text-[#000080] shadow-xs ring-1 ring-[#000080]"
                            : "border-[#d0d5dd] hover:border-gray-400 text-gray-700 bg-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.requiresAccommodation === "Yes" && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-[#101828] mb-1.5">
                      Please describe your accommodation needs
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Let us know how our academic team can best support your learning..."
                      value={formData.accommodationDetails}
                      onChange={(e) => handleChange("accommodationDetails", e.target.value)}
                      className="w-full bg-[#f9fafb] border border-[#d0d5dd] p-3 text-sm rounded-xl focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15 outline-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 5: DOCUMENTS & SIGN ================= */}
          {currentStep === 5 && (
            <div className="space-y-6 sm:space-y-7 animate-fadeIn">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00698c]">
                  Sections 8 & 10
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0a0d12] mt-0.5">
                  Supporting Documents & Official Declaration
                </h3>
                <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                  Upload your credentials and submit your official electronic signature to finalize your application.
                </p>
              </div>

              {/* Sub-section: Documents */}
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Required Document Uploads
                </div>

                {/* Resume Upload (Mandatory) */}
                <div data-field="resumeDocuments" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-xs sm:text-sm font-semibold text-[#101828]">
                      <span>Curriculum Vitae / Resume</span>
                      <span className="text-[#c70036] ml-1">* (PDF, DOC, DOCX up to 10MB)</span>
                    </label>
                    <span className="text-xs text-gray-400">
                      {resumeFiles.length} file(s) selected
                    </span>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      errors.resumeDocuments
                        ? "border-rose-400 bg-rose-50/20"
                        : "border-[#b0ebff] hover:border-[#00bfff] bg-[#f0faff]"
                    }`}
                  >
                    <input
                      type="file"
                      id="resume-input"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files) {
                          setResumeFiles(Array.from(e.target.files));
                          if (errors.resumeDocuments) {
                            setErrors((p) => {
                              const copy = { ...p };
                              delete copy.resumeDocuments;
                              return copy;
                            });
                          }
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="resume-input" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#000080]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-[#000080]">
                        Click to browse or drag and drop your CV / Resume
                      </span>
                      <span className="text-xs text-gray-500">
                        Mandatory for all academic pathways
                      </span>
                    </label>
                  </div>

                  {resumeFiles.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {resumeFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        >
                          <span className="truncate font-medium text-gray-700">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setResumeFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-rose-500 hover:text-rose-700 ml-2 font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.resumeDocuments && (
                    <p className="text-xs text-rose-500">{errors.resumeDocuments}</p>
                  )}
                </div>

                {/* Academic Transcripts Dropzone (Optional) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-[#101828]">
                      Academic Transcripts / Degree Certificates (Recommended)
                    </label>
                    <span className="text-xs text-gray-400">
                      {academicFiles.length} file(s) selected
                    </span>
                  </div>

                  <div className="border border-dashed border-gray-300 hover:border-[#000080] bg-[#f9fafb] rounded-2xl p-5 text-center transition-all cursor-pointer">
                    <input
                      type="file"
                      id="academic-input"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files) {
                          setAcademicFiles(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="academic-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        Upload transcripts, degree scans, or certificates
                      </span>
                      <span className="text-xs text-gray-400">
                        PDF, DOC, DOCX, PNG, JPG (multiple files allowed)
                      </span>
                    </label>
                  </div>

                  {academicFiles.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {academicFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        >
                          <span className="truncate font-medium text-gray-700">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setAcademicFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-rose-500 hover:text-rose-700 ml-2 font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Supporting Documents (Optional) */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-[#101828]">
                      Additional Documents (Writing Samples, Letters of Recommendation)
                    </label>
                    <span className="text-xs text-gray-400">
                      {additionalFiles.length} file(s) selected
                    </span>
                  </div>

                  <div className="border border-dashed border-gray-300 hover:border-[#000080] bg-[#f9fafb] rounded-2xl p-5 text-center transition-all cursor-pointer">
                    <input
                      type="file"
                      id="additional-input"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        if (e.target.files) {
                          setAdditionalFiles(Array.from(e.target.files));
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="additional-input" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700">
                        Upload recommendations, policy briefs, or writing samples
                      </span>
                      <span className="text-xs text-gray-400">
                        Optional supporting documentation
                      </span>
                    </label>
                  </div>

                  {additionalFiles.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      {additionalFiles.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        >
                          <span className="truncate font-medium text-gray-700">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setAdditionalFiles((prev) => prev.filter((_, idx) => idx !== i))}
                            className="text-rose-500 hover:text-rose-700 ml-2 font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-section: Terms & Declaration */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="inline-block px-3 py-1 bg-[#e6f9ff] text-[#00698c] rounded-md text-[11px] font-bold uppercase tracking-wider">
                  Terms of Admission & Declaration
                </div>

                <div className="space-y-3 bg-[#f9fafb] border border-[#d0d5dd] rounded-2xl p-4 sm:p-5">
                  <label data-field="confirmAccurate" className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmAccurate}
                      onChange={(e) => handleChange("confirmAccurate", e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#000080] rounded border-gray-300 focus:ring-[#000080]"
                    />
                    <span className="text-xs sm:text-sm text-[#101828] font-medium leading-snug">
                      I confirm that the information provided in this application is accurate and complete to the best of my knowledge. <span className="text-[#c70036]">*</span>
                    </span>
                  </label>
                  {errors.confirmAccurate && (
                    <p className="text-xs text-rose-500 ml-7">{errors.confirmAccurate}</p>
                  )}

                  <label data-field="agreePolicies" className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreePolicies}
                      onChange={(e) => handleChange("agreePolicies", e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#000080] rounded border-gray-300 focus:ring-[#000080]"
                    />
                    <span className="text-xs sm:text-sm text-[#101828] font-medium leading-snug">
                      I agree to the IILP admission policies, code of conduct, and academic terms of study. <span className="text-[#c70036]">*</span>
                    </span>
                  </label>
                  {errors.agreePolicies && (
                    <p className="text-xs text-rose-500 ml-7">{errors.agreePolicies}</p>
                  )}
                </div>

                {/* Signature & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Applicant Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.fullName || "Applicant"}
                      className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700 rounded-xl select-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.signedDate}
                      className="w-full bg-gray-100 border border-gray-200 px-4 py-3 text-xs sm:text-sm font-medium text-gray-700 rounded-xl select-none"
                    />
                  </div>

                  <div data-field="electronicSignature">
                    <label className="flex items-center text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      <span>Electronic Signature</span>
                      <span className="text-[#c70036] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Type your full legal name"
                      value={formData.electronicSignature}
                      onChange={(e) => handleChange("electronicSignature", e.target.value)}
                      className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm font-serif italic rounded-xl outline-none transition-all ${
                        errors.electronicSignature
                          ? "border-rose-400 bg-rose-50/20 focus:border-rose-500"
                          : "border-[#d0d5dd] focus:bg-white focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/15"
                      }`}
                    />
                    {errors.electronicSignature && (
                      <p className="text-xs text-rose-500 mt-1">{errors.electronicSignature}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEPPER ACTION BUTTONS ================= */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>&larr;</span>
                <span>Back to Step {currentStep - 1}</span>
              </button>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            <div className="hidden sm:inline-block text-xs font-semibold text-gray-400">
              Step {currentStep} of 5
            </div>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#000080] hover:bg-[#000066] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <span>&rarr;</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-[#00bfff] hover:bg-[#00a3db] text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Official Application &rarr;</span>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
