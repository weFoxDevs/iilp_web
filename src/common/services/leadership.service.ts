export interface LeadershipMemberItem {
  id: string;
  name: string;
  role: string;
  type?: string;
  initials?: string;
  image: string;
  about?: string;
  accountabilityFunctions?: string[];
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeadershipTypeConfig {
  id: string; // e.g. 'founding-authority'
  title: string; // e.g. 'Founding Authority'
  subtitle: string; // Brief description
  badge: string; // E.g. 'GOVERNANCE BODY'
  detailedCharter: string;
  bgImage?: string;
}

export const LEADERSHIP_TYPES: LeadershipTypeConfig[] = [
  {
    id: 'founding-authority',
    title: 'Founding Authority',
    subtitle: 'Founder & President — visionary and strategic authority',
    badge: 'Founding Office',
    detailedCharter:
      'The Founding Authority provides highest visionary guidance, foundational values, and strategic governance to the International Institute for Law and Politics (IILP), safeguarding its long-term integrity, academic freedom, and institutional trajectory.',
    bgImage: '/assets/about-hero-bg.png',
  },
  {
    id: 'founding-members',
    title: 'Board of Founding Members',
    subtitle: 'Foundational stewardship and institutional legacy',
    badge: 'Founding Board',
    detailedCharter:
      'The Board of Founding Members serves as the cornerstone of the Institute, contributing institutional oversight, ethics, and sustained advisory to guarantee fidelity to our global founding mission.',
    bgImage: '/assets/about-hero-bg.png',
  },
  {
    id: 'governing-council',
    title: 'Governing Council',
    subtitle: 'Highest governing and decision-making body',
    badge: 'Governing Council',
    detailedCharter:
      'The Governing Council functions as the supreme policymaking and fiduciary council of the Institute, formulating institutional policy, approving appointments, and steering systemic development.',
    bgImage: '/assets/about-hero-bg.png',
  },
  {
    id: 'executive-directorate',
    title: 'Executive Directorate Board',
    subtitle: 'Operational leadership and program delivery',
    badge: 'Executive Directorate',
    detailedCharter:
      'The Executive Directorate Board executes programmatic strategies, directs operational divisions, manages daily administrative functions, and delivers academic agendas across regional centers.',
    bgImage: '/assets/about-hero-bg.png',
  },
  {
    id: 'academic-leadership',
    title: 'Academic Leadership',
    subtitle: 'Departmental deans, faculty heads, and distinguished faculty',
    badge: 'Academic Leadership',
    detailedCharter:
      'The Academic Leadership encompasses departmental chairs, faculty heads, and distinguished scholars directing academic programs, curriculum excellence, and research endeavors across the Institute.',
    bgImage: '/assets/department-details-hero.png',
  },
  {
    id: 'academic-senate',
    title: 'Academic Senate',
    subtitle: 'Principal academic and intellectual authority',
    badge: 'Academic Senate',
    detailedCharter:
      'The Academic Senate oversees curriculum integrity, research ethics, faculty appointments, peer-reviewed standards, and scholarly publications across all academic disciplines.',
    bgImage: '/assets/department-details-hero.png',
  },
  {
    id: 'ict-media-cell',
    title: 'ICT & Media Cell',
    subtitle: 'Digital presence, media and communications',
    badge: 'Digital Directorate',
    detailedCharter:
      'The ICT & Media Cell leads digital platforms, public communications, open-access knowledge repositories, technological infrastructure, and strategic media outreach globally.',
    bgImage: '/assets/department-details-hero.png',
  },
  {
    id: 'advisory-board',
    title: 'Advisory Board',
    subtitle: 'External strategic and intellectual guidance',
    badge: 'International Advisory',
    detailedCharter:
      'The Advisory Board convenes distinguished jurists, policymakers, international advocates, and diplomats who advise the Institute on transnational initiatives, partnerships, and global challenges.',
    bgImage: '/assets/about-hero-bg.png',
  },
  {
    id: 'global-fellowship-network',
    title: 'Global Fellowship Network',
    subtitle: 'International scholarly and research community',
    badge: 'Fellowship Network',
    detailedCharter:
      'The Global Fellowship Network connects resident and visiting researchers, post-doctoral scholars, and practitioners contributing groundbreaking research in law, justice, and politics.',
    bgImage: '/assets/about-hero-bg.png',
  },
  {
    id: 'ethics-commission',
    title: 'Ethics & Accountability Commission',
    subtitle: 'Institutional integrity and ethical governance',
    badge: 'Integrity Commission',
    detailedCharter:
      'The Ethics & Accountability Commission ensures full institutional transparency, investigates compliance matters, and establishes rigorous conflict-of-interest standards.',
    bgImage: '/assets/department-details-hero.png',
  },
  {
    id: 'youth-leadership-assembly',
    title: 'Youth Leadership Assembly',
    subtitle: 'Youth participation and leadership development',
    badge: 'Youth Assembly',
    detailedCharter:
      'The Youth Leadership Assembly empowers emerging advocates, student leaders, and young scholars to lead dialogue, formulate policy recommendations, and foster civic leadership.',
    bgImage: '/assets/department-details-hero.png',
  },
  {
    id: 'members-respectively',
    title: 'Members Respectively',
    subtitle: 'Institutional members and designated representatives',
    badge: 'Members Respectively',
    detailedCharter:
      'Members Respectively comprises distinguished institutional members, fellows, and delegates serving in their respective capacities to advance the mission, governance, and academic programs of the International Institute for Law and Politics (IILP).',
    bgImage: '/assets/department-details-hero.png',
  },
];

export function getLeadershipTypeConfig(slugOrId?: string): LeadershipTypeConfig {
  if (!slugOrId) return LEADERSHIP_TYPES[1]; // default founding-members
  const clean = slugOrId.toLowerCase().trim();
  const found = LEADERSHIP_TYPES.find(
    (t) =>
      t.id === clean ||
      createSlugFromName(t.title) === clean ||
      t.title.toLowerCase() === clean
  );
  if (found) return found;

  return {
    id: clean,
    title: slugOrId
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    subtitle: 'Institutional Leadership and Governance Body',
    badge: 'Governance Tier',
    detailedCharter:
      'Committed to advancing the strategic vision, scholarly integrity, and institutional mission of the International Institute for Law and Politics (IILP).',
    bgImage: '/assets/about-hero-bg.png',
  };
}

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export function createSlugFromName(name: string): string {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface FetchLeadershipOptions {
  type?: string;
  limit?: number;
  page?: number;
  offset?: number;
}

export interface LeadershipPaginationMeta {
  total: number;
  page: number;
  limit: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  next: number | null;
  prev: number | null;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedLeadershipResponse {
  data: LeadershipMemberItem[];
  items?: LeadershipMemberItem[];
  meta: LeadershipPaginationMeta;
  total: number;
  page: number;
  limit: number;
  perPage: number;
  totalPages: number;
  next: number | null;
  prev: number | null;
}

export type LeadershipMemberList = LeadershipMemberItem[] & {
  meta?: LeadershipPaginationMeta;
  total?: number;
  page?: number;
  limit?: number;
  perPage?: number;
  totalPages?: number;
  next?: number | null;
  prev?: number | null;
};

export async function fetchPublicLeadershipMembers(
  typeOrOptions?: string | FetchLeadershipOptions,
  options?: { limit?: number; page?: number; offset?: number }
): Promise<LeadershipMemberList> {
  try {
    let type: string | undefined;
    let limit: number | undefined;
    let page: number | undefined;
    let offset: number | undefined;

    if (typeof typeOrOptions === 'string') {
      type = typeOrOptions;
      limit = options?.limit;
      page = options?.page;
      offset = options?.offset;
    } else if (typeOrOptions && typeof typeOrOptions === 'object') {
      type = typeOrOptions.type;
      limit = typeOrOptions.limit;
      page = typeOrOptions.page;
      offset = typeOrOptions.offset;
    }

    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    if (limit !== undefined && limit > 0) params.append('limit', String(limit));
    if (page !== undefined && page > 0) params.append('page', String(page));
    if (offset !== undefined && offset >= 0) params.append('offset', String(offset));

    const qs = params.toString();
    const url = qs ? `${getApiUrl()}/leadership?${qs}` : `${getApiUrl()}/leadership`;

    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[Leadership] Failed to fetch public members: status ${res.status}`);
      return [] as LeadershipMemberList;
    }
    const json = await res.json();
    let items: LeadershipMemberItem[] = [];
    let meta: LeadershipPaginationMeta | undefined = undefined;

    if (Array.isArray(json)) {
      items = json;
    } else if (json && typeof json === 'object') {
      if (Array.isArray(json.data)) {
        items = json.data;
      } else if (Array.isArray(json.items)) {
        items = json.items;
      }
      if (json.meta) {
        meta = json.meta;
      } else if (json.total !== undefined) {
        const total = Number(json.total) || 0;
        const curPage = Number(json.page) || 1;
        const perPage = Number(json.perPage || json.limit) || items.length || 1;
        const totalPages = Number(json.totalPages) || Math.max(1, Math.ceil(total / perPage));
        meta = {
          total,
          page: curPage,
          limit: perPage,
          perPage,
          totalPages,
          hasNextPage: curPage < totalPages,
          hasPrevPage: curPage > 1,
          next: curPage < totalPages ? curPage + 1 : null,
          prev: curPage > 1 ? curPage - 1 : null,
          nextPage: curPage < totalPages ? curPage + 1 : null,
          prevPage: curPage > 1 ? curPage - 1 : null,
        };
      }
    }

    const result = [...items] as LeadershipMemberList;
    if (meta) {
      result.meta = meta;
      result.total = meta.total;
      result.page = meta.page;
      result.limit = meta.limit;
      result.perPage = meta.perPage;
      result.totalPages = meta.totalPages;
      result.next = meta.next;
      result.prev = meta.prev;
    }
    return result;
  } catch (err) {
    console.warn('[Leadership] Network error while fetching public leadership members:', err);
    return [] as LeadershipMemberList;
  }
}

export async function fetchLeadershipMemberByIdOrSlug(
  identifier: string
): Promise<LeadershipMemberItem | null> {
  if (!identifier) return null;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  if (isUuid) {
    try {
      const res = await fetch(`${getApiUrl()}/leadership/${identifier}`);
      if (res.ok) {
        const item = await res.json();
        if (item && item.id) return item;
        if (item && item.data && item.data.id) return item.data;
      }
    } catch (err) {
      console.warn(`[Leadership] Failed to fetch by ID ${identifier}:`, err);
    }
    return null;
  }

  // Fallback or search by slug/name across public members ONLY when not a UUID
  const allMembers = await fetchPublicLeadershipMembers();
  const cleanTarget = identifier.toLowerCase().trim();

  const found = allMembers.find((m) => {
    if (m.id && m.id.toLowerCase() === cleanTarget) return true;
    if (m.name && createSlugFromName(m.name) === cleanTarget) return true;
    if (m.name && m.name.toLowerCase().trim() === cleanTarget) return true;
    return false;
  });

  return found || null;
}

// ==================== ADMIN API ====================

export async function fetchAdminLeadershipMembers(
  token: string,
  typeOrOptions?: string | FetchLeadershipOptions,
  options?: { limit?: number; page?: number; offset?: number }
): Promise<LeadershipMemberList> {
  let type: string | undefined;
  let limit: number | undefined;
  let page: number | undefined;
  let offset: number | undefined;

  if (typeof typeOrOptions === 'string') {
    type = typeOrOptions;
    limit = options?.limit;
    page = options?.page;
    offset = options?.offset;
  } else if (typeOrOptions && typeof typeOrOptions === 'object') {
    type = typeOrOptions.type;
    limit = typeOrOptions.limit;
    page = typeOrOptions.page;
    offset = typeOrOptions.offset;
  }

  const params = new URLSearchParams();
  if (type && type !== 'all') params.append('type', type);
  if (limit !== undefined && limit > 0) params.append('limit', String(limit));
  if (page !== undefined && page > 0) params.append('page', String(page));
  if (offset !== undefined && offset >= 0) params.append('offset', String(offset));

  const qs = params.toString();
  const url = qs ? `${getApiUrl()}/admin/leadership?${qs}` : `${getApiUrl()}/admin/leadership`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch leadership members (${res.status})`);
  }
  const json = await res.json();
  let items: LeadershipMemberItem[] = [];
  let meta: LeadershipPaginationMeta | undefined = undefined;

  if (Array.isArray(json)) {
    items = json;
  } else if (json && typeof json === 'object') {
    if (Array.isArray(json.data)) {
      items = json.data;
    } else if (Array.isArray(json.items)) {
      items = json.items;
    }
    if (json.meta) {
      meta = json.meta;
    } else if (json.total !== undefined) {
      const total = Number(json.total) || 0;
      const curPage = Number(json.page) || 1;
      const perPage = Number(json.perPage || json.limit) || items.length || 1;
      const totalPages = Number(json.totalPages) || Math.max(1, Math.ceil(total / perPage));
      meta = {
        total,
        page: curPage,
        limit: perPage,
        perPage,
        totalPages,
        hasNextPage: curPage < totalPages,
        hasPrevPage: curPage > 1,
        next: curPage < totalPages ? curPage + 1 : null,
        prev: curPage > 1 ? curPage - 1 : null,
        nextPage: curPage < totalPages ? curPage + 1 : null,
        prevPage: curPage > 1 ? curPage - 1 : null,
      };
    }
  }

  const result = [...items] as LeadershipMemberList;
  if (meta) {
    result.meta = meta;
    result.total = meta.total;
    result.page = meta.page;
    result.limit = meta.limit;
    result.perPage = meta.perPage;
    result.totalPages = meta.totalPages;
    result.next = meta.next;
    result.prev = meta.prev;
  }
  return result;
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
