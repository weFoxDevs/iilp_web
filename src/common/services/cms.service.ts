export interface PageSectionData {
  id?: string;
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  bgImage?: string | null;
  bodyContent?: string | null;
  actionText?: string | null;
  actionUrl?: string | null;
  sectionKey?: string;
  metadata?: Record<string, unknown>;
  sortOrder?: number;
  isActive?: boolean;
}

export interface PageContentResponse {
  pageSlug: string;
  sections: Record<string, PageSectionData>;
}

export interface SiteMetricItem {
  id: string;
  label: string;
  value: string;
  suffix: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorTitle: string;
  institution: string;
  quote: string;
  avatarUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== PUBLIC METHODS ====================

export async function fetchPageContent(
  pageSlug: string
): Promise<PageContentResponse | null> {
  try {
    const res = await fetch(`${getApiUrl()}/pages/${encodeURIComponent(pageSlug)}/content`);
    if (!res.ok) {
      console.warn(`[CMS] Failed to fetch content for page: ${pageSlug} (${res.status})`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[CMS] Error fetching content for ${pageSlug}:`, err);
    return null;
  }
}

export async function fetchSiteMetrics(): Promise<SiteMetricItem[]> {
  try {
    const res = await fetch(`${getApiUrl()}/site/metrics`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('[CMS] Error fetching site metrics:', err);
    return [];
  }
}

export async function fetchSiteTestimonials(): Promise<TestimonialItem[]> {
  try {
    const res = await fetch(`${getApiUrl()}/site/testimonials`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.warn('[CMS] Error fetching testimonials:', err);
    return [];
  }
}

// ==================== ADMIN CMS METHODS ====================

const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export async function fetchAdminPageSlugs(token: string): Promise<string[]> {
  const res = await fetch(`${getApiUrl()}/admin/pages`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to load page list (${res.status})`);
  return res.json();
}

export async function fetchAdminSections(
  token: string,
  pageSlug: string
): Promise<PageSectionData[]> {
  const res = await fetch(
    `${getApiUrl()}/admin/pages/${encodeURIComponent(pageSlug)}/sections`,
    {
      headers: getAuthHeaders(token),
    }
  );
  if (!res.ok) throw new Error(`Failed to load sections for ${pageSlug} (${res.status})`);
  return res.json();
}

export async function seedAdminHomeSections(token: string): Promise<PageSectionData[]> {
  const res = await fetch(`${getApiUrl()}/admin/pages/seed-home`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to seed home sections (${res.status})`);
  return res.json();
}

export async function seedAdminLayoutSections(token: string): Promise<PageSectionData[]> {
  const res = await fetch(`${getApiUrl()}/admin/pages/seed-layout`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to seed layout sections (${res.status})`);
  return res.json();
}

export async function upsertAdminSection(
  token: string,
  pageSlug: string,
  sectionKey: string,
  data: Partial<PageSectionData>
): Promise<PageSectionData> {
  const res = await fetch(
    `${getApiUrl()}/admin/pages/${encodeURIComponent(pageSlug)}/sections/${encodeURIComponent(sectionKey)}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error(`Failed to save section ${sectionKey} (${res.status})`);
  return res.json();
}

export interface UploadMediaResult {
  url: string;
  path: string;
  originalname?: string;
  size?: number;
  mimetype?: string;
}

export async function uploadMediaFile(
  token: string,
  file: File,
  folder: string = 'pages'
): Promise<UploadMediaResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${getApiUrl()}/uploads?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `File upload failed with status ${res.status}`
    );
  }

  return res.json();
}

export async function uploadSectionImage(
  token: string,
  pageSlug: string,
  sectionKey: string,
  file: File
): Promise<{ success: boolean; url: string; path: string; section: PageSectionData }> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${getApiUrl()}/admin/pages/${encodeURIComponent(pageSlug)}/sections/${encodeURIComponent(sectionKey)}/image`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Section image upload failed with status ${res.status}`
    );
  }

  return res.json();
}

export async function deleteAdminSection(
  token: string,
  pageSlug: string,
  sectionKey: string
): Promise<boolean> {
  const res = await fetch(
    `${getApiUrl()}/admin/pages/${encodeURIComponent(pageSlug)}/sections/${encodeURIComponent(sectionKey)}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    }
  );
  return res.ok;
}

export async function fetchAdminMetrics(token: string): Promise<SiteMetricItem[]> {
  const res = await fetch(`${getApiUrl()}/admin/site/metrics`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to load admin metrics (${res.status})`);
  return res.json();
}

export async function createAdminMetric(
  token: string,
  data: Partial<SiteMetricItem>
): Promise<SiteMetricItem> {
  const res = await fetch(`${getApiUrl()}/admin/site/metrics`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create metric (${res.status})`);
  return res.json();
}

export async function updateAdminMetric(
  token: string,
  id: string,
  data: Partial<SiteMetricItem>
): Promise<SiteMetricItem> {
  const res = await fetch(`${getApiUrl()}/admin/site/metrics/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to update metric (${res.status})`);
  return res.json();
}

export async function deleteAdminMetric(token: string, id: string): Promise<boolean> {
  const res = await fetch(`${getApiUrl()}/admin/site/metrics/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  return res.ok;
}

export async function fetchAdminTestimonials(token: string): Promise<TestimonialItem[]> {
  const res = await fetch(`${getApiUrl()}/admin/site/testimonials`, {
    headers: getAuthHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to load admin testimonials (${res.status})`);
  return res.json();
}

export async function createAdminTestimonial(
  token: string,
  data: Partial<TestimonialItem>
): Promise<TestimonialItem> {
  const res = await fetch(`${getApiUrl()}/admin/site/testimonials`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create testimonial (${res.status})`);
  return res.json();
}

export async function updateAdminTestimonial(
  token: string,
  id: string,
  data: Partial<TestimonialItem>
): Promise<TestimonialItem> {
  const res = await fetch(
    `${getApiUrl()}/admin/site/testimonials/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    }
  );
  if (!res.ok) throw new Error(`Failed to update testimonial (${res.status})`);
  return res.json();
}

export async function deleteAdminTestimonial(token: string, id: string): Promise<boolean> {
  const res = await fetch(
    `${getApiUrl()}/admin/site/testimonials/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    }
  );
  return res.ok;
}
