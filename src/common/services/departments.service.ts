export interface DepartmentItem {
  id: string;
  number: string;
  name: string;
  code: string;
  slug: string;
  description: string;
  mission?: string | null;
  image?: string | null;
  hasActionButton: boolean;
  isHighlighted: boolean;
  isActive: boolean;
  sortOrder: number;
  researchAreas?: string[] | null;
  createdAt?: string;
  updatedAt?: string;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export async function fetchDepartments(params?: {
  limit?: number;
  activeOnly?: boolean;
}): Promise<DepartmentItem[]> {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.activeOnly !== undefined)
    query.set('activeOnly', String(params.activeOnly));

  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await fetch(`${getApiUrl()}/departments${qs}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch departments: ${res.statusText} (${res.status})`);
  }
  return res.json();
}

export async function fetchDepartmentByIdOrSlug(
  idOrSlug: string
): Promise<DepartmentItem> {
  const res = await fetch(`${getApiUrl()}/departments/${encodeURIComponent(idOrSlug)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch department: ${res.statusText} (${res.status})`);
  }
  return res.json();
}

export async function fetchAdminDepartments(token: string): Promise<DepartmentItem[]> {
  const res = await fetch(`${getApiUrl()}/departments`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch departments for admin (${res.status})`);
  }
  return res.json();
}

export async function createAdminDepartment(
  token: string,
  data: Partial<DepartmentItem>
): Promise<DepartmentItem> {
  const res = await fetch(`${getApiUrl()}/departments`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create department (${res.status})`);
  }
  return res.json();
}

export async function updateAdminDepartment(
  token: string,
  id: string,
  data: Partial<DepartmentItem>
): Promise<DepartmentItem> {
  const res = await fetch(`${getApiUrl()}/departments/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update department (${res.status})`);
  }
  return res.json();
}

export async function deleteAdminDepartment(
  token: string,
  id: string
): Promise<{ message: string }> {
  const res = await fetch(`${getApiUrl()}/departments/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete department (${res.status})`);
  }
  return res.json();
}
