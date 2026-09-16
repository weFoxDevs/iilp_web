import { useState, useEffect, useCallback } from 'react';
import {
  fetchPageContent,
  PageContentResponse,
  PageSectionData,
} from '../services/cms.service';

export function usePageContent(pageSlug: string) {
  const [data, setData] = useState<PageContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchPageContent(pageSlug);
      if (res) {
        setData(res);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [pageSlug]);

  useEffect(() => {
    let active = true;
    fetchPageContent(pageSlug)
      .then((res) => {
        if (active && res) {
          setData(res);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [pageSlug]);

  const getSection = (
    key: string,
    fallback?: Partial<PageSectionData>
  ): PageSectionData => {
    const fromApi = data?.sections?.[key];
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
  };

  return {
    content: data,
    sections: data?.sections || {},
    getSection,
    isLoading,
    error,
    refetch: loadContent,
  };
}
