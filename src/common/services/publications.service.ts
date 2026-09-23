export interface PublicationItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  field: string;
  publicationDate: string;
  description: string;
  authorName: string;
  authorRole: string;
  authorInitials: string;
  image: string;
  highlighted: boolean;
  overview?: string;
  purpose?: string;
  researchAreas?: string[];
  documentUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== PUBLIC API ====================

export async function fetchPublicPublications(params?: {
  category?: string;
  search?: string;
}): Promise<PublicationItem[]> {
  try {
    const url = new URL(`${getApiUrl()}/publications`);
    if (params?.category && params.category !== 'All Publications' && params.category !== 'All') {
      url.searchParams.append('category', params.category);
    }
    if (params?.search) {
      url.searchParams.append('search', params.search);
    }
    const res = await fetch(url.toString());
    if (!res.ok) {
      console.warn(`[Publications] Failed to fetch public publications: status ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[Publications] Network error while fetching publications:', err);
    return [];
  }
}

export async function fetchPublicPublicationByIdentifier(
  identifier: string
): Promise<PublicationItem | null> {
  try {
    const res = await fetch(
      `${getApiUrl()}/publications/${encodeURIComponent(identifier)}`
    );
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (err) {
    console.warn('[Publications] Network error fetching publication:', err);
    return null;
  }
}

// ==================== ADMIN API ====================

export async function fetchAdminPublications(
  token: string,
  params?: { category?: string; search?: string }
): Promise<PublicationItem[]> {
  const url = new URL(`${getApiUrl()}/admin/publications`);
  if (params?.category && params.category !== 'All Publications' && params.category !== 'All') {
    url.searchParams.append('category', params.category);
  }
  if (params?.search) {
    url.searchParams.append('search', params.search);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch publications (${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createAdminPublication(
  token: string,
  data: Partial<PublicationItem>
): Promise<PublicationItem> {
  const res = await fetch(`${getApiUrl()}/admin/publications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create publication (${res.status})`);
  }
  return res.json();
}

export async function updateAdminPublication(
  token: string,
  id: string,
  data: Partial<PublicationItem>
): Promise<PublicationItem> {
  const res = await fetch(`${getApiUrl()}/admin/publications/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update publication (${res.status})`);
  }
  return res.json();
}

export async function deleteAdminPublication(
  token: string,
  id: string
): Promise<{ message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/publications/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete publication (${res.status})`);
  }
  return res.json();
}

export async function reorderAdminPublications(
  token: string,
  orderedIds: string[]
): Promise<{ message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/publications/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to reorder publications (${res.status})`);
  }
  return res.json();
}
