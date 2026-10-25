import React from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import NewsArticleDetail from '@/modules/news-media/components/NewsArticleDetail';
import NewsletterArchiveBanner from '@/modules/news-media/components/NewsletterArchiveBanner';
import PhotoGallerySection from '@/modules/news-media/components/PhotoGallerySection';
import LatestNewsMedia from '@/modules/news-media/components/LatestNewsMedia';
import { fetchNewsArticleBySlug, NewsArticleItem } from '@/common/services/news.service';
import { useGetNewsArticleBySlugQuery } from '@/store/api/cmsApi';
import { NewsDetailsSkeleton } from '@/common/components/PageSkeletons';
import { SeoHead, articleJsonLd, breadcrumbJsonLd } from '@/common/components/SeoHead';

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://iilp.org';

export const getServerSideProps = (async (context) => {
  const idOrSlug =
    (context.params?.id as string) ||
    (context.params?.slug as string) ||
    (context.query?.id as string) ||
    (context.query?.slug as string) ||
    '';

  let initialArticle: NewsArticleItem | null = null;
  if (idOrSlug) {
    try {
      initialArticle = await fetchNewsArticleBySlug(idOrSlug);
    } catch {
      initialArticle = null;
    }
  }

  // Cache at edge for 60 s, stale-while-revalidate 300 s
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  );

  return { props: { initialArticle, idOrSlug } };
}) satisfies GetServerSideProps<{ initialArticle: NewsArticleItem | null; idOrSlug: string }>;

export default function NewsDetailsPage({
  initialArticle,
  idOrSlug: initialKey,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  const currentKey =
    (router.query.id as string) ||
    (router.query.slug as string) ||
    initialKey ||
    '';

  // RTK Query: fetch and cache article details by slug or ID
  const { data: queriedArticle, isLoading: isQueryLoading } =
    useGetNewsArticleBySlugQuery(currentKey, {
      skip: !currentKey,
    });

  // Use queriedArticle when loaded from RTK Query cache/network, otherwise use initialArticle
  const article =
    queriedArticle ??
    (initialArticle &&
    (initialArticle.id === currentKey || initialArticle.slug === currentKey)
      ? initialArticle
      : null);
  const isLoading = !article && isQueryLoading;

  const pageTitle = article
    ? `${article.title} | IILP News & Media`
    : 'News & Media Details | IILP';

  const pageDescription =
    article?.summary ||
    "Stay updated with IILP's latest news, press releases, articles, and research highlights.";

  const canonicalPath = article ? `/news-media/${article.id}` : '/news-media';

  return (
    <>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        ogImage={article?.featuredImage || null}
        ogType="article"
        publishedAt={article?.publishedAt || article?.publishedDate}
        jsonLd={
          article
            ? [
                articleJsonLd({
                  title: article.title,
                  description: article.summary,
                  url: canonicalPath,
                  image: article.featuredImage
                    ? article.featuredImage.startsWith('http')
                      ? article.featuredImage
                      : `${SITE_ORIGIN}${article.featuredImage}`
                    : `${SITE_ORIGIN}/assets/og-default.png`,
                  publishedAt: article.publishedAt || article.publishedDate || '',
                }),
                breadcrumbJsonLd([
                  { name: 'Home', url: '/' },
                  { name: 'News & Media', url: '/news-media' },
                  { name: article.title, url: canonicalPath },
                ]),
              ]
            : undefined
        }
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <NewsDetailsSkeleton />
          ) : !article ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00698c] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">Article Not Found</h2>
              <p className="text-gray-600 text-sm max-w-md">
                The news article you requested could not be located. It may have been unpublished or removed.
              </p>
              <Link
                href="/news-media"
                className="mt-2 px-6 py-2.5 bg-[#00bfff] hover:bg-[#009ecc] text-white text-sm font-semibold rounded-full shadow-xs transition-colors"
              >
                Back to News &amp; Media
              </Link>
            </div>
          ) : (
            <>
              <NewsArticleDetail article={article} />
              <NewsletterArchiveBanner />
              <PhotoGallerySection />
              <LatestNewsMedia
                badge="Stay Updated"
                title="News & Media Center"
                subtitle="Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship."
                tabs={[
                  { id: 'all', name: 'All' },
                  { id: 'programs', name: 'Programs' },
                  { id: 'news', name: 'News' },
                  { id: 'events', name: 'Events' },
                ]}
                headerLayout="split"
              />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
