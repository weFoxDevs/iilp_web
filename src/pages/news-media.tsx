import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import NewsMediaHero from "@/modules/news-media/components/NewsMediaHero";
import LatestNewsMedia from "@/modules/news-media/components/LatestNewsMedia";
import NewsletterArchiveBanner from "@/modules/news-media/components/NewsletterArchiveBanner";
import PhotoGallerySection from "@/modules/news-media/components/PhotoGallerySection";

export default function NewsMediaPage() {
  const { getSection } = usePageContent("news-media");

  return (
    <>
      <Head>
        <title>News &amp; Media | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Stay updated with IILP's latest news, press releases, photo galleries, newsletter archives, and media coverage on law, governance, and human rights."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <NewsMediaHero data={getSection("hero")} />
        <LatestNewsMedia data={getSection("latest_news_media")} />
        <NewsletterArchiveBanner data={getSection("newsletter_banner")} />
        <PhotoGallerySection data={getSection("photo_gallery")} />
      </main>
      <Footer />
    </div>
    </>
  );
}

