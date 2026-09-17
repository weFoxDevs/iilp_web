import { EventItem, EventMode, EventCategory, EventVenue, RegistrationFormData } from '@/modules/events/types';

export interface ApiEventVenue {
  id?: string;
  name: string;
  type: 'campus' | 'online';
  address?: string | null;
  capacity?: number | null;
  onlineUrl?: string | null;
  sortOrder?: number;
}

export interface ApiEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortSummary?: string | null;
  category: string;
  mode: 'HYBRID' | 'ONLINE' | 'ONSITE' | 'CAMPUS' | 'Hybrid' | 'Online' | 'Onsite' | 'Campus';
  startDate: string;
  endDate?: string | null;
  startTime: string;
  endTime?: string | null;
  seatsCapacity: number;
  seatsReserved: number;
  isRegistrationOpen: boolean;
  bannerImage?: string | null;
  imageUrl?: string | null;
  status: string;
  isHighlighted?: boolean;
  sortOrder?: number;
  totalRegistrations?: number;
  venues: ApiEventVenue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEventRegistration {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  organization?: string | null;
  country?: string | null;
  registrationStatus: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
  createdAt: string;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

const monthNames = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
];

export function transformApiEventToEventItem(apiEvent: ApiEvent): EventItem {
  let month = 'OCT';
  let day = '15';
  let fullDate = apiEvent.startDate || 'October 15, 2026';

  if (apiEvent.startDate) {
    try {
      const d = new Date(apiEvent.startDate);
      if (!isNaN(d.getTime())) {
        month = monthNames[d.getUTCMonth()];
        day = String(d.getUTCDate()).padStart(2, '0');
        const monthFull = d.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
        fullDate = `${monthFull} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
      }
    } catch {
      // fallback
    }
  }

  // Normalize mode to TitleCase ("Hybrid" | "Online" | "Onsite")
  const rawMode = (apiEvent.mode || 'Hybrid').toUpperCase();
  const normalizedMode: EventMode =
    rawMode === 'ONLINE' ? 'Online' : rawMode === 'ONSITE' ? 'Onsite' : 'Hybrid';

  // Normalize category
  const rawCat = apiEvent.category || 'Conferences';
  const categoryMap: Record<string, Exclude<EventCategory, 'All'>> = {
    CONFERENCES: 'Conferences',
    SEMINARS: 'Seminars',
    WORKSHOPS: 'Workshops',
    WEBINARS: 'Webinars',
    POLICY_DIALOGUES: 'Policy Dialogues',
  };
  const normalizedCat =
    categoryMap[rawCat.toUpperCase()] ||
    (rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase() as Exclude<EventCategory, 'All'>);

  const venues: EventVenue[] = (apiEvent.venues || []).map((v) => ({
    name: v.name,
    type: v.type === 'online' ? 'online' : 'campus',
  }));

  const seatsLeft = Math.max(0, (apiEvent.seatsCapacity || 0) - (apiEvent.seatsReserved || 0));
  const seats =
    apiEvent.seatsCapacity > 0
      ? `${seatsLeft} of ${apiEvent.seatsCapacity} Left`
      : 'Open Registration';

  const time = apiEvent.endTime
    ? `${apiEvent.startTime} - ${apiEvent.endTime}`
    : apiEvent.startTime || '9:00 AM - 5:00 PM EST';

  return {
    id: apiEvent.slug || apiEvent.id,
    title: apiEvent.title,
    description: apiEvent.description,
    month,
    day,
    fullDate,
    time,
    seats,
    mode: normalizedMode,
    category: normalizedCat,
    venues: venues.length > 0 ? venues : [{ name: 'IILP Global Hub', type: 'campus' }],
    image: apiEvent.imageUrl || '/images/events/default-event.jpg',
    isPopular: apiEvent.isHighlighted,
  };
}

// ==================== PUBLIC API ====================

export async function fetchPublicEvents(params?: {
  category?: string;
  mode?: string;
  upcoming?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ items: ApiEvent[]; total: number; page: number; limit: number } | null> {
  try {
    const url = new URL(`${getApiUrl()}/events`);
    if (params?.category && params.category !== 'All') {
      const catVal = params.category.toUpperCase().replace(/\s+/g, '_');
      url.searchParams.set('category', catVal);
    }
    if (params?.mode) {
      url.searchParams.set('mode', params.mode.toUpperCase());
    }
    if (params?.upcoming !== undefined) {
      url.searchParams.set('upcoming', String(params.upcoming));
    }
    if (params?.page) {
      url.searchParams.set('page', String(params.page));
    }
    if (params?.limit) {
      url.searchParams.set('limit', String(params.limit));
    }
    if (params?.search) {
      url.searchParams.set('search', params.search);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.warn(`[EventsService] fetchPublicEvents failed: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('[EventsService] Error fetching public events:', err);
    return null;
  }
}

export async function fetchPublicEventBySlug(slugOrId: string): Promise<ApiEvent | null> {
  try {
    const res = await fetch(`${getApiUrl()}/events/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) {
      console.warn(`[EventsService] fetchPublicEventBySlug failed: ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[EventsService] Error fetching event ${slugOrId}:`, err);
    return null;
  }
}

export async function submitEventRegistration(
  eventId: string,
  formData: RegistrationFormData
): Promise<{ success: boolean; data?: ApiEventRegistration; message?: string }> {
  try {
    const res = await fetch(`${getApiUrl()}/events/${encodeURIComponent(eventId)}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result.message || 'Registration failed. Please try again.',
      };
    }
    return { success: true, data: result };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error occurred during registration.',
    };
  }
}

