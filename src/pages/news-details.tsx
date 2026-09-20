import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import NewsMediaHero from "@/modules/news-media/components/NewsMediaHero";
import NewsArticleDetail from "@/modules/news-media/components/NewsArticleDetail";
import NewsletterArchiveBanner from "@/modules/news-media/components/NewsletterArchiveBanner";
import PhotoGallerySection from "@/modules/news-media/components/PhotoGallerySection";
import LatestNewsMedia from "@/modules/news-media/components/LatestNewsMedia";
import { fetchNewsArticleBySlug, NewsArticleItem } from "@/common/services/news.service";

export default function NewsDetailsPage() {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticleItem | null>(null);

  useEffect(() => {
    if (!router.isReady) return;
    const slug = (router.query.slug as string) || "student-clubs-and-organizations";
    let isMounted = true;

    fetchNewsArticleBySlug(slug).then((data) => {
      if (isMounted) {
        setArticle(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router.isReady, router.query.slug]);

  const pageTitle = article
    ? `${article.title} | IILP News & Media`
    : "Student Clubs and Organizations - News & Media Details | IILP";

  const pageDescription =
    article?.summary ||
    "Stay updated with IILP's latest news, press releases, articles, and research highlights.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <NewsMediaHero
            badge={article?.categoryName || "News"}
            title={article?.title || "Student Clubs and Organizations"}
            subtitle={article?.summary || "College is more than just lectures and exams—it's also about growing personally, building networks, & exploring new interests."}
            bgImage="/assets/news-details-hero-bg.png"
          />

          {/* Dynamic Article & Sidebar Content */}
          <NewsArticleDetail article={article} />

          {/* Newsletter Archive Banner */}
          <NewsletterArchiveBanner />

          {/* Photo Gallery Visual Media Section */}
          <PhotoGallerySection />

          {/* Related News & Media Center Section */}
          <LatestNewsMedia
            badge="Stay Updated"
            title="News & Media Center"
            subtitle="Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship."
            tabs={[
              { id: "all", name: "All" },
              { id: "programs", name: "Programs" },
              { id: "news", name: "News" },
              { id: "events", name: "Events" },
            ]}
            headerLayout="split"
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
