export type ContactInquiryStatus =
  | 'UNREAD'
  | 'READ'
  | 'REPLIED'
  | 'ARCHIVED';

export interface ContactInquiryItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: string;
  phoneNumber: string | null;
  organization: string;
  subject: string;
  message: string;
  status: ContactInquiryStatus;
  adminNotes: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInquiryPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneCode?: string;
  phoneNumber?: string;
  organization: string;
  subject: string;
  message: string;
}

export interface ContactInquiriesResponse {
  data: ContactInquiryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  stats: {
    total: number;
    unread: number;
    read: number;
    replied: number;
    archived: number;
  };
}

export interface ContactInquiriesQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Public: Submit a contact inquiry from the website.
 * Handles rate-limiting (HTTP 429) gracefully.
 */
export async function submitContactInquiry(
  payload: CreateContactInquiryPayload
): Promise<ContactInquiryItem> {
  const url = `${getApiUrl()}/contact-inquiries`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After');
      const waitMessage = retryAfter
        ? ` Please try again in ${retryAfter} seconds.`
        : ' Please wait a minute before submitting again.';
      throw new Error(
        `Too many submissions from your network.${waitMessage}`
      );
    }

    const errorData = await res.json().catch(() => ({}));
    const message =
      (Array.isArray(errorData.message)
        ? errorData.message.join(', ')
        : errorData.message) || `Failed to submit contact message (${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Admin: Get paginated list of inquiries with filter & stats
 */
export async function getAdminContactInquiries(
  token: string,
  params: ContactInquiriesQueryParams = {}
): Promise<ContactInquiriesResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.order) query.set('order', params.order);

  const url = `${getApiUrl()}/admin/contact-inquiries${
    query.toString() ? `?${query.toString()}` : ''
  }`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch inquiries (${res.status})`
    );
  }

  return res.json();
}

/**
 * Admin: Get single inquiry by id
 */
export async function getAdminContactInquiry(
  token: string,
  id: string
): Promise<ContactInquiryItem> {
  const url = `${getApiUrl()}/admin/contact-inquiries/${id}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to fetch inquiry details (${res.status})`
    );
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Admin: Update inquiry status and/or admin notes
 */
export async function updateAdminContactInquiry(
  token: string,
  id: string,
  payload: { status?: ContactInquiryStatus; adminNotes?: string }
): Promise<ContactInquiryItem> {
  const url = `${getApiUrl()}/admin/contact-inquiries/${id}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update inquiry (${res.status})`
    );
  }

  const json = await res.json();
  return json.data || json;
}

/**
 * Admin: Delete contact inquiry
 */
export async function deleteAdminContactInquiry(
  token: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  const url = `${getApiUrl()}/admin/contact-inquiries/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete inquiry (${res.status})`
    );
  }

  return res.json();
}
