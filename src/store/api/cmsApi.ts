import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  PageContentResponse,
  SiteMetricItem,
  TestimonialItem,
} from '@/common/services/cms.service';
import type { DepartmentItem } from '@/common/services/departments.service';
import type { LeadershipMemberItem } from '@/common/services/leadership.service';
import type { HomeNewsResponse, PaginatedNewsResponse, NewsArticleItem } from '@/common/services/news.service';

const getApiUrl = () =>
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const cmsApi = createApi({
  reducerPath: 'cmsApi',
  baseQuery: fetchBaseQuery({ baseUrl: getApiUrl() }),
  keepUnusedDataFor: 300, // cache 5 minutes
  tagTypes: ['PageContent', 'SiteMetrics', 'Testimonials', 'Departments', 'Leadership', 'News'],
  endpoints: (builder) => ({
    // ── Pages / CMS ──────────────────────────────────────────────────
    getPageContent: builder.query<PageContentResponse, string>({
      query: (pageSlug) => `/pages/${encodeURIComponent(pageSlug)}/content`,
      transformErrorResponse: () => null,
      providesTags: (_result, _err, slug) => [{ type: 'PageContent', id: slug }],
    }),

    getSiteMetrics: builder.query<SiteMetricItem[], void>({
      query: () => '/site/metrics',
      providesTags: ['SiteMetrics'],
    }),

    getSiteTestimonials: builder.query<TestimonialItem[], void>({
      query: () => '/site/testimonials',
      providesTags: ['Testimonials'],
    }),

    // ── Departments ───────────────────────────────────────────────────
    getDepartments: builder.query<DepartmentItem[], { activeOnly?: boolean; limit?: number }>({
      query: ({ activeOnly, limit } = {}) => {
        const params = new URLSearchParams();
        if (activeOnly !== undefined) params.set('activeOnly', String(activeOnly));
        if (limit !== undefined) params.set('limit', String(limit));
        const qs = params.toString();
        return `/departments${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Departments'],
    }),

    getDepartmentBySlug: builder.query<DepartmentItem, string>({
      query: (slug) => `/departments/${encodeURIComponent(slug)}`,
      providesTags: (_result, _err, slug) => [{ type: 'Departments', id: slug }],
    }),

    // ── Leadership ────────────────────────────────────────────────────
    getLeadershipMembers: builder.query<LeadershipMemberItem[], { limit?: number; page?: number }>({
      query: ({ limit, page } = {}) => {
        const params = new URLSearchParams();
        if (limit !== undefined) params.set('limit', String(limit));
        if (page !== undefined) params.set('page', String(page));
        const qs = params.toString();
        return `/leadership${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Leadership'],
    }),

    // ── News ──────────────────────────────────────────────────────────
    getHomeNews: builder.query<HomeNewsResponse, void>({
      query: () => '/news/featured-home',
      providesTags: ['News'],
    }),

    getNewsArticles: builder.query<
      PaginatedNewsResponse,
      { category?: string; search?: string; page?: number; limit?: number }
    >({
      query: ({ category, search, page, limit } = {}) => {
        const params = new URLSearchParams();
        if (category && category !== 'All') params.set('category', category);
        if (search) params.set('search', search);
        if (page) params.set('page', String(page));
        if (limit) params.set('limit', String(limit));
        return `/news?${params.toString()}`;
      },
      providesTags: ['News'],
    }),

    getNewsArticleBySlug: builder.query<NewsArticleItem, string>({
      query: (slug) => `/news/${encodeURIComponent(slug)}`,
      providesTags: (_result, _err, slug) => [{ type: 'News', id: slug }],
    }),
  }),
});

export const {
  useGetPageContentQuery,
  useGetSiteMetricsQuery,
  useGetSiteTestimonialsQuery,
  useGetDepartmentsQuery,
  useGetDepartmentBySlugQuery,
  useGetLeadershipMembersQuery,
  useGetHomeNewsQuery,
  useGetNewsArticlesQuery,
  useGetNewsArticleBySlugQuery,
} = cmsApi;
