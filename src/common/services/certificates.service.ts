export interface CertificateData {
  id: string;
  regNo: string;
  recipientName: string;
  certificateTitle: string;
  programName: string;
  issueDate: string;
  startDate?: string;
  endDate?: string;
  natureOfProgram: string;
  authorizedSignatory?: string;
  certificateFileUrl?: string;
  certificateFileOriginalName?: string;
  certificateFileSize?: number;
  status: 'VALID' | 'REVOKED' | 'EXPIRED';
  remarks?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CertificatesListResponse {
  items: CertificateData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    total: number;
    valid: number;
    revoked: number;
    expired: number;
  };
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Public Verification
 */
export async function verifyCertificate(regNo: string): Promise<CertificateData> {
  const cleanRegNo = regNo.trim();
  const res = await fetch(`${getApiUrl()}/certificates/verify/${encodeURIComponent(cleanRegNo)}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'No certificate found matching the provided Registration Number.');
  }

  return data;
}

/**
 * Admin: List Certificates
 */
export async function fetchCertificatesAdmin(
  token: string,
  params?: { search?: string; status?: string; page?: number; limit?: number }
): Promise<CertificatesListResponse> {
  const url = new URL(`${getApiUrl()}/admin/certificates`);
  if (params?.search) url.searchParams.set('search', params.search);
  if (params?.status) url.searchParams.set('status', params.status);
  if (params?.page) url.searchParams.set('page', String(params.page));
  if (params?.limit) url.searchParams.set('limit', String(params.limit));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch certificates');
  }

  return res.json();
}

/**
 * Admin: Create Certificate
 */
export async function createCertificateAdmin(
  token: string,
  formData: FormData
): Promise<CertificateData> {
  const res = await fetch(`${getApiUrl()}/admin/certificates`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to create certificate');
  }

  return data;
}

/**
 * Admin: Update Certificate
 */
export async function updateCertificateAdmin(
  token: string,
  id: string,
  formData: FormData
): Promise<CertificateData> {
  const res = await fetch(`${getApiUrl()}/admin/certificates/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to update certificate');
  }

  return data;
}

/**
 * Admin: Delete Certificate
 */
export async function deleteCertificateAdmin(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/certificates/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete certificate');
  }

  return data;
}
