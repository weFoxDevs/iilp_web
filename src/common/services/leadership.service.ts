export interface LeadershipMemberItem {
  id: string;
  name: string;
  role: string;
  initials?: string;
  image: string;
  about?: string;
  accountabilityFunctions?: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== PUBLIC API ====================

export async function fetchPublicLeadershipMembers(): Promise<LeadershipMemberItem[]> {
  try {
    const res = await fetch(`${getApiUrl()}/leadership`);
    if (!res.ok) {
      console.warn(`[Leadership] Failed to fetch public members: status ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[Leadership] Network error while fetching public leadership members:', err);
    return [];
  }
}

// ==================== ADMIN API ====================

export async function fetchAdminLeadershipMembers(token: string): Promise<LeadershipMemberItem[]> {
  const res = await fetch(`${getApiUrl()}/admin/leadership`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch leadership members (${res.status})`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createAdminLeadershipMember(
  token: string,
  data: Partial<LeadershipMemberItem>
): Promise<LeadershipMemberItem> {
  const res = await fetch(`${getApiUrl()}/admin/leadership`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create leadership member (${res.status})`);
  }
  return res.json();
}

export async function updateAdminLeadershipMember(
  token: string,
  id: string,
  data: Partial<LeadershipMemberItem>
): Promise<LeadershipMemberItem> {
  const res = await fetch(`${getApiUrl()}/admin/leadership/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update leadership member (${res.status})`);
  }
  return res.json();
}

export async function deleteAdminLeadershipMember(
  token: string,
  id: string
): Promise<{ message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/leadership/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete leadership member (${res.status})`);
  }
  return res.json();
}

export async function reorderAdminLeadershipMembers(
  token: string,
  orderedIds: string[]
): Promise<{ message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/leadership/reorder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to reorder leadership members (${res.status})`);
  }
  return res.json();
}
