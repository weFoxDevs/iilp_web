import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import NewsMediaHero from "@/modules/news-media/components/NewsMediaHero";
import NewsArticleDetail from "@/modules/news-media/components/NewsArticleDetail";
import NewsletterArchiveBanner from "@/modules/news-media/components/NewsletterArchiveBanner";
import PhotoGallerySection from "@/modules/news-media/components/PhotoGallerySection";
import LatestNewsMedia from "@/modules/news-media/components/LatestNewsMedia";

export default function NewsDetailsPage() {
  return (
    <>
      <Head>
        <title>Student Clubs and Organizations - News & Media Details | IILP</title>
        <meta
          name="description"
          content="Student Clubs and Organizations You Should Join This Semester - IILP News & Media Center."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {/* Hero Section */}
          <NewsMediaHero
            badge="News"
            title="News title is here"
            subtitle="news subtitle is here"
            bgImage="/assets/news-details-hero-bg.png"
          />

          {/* Article & Sidebar Content */}
          <NewsArticleDetail />

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
              { id: "programs", name: "Programs" },
              { id: "news", name: "News" },
              { id: "events", name: "Events" },
            ]}
            detailsHref="/news-details"
            headerLayout="split"
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
