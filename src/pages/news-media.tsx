import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import NewsMediaHero from "@/modules/news-media/components/NewsMediaHero";
import LatestNewsMedia from "@/modules/news-media/components/LatestNewsMedia";
import NewsletterArchiveBanner from "@/modules/news-media/components/NewsletterArchiveBanner";
import PhotoGallerySection from "@/modules/news-media/components/PhotoGallerySection";

export default function NewsMediaPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <NewsMediaHero />
        <LatestNewsMedia />
        <NewsletterArchiveBanner />
        <PhotoGallerySection />
      </main>
      <Footer />
    </div>
  );
}
