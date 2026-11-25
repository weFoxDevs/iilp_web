export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  tags: string[];
  summary: string;
  content: string;
  featuredImage?: string | null;
  authorName?: string | null;
  authorRole?: string | null;
  publishedDate: string;
  readTimeMinutes: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isHighlighted: boolean;
  sortOrder: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  related?: BlogPostItem[];
}

export interface PaginatedBlogsResponse {
  items: BlogPostItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories?: string[];
}

export interface FeaturedBlogResponse {
  featured: BlogPostItem | null;
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// ==================== PUBLIC METHODS ====================

export async function fetchPublicBlogs(params: {
  category?: string;
  tag?: string;
  exclude?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedBlogsResponse | null> {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.tag) query.set('tag', params.tag);
    if (params.exclude) query.set('exclude', params.exclude);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${getApiUrl()}/blogs?${query.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[Blogs] Error fetching public blogs:', err);
    return null;
  }
}

export async function fetchFeaturedBlog(exclude?: string): Promise<FeaturedBlogResponse | null> {
  try {
    const qs = exclude ? `?exclude=${encodeURIComponent(exclude)}` : '';
    const res = await fetch(`${getApiUrl()}/blogs/featured${qs}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error('[Blogs] Error fetching featured blog:', err);
    return null;
  }
}

export async function fetchPublicBlogBySlug(slugOrId: string): Promise<BlogPostItem | null> {
  try {
    const res = await fetch(`${getApiUrl()}/blogs/${encodeURIComponent(slugOrId)}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`[Blogs] Error fetching blog '${slugOrId}':`, err);
    return null;
  }
}

// ==================== ADMIN METHODS ====================

export async function fetchAdminBlogs(
  token: string,
  params: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {},
): Promise<PaginatedBlogsResponse> {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.set('category', params.category);
  if (params.status && params.status !== 'ALL') query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${getApiUrl()}/admin/blogs?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch blog posts (${res.status})`);
  }
  return await res.json();
}

export async function createAdminBlog(
  token: string,
  data: Partial<BlogPostItem>,
): Promise<BlogPostItem> {
  const res = await fetch(`${getApiUrl()}/admin/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create blog post (${res.status})`);
  }
  return await res.json();
}

export async function updateAdminBlog(
  token: string,
  id: string,
  data: Partial<BlogPostItem>,
): Promise<BlogPostItem> {
  const res = await fetch(`${getApiUrl()}/admin/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update blog post (${res.status})`);
  }
  return await res.json();
}

export async function deleteAdminBlog(token: string, id: string): Promise<void> {
  const res = await fetch(`${getApiUrl()}/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to delete blog post (${res.status})`);
  }
}
