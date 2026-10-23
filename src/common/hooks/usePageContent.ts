import { useCallback } from 'react';
import { useGetPageContentQuery } from '@/store/api/cmsApi';
import type { PageContentResponse, PageSectionData } from '../services/cms.service';

export function usePageContent(
  pageSlug: string,
  /** SSR data from getStaticProps — seeds the component immediately without a loading flash */
  initialData?: PageContentResponse | null
) {
  // If we already have SSR data, skip the RTK Query network fetch on first mount.
  // RTK Query will still refetch in the background after keepUnusedDataFor window.
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetPageContentQuery(pageSlug, {
    // When initialData is provided (SSR path), skip the initial fetch so React
    // hydration always sees the same data the server rendered.
    skip: initialData != null,
  });

  // Prefer SSR data if available, otherwise use RTK Query fetched data
  const resolvedData = initialData ?? data;

  const getSection = useCallback(
    (key: string, fallback?: Partial<PageSectionData>): PageSectionData => {
      const fromApi = resolvedData?.sections?.[key];
      if (!fromApi) {
        return (fallback as PageSectionData) || {};
      }
      return {
        badge: fromApi.badge ?? fallback?.badge ?? null,
        title: fromApi.title ?? fallback?.title ?? null,
        subtitle: fromApi.subtitle ?? fallback?.subtitle ?? null,
        bgImage: fromApi.bgImage ?? fallback?.bgImage ?? null,
        bodyContent: fromApi.bodyContent ?? fallback?.bodyContent ?? null,
        actionText: fromApi.actionText ?? fallback?.actionText ?? null,
        actionUrl: fromApi.actionUrl ?? fallback?.actionUrl ?? null,
        metadata: fromApi.metadata ?? fallback?.metadata ?? {},
        sortOrder: fromApi.sortOrder ?? fallback?.sortOrder ?? 0,
        isActive: fromApi.isActive ?? fallback?.isActive ?? true,
      };
    },
    [resolvedData]
  );

  return {
    content: resolvedData as PageContentResponse | undefined,
    sections: resolvedData?.sections || {},
    getSection,
    // Only show loading state when there is no data at all (no SSR data + RTK still fetching)
    isLoading: resolvedData == null && isLoading,
    error: error ?? null,
    refetch,
  };
}
