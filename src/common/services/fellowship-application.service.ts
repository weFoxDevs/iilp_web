export interface ApplicationDocument {
  name: string;
  url: string;
  size?: number;
  mimetype?: string;
}

export type FellowshipApplicationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'ACCEPTED'
  | 'REJECTED';

export interface FellowshipApplicationItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phone: string;
  country: string;
  institution: string | null;
  degree: string;
  researchInterest: string | null;
  fellowshipType: string;
  statement: string;
  documents: ApplicationDocument[];
  status: FellowshipApplicationStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FellowshipApplicationsResponse {
  data: FellowshipApplicationItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    total: number;
    pending: number;
    underReview: number;
    accepted: number;
    rejected: number;
  };
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Public submission of a fellowship application with optional document attachments
 */
export async function submitFellowshipApplication(
  formData: FormData
): Promise<FellowshipApplicationItem> {
  const url = `${getApiUrl()}/fellowships/apply`;
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
        : 'Failed to submit fellowship application');
    throw new Error(message);
  }

  return res.json();
}

/**
 * Fetch all fellowship applications for admin portal
 */
export async function getAdminFellowshipApplications(
  token: string,
  params?: {
    search?: string;
    status?: string;
    fellowshipType?: string;
    page?: number;
    limit?: number;
  }
): Promise<FellowshipApplicationsResponse> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.status && params.status !== 'ALL') query.set('status', params.status);
  if (params?.fellowshipType && params.fellowshipType !== 'ALL')
    query.set('fellowshipType', params.fellowshipType);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const url = `${getApiUrl()}/admin/fellowship-applications${qs ? `?${qs}` : ''}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch fellowship applications');
  }

  return res.json();
}

/**
 * Fetch single fellowship application detail
 */
export async function getAdminFellowshipApplication(
  token: string,
  id: string
): Promise<FellowshipApplicationItem> {
  const url = `${getApiUrl()}/admin/fellowship-applications/${id}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch fellowship application');
  }

  return res.json();
}

/**
 * Update fellowship application review status and admin notes
 */
export async function updateFellowshipApplicationStatus(
  token: string,
  id: string,
  status: FellowshipApplicationStatus,
  adminNotes?: string
): Promise<FellowshipApplicationItem> {
  const url = `${getApiUrl()}/admin/fellowship-applications/${id}/status`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, adminNotes }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update application status');
  }

  return res.json();
}

/**
 * Delete fellowship application
 */
export async function deleteFellowshipApplication(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const url = `${getApiUrl()}/admin/fellowship-applications/${id}`;
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
