const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  role: string | null;
  permissions: string[];
  createdAt: string;
  verifiedAt: string | null;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

/**
 * Fetch currently authenticated user's complete profile with permissions
 */
export async function fetchCurrentUserProfile(token: string): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }
  return data;
}

/**
 * Update current user's profile info (name, email)
 */
export async function updateCurrentUserProfile(
  token: string,
  payload: UpdateProfilePayload,
): Promise<UserProfileResponse> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile information");
  }
  return data;
}

/**
 * Change current user's password with current password verification
 */
export async function changeCurrentUserPassword(
  token: string,
  payload: ChangePasswordPayload,
): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE}/auth/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to change password");
  }
  return data;
}

/**
 * Logout currently authenticated user from backend (no permission/role requirement)
 */
export async function logoutUser(token?: string | null): Promise<{ message: string }> {
  try {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await res.json();
  } catch {
    return { message: "Logged out successfully." };
  }
}
