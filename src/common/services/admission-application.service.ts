export interface ApplicationDocument {
  name: string;
  url: string;
  size?: number;
  mimetype?: string;
}

export type AdmissionApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ADDITIONAL_INFO_REQUIRED'
  | 'ACCEPTED'
  | 'WAITLISTED'
  | 'NOT_SELECTED'
  | 'ENROLLMENT';

export const ADMISSION_STATUS_LABELS: Record<AdmissionApplicationStatus, { label: string; color: string; bg: string }> = {
  SUBMITTED: { label: 'Application Submitted', color: 'text-sky-700', bg: 'bg-sky-50 border-sky-200' },
  UNDER_REVIEW: { label: 'Under Review', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  ADDITIONAL_INFO_REQUIRED: { label: 'Additional Info Required', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  ACCEPTED: { label: 'Accepted', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  WAITLISTED: { label: 'Waitlisted', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
  NOT_SELECTED: { label: 'Not Selected', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200' },
  ENROLLMENT: { label: 'Enrollment', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
};

export interface AdmissionApplicationItem {
  id: string;
  referenceNumber: string;

  // Section 1
  programType: string;
  programName: string;
  areaOfStudy: string;
  studyFormat: string;

  // Section 2
  fullName: string;
  preferredName?: string | null;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  countryOfResidence: string;
  city: string;
  email: string;
  phone: string;
  preferredLanguage: string;

  // Section 3
  highestEducationLevel: string;
  institutionName: string;
  fieldOfStudy: string;
  graduationYear: string;
  currentEducationalStatus: string;
  academicDocuments: ApplicationDocument[];

  // Section 4
  currentOccupation?: string | null;
  organization?: string | null;
  yearsOfExperience?: string | null;
  areasOfExperience: string[];
  experienceSummary?: string | null;

  // Section 5
  whyIilp: string;
  academicProfessionalGoals: string;
  careerContribution: string;
  fieldInterest: string;

  // Section 6
  primaryResearchInterests?: string | null;
  currentlyInResearch: boolean;
  currentResearchDetails?: string | null;
  hasPublications: boolean;
  publicationDetails?: string | null;

  // Section 7
  skills: string[];
  languagesSpoken?: string | null;

  // Section 8
  resumeDocuments: ApplicationDocument[];
  additionalDocuments: ApplicationDocument[];

  // Section 9
  requiresAccommodation: string;
  accommodationDetails?: string | null;

  // Section 10
  confirmAccurate: boolean;
  agreePolicies: boolean;
  electronicSignature: string;
  signedDate: string;

  // Status & Notes
  status: AdmissionApplicationStatus;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdmissionApplicationsResponse {
  data: AdmissionApplicationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    total: number;
    submitted: number;
    underReview: number;
    additionalInfoRequired: number;
    accepted: number;
    waitlisted: number;
    notSelected: number;
    enrollment: number;
  };
}

export interface TrackApplicationResponse {
  referenceNumber: string;
  fullName: string;
  programName: string;
  programType: string;
  areaOfStudy: string;
  status: AdmissionApplicationStatus;
  signedDate: string;
  createdAt: string;
  updatedAt: string;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Public submission of admission application
 */
export async function submitAdmissionApplication(
  formData: FormData
): Promise<AdmissionApplicationItem> {
  const url = `${getApiUrl()}/admissions/apply`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData.message ||
      (Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : 'Failed to submit admission application');
    throw new Error(message);
  }

  return res.json();
}

/**
 * Public status tracking by Reference Number and Email
 */
export async function trackAdmissionApplication(
  referenceNumber: string,
  email: string
): Promise<TrackApplicationResponse> {
  const params = new URLSearchParams({
    referenceNumber: referenceNumber.trim(),
    email: email.trim(),
  });
  const url = `${getApiUrl()}/admissions/track?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'No application found with these details.');
  }

  return res.json();
}

/**
 * Admin: Get all applications with search, status & pagination
 */
export async function getAdminAdmissionApplications(
  token: string,
  params?: {
    search?: string;
    status?: string;
    programType?: string;
    programName?: string;
    page?: number;
    limit?: number;
  }
): Promise<AdmissionApplicationsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'ALL') query.set('status', params.status);
  if (params?.programType && params.programType !== 'ALL')
    query.set('programType', params.programType);
  if (params?.programName) query.set('programName', params.programName);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const url = `${getApiUrl()}/admin/admission-applications${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch admission applications');
  }

  return res.json();
}

/**
 * Admin: Get single application details
 */
export async function getAdminAdmissionApplication(
  token: string,
  id: string
): Promise<AdmissionApplicationItem> {
  const url = `${getApiUrl()}/admin/admission-applications/${id}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch application details');
  }

  return res.json();
}

/**
 * Admin: Update status & optional notify applicant
 */
export async function updateAdminAdmissionStatus(
  token: string,
  id: string,
  payload: {
    status: AdmissionApplicationStatus;
    adminNotes?: string;
    notifyApplicant?: boolean;
    notificationMessage?: string;
  }
): Promise<AdmissionApplicationItem> {
  const url = `${getApiUrl()}/admin/admission-applications/${id}/status`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update application status');
  }

  return res.json();
}

/**
 * Admin: Update internal notes
 */
export async function updateAdminAdmissionNotes(
  token: string,
  id: string,
  notes: string
): Promise<AdmissionApplicationItem> {
  const url = `${getApiUrl()}/admin/admission-applications/${id}/notes`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notes }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update notes');
  }

  return res.json();
}

/**
 * Admin: Delete application
 */
export async function deleteAdminAdmissionApplication(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const url = `${getApiUrl()}/admin/admission-applications/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete application');
  }

  return res.json();
}
