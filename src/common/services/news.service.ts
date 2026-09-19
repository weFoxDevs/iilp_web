export interface NewsArticleItem {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  summary: string;
  content: string;
  featuredImage: string;
  publishedDate: string;
  readTimeMinutes: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isHighlighted: boolean;
  sortOrder: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  prev?: { slug: string; title: string } | null;
}

export interface HomeNewsResponse {
  featured: NewsArticleItem | null;
  articles: NewsArticleItem[];
  tabs: string[];
}

export interface PaginatedNewsResponse {
  items: NewsArticleItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  tabs: string[];
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== PUBLIC METHODS ====================

export async function fetchHomeNews(): Promise<HomeNewsResponse | null> {
  try {
    const res = await fetch(`${getApiUrl()}/news/featured-home`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.warn(`[News] Failed to fetch home news (${res.status})`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error('[News] Error fetching home news:', err);
    return null;
  }
}

export async function fetchNewsArticles(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedNewsResponse | null> {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${getApiUrl()}/news?${query.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[News] Error fetching articles:', err);
    return null;
  }
}

export async function fetchNewsArticleBySlug(slug: string): Promise<NewsArticleItem | null> {
  try {
    const res = await fetch(`${getApiUrl()}/news/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`[News] Error fetching article '${slug}':`, err);
    return null;
  }
}

// ==================== ADMIN METHODS ====================

export async function fetchAdminNews(
  token: string,
  params: { category?: string; search?: string; page?: number; limit?: number } = {},
): Promise<PaginatedNewsResponse> {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${getApiUrl()}/admin/news?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch admin news articles (${res.status})`);
  }
  return await res.json();
}

export async function createAdminNews(
  token: string,
  data: Partial<NewsArticleItem>,
): Promise<NewsArticleItem> {
  const res = await fetch(`${getApiUrl()}/admin/news`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create news article (${res.status})`);
  }
  return await res.json();
}

export async function updateAdminNews(
  token: string,
  id: string,
  data: Partial<NewsArticleItem>,
): Promise<NewsArticleItem> {
  const res = await fetch(`${getApiUrl()}/admin/news/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update news article (${res.status})`);
  }
  return await res.json();
}

export async function deleteAdminNews(
  token: string,
  id: string,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${getApiUrl()}/admin/news/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete news article (${res.status})`);
  }
  return await res.json();
}

export async function seedAdminNews(
  token: string,
): Promise<{ success: boolean; count: number; items: NewsArticleItem[] }> {
  const res = await fetch(`${getApiUrl()}/admin/news/seed`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to seed news articles (${res.status})`);
  }
  return await res.json();
}
