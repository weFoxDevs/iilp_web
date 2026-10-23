import React from 'react';
import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { usePageContent } from '@/common/hooks/usePageContent';
import NewsMediaHero from '@/modules/news-media/components/NewsMediaHero';
import LatestNewsMedia from '@/modules/news-media/components/LatestNewsMedia';
import NewsletterArchiveBanner from '@/modules/news-media/components/NewsletterArchiveBanner';
import PhotoGallerySection from '@/modules/news-media/components/PhotoGallerySection';
import NewsMediaSkeleton from '@/modules/news-media/components/NewsMediaSkeleton';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('news-media').catch(() => null);
  return {
    props: { pageContent },
    revalidate: 300,
  };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;

export default function NewsMediaPage({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('news-media', pageContent);

  return (
    <>
      <SeoHead
        title="News & Media | International Institute for Law and Politics"
        description="Stay updated with IILP's latest news, press releases, photo galleries, newsletter archives, and media coverage on law, governance, and human rights."
        canonicalPath="/news-media"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'News & Media', url: '/news-media' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <NewsMediaSkeleton />
          ) : (
            <>
              <NewsMediaHero data={getSection('hero')} />
              <LatestNewsMedia data={getSection('latest_news_media')} />
              <NewsletterArchiveBanner data={getSection('newsletter_banner')} />
              <PhotoGallerySection data={getSection('photo_gallery')} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