// ==================== ADMIN API ====================

export async function fetchAdminEvents(
  token: string,
  params?: {
    category?: string;
    mode?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<{ items: ApiEvent[]; total: number; page: number; limit: number; totalPages: number }> {
  const url = new URL(`${getApiUrl()}/admin/events`);
  if (params?.category && params.category !== 'All') {
    url.searchParams.set('category', params.category.toUpperCase().replace(/\s+/g, '_'));
  }
  if (params?.mode && params.mode !== 'ALL') {
    url.searchParams.set('mode', params.mode.toUpperCase());
  }
  if (params?.status && params.status !== 'ALL') {
    url.searchParams.set('status', params.status);
  }
  if (params?.search) {
    url.searchParams.set('search', params.search);
  }
  if (params?.page) {
    url.searchParams.set('page', String(params.page));
  }
  if (params?.limit) {
    url.searchParams.set('limit', String(params.limit));
  }

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to load admin events (${res.status})`);
  return res.json();
}

export async function fetchAdminEventById(token: string, id: string): Promise<ApiEvent> {
  const res = await fetch(`${getApiUrl()}/admin/events/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to load event details (${res.status})`);
  return res.json();
}

export async function createAdminEvent(
  token: string,
  data: Partial<ApiEvent> & { venues?: ApiEventVenue[] }
): Promise<ApiEvent> {
  const res = await fetch(`${getApiUrl()}/admin/events`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create event (${res.status})`);
  }
  return res.json();
}

export async function updateAdminEvent(
  token: string,
  id: string,
  data: Partial<ApiEvent> & { venues?: ApiEventVenue[] }
): Promise<ApiEvent> {
  const res = await fetch(`${getApiUrl()}/admin/events/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update event (${res.status})`);
  }
  return res.json();
}

export async function deleteAdminEvent(token: string, id: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/admin/events/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to delete event (${res.status})`);
}

export async function fetchEventRegistrations(
  token: string,
  eventId: string,
  status?: string
): Promise<ApiEventRegistration[]> {
  const url = new URL(`${getApiUrl()}/admin/events/${encodeURIComponent(eventId)}/registrations`);
  if (status && status !== 'ALL') {
    url.searchParams.set('status', status);
  }

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to fetch event registrations (${res.status})`);
  const data = await res.json();
  if (Array.isArray(data)) {
    return data;
  }
  if (data && Array.isArray(data.registrations)) {
    return data.registrations;
  }
  if (data && Array.isArray(data.items)) {
    return data.items;
  }
  return [];
}

export async function downloadEventRegistrationsCsv(token: string, eventId: string, eventTitle = 'attendees'): Promise<void> {
  const url = `${getApiUrl()}/admin/events/${encodeURIComponent(eventId)}/registrations?format=csv`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to export registrations CSV (${res.status})`);

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  const safeFilename = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
  a.download = `${safeFilename}_registrations.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

export async function updateRegistrationStatus(
  token: string,
  registrationId: string,
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED'
): Promise<ApiEventRegistration> {
  const res = await fetch(
    `${getApiUrl()}/admin/events/registrations/${encodeURIComponent(registrationId)}/status`,
    {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    }
  );
  if (!res.ok) throw new Error(`Failed to update registration status (${res.status})`);
  return res.json();
}
