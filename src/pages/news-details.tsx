import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import NewsMediaHero from "@/modules/news-media/components/NewsMediaHero";
import NewsArticleDetail from "@/modules/news-media/components/NewsArticleDetail";
import NewsletterArchiveBanner from "@/modules/news-media/components/NewsletterArchiveBanner";
import PhotoGallerySection from "@/modules/news-media/components/PhotoGallerySection";
import LatestNewsMedia from "@/modules/news-media/components/LatestNewsMedia";
import { fetchNewsArticleBySlug, NewsArticleItem } from "@/common/services/news.service";

const fallbackArticlesMap: Record<string, NewsArticleItem> = {
  "student-clubs-and-organizations": {
    id: "news-fallback-1",
    title: "Student Clubs and Organizations You Should Join This Semester",
    slug: "student-clubs-and-organizations",
    categoryId: "programs",
    categoryName: "Programs",
    summary:
      "College is more than just lectures and exams—it is also about growing personally, building networks, and exploring new interests across campus life.",
    content:
      '<p class="lead">College is more than just lectures and exams—it’s also about growing personally, building networks, & exploring new interests. One of the best ways to do that is by joining student clubs and organizations. Whether you’re looking to develop leadership skills, dive into a passion, or simply meet new people, there’s something for everyone.</p><h2>Academic and Professional Clubs</h2><p>These clubs align with your major or career goals—think Business Club, Engineering Society, or Debate Team. They host workshops, networking events, and guest lectures to help you prepare for your future.</p><h2>Cultural and Diversity Organizations</h2><p>Celebrate your heritage and learn about others through clubs that represent different cultures, religions, or languages. From international student associations to cultural dance troupes, these groups create inclusive spaces for sharing traditions and experiences.</p><h2>Creative and Performing Arts</h2><p>Love to paint, sing, act, or write? Join a club that fuels your creative energy. Campus theater groups, music ensembles, photography clubs, or literary societies offer the chance to express yourself and collaborate with like-minded peers.</p><h2>Sports and Fitness Groups</h2><p>Whether you’re into competitive sports or casual wellness, there’s something for every fitness level. Join intramural teams, dance squads, or yoga clubs to stay active and reduce stress.</p><h2>Social Impact and Volunteer Organizations</h2><p>Make a difference on campus and in your community by joining a club focused on volunteering, sustainability, mental health, or human rights. These groups often run awareness campaigns, fundraisers, and outreach programs.</p><h2>Tech and Innovation Societies</h2><p>If you’re a tech enthusiast, coder, or entrepreneur, these clubs are perfect for honing your skills. Participate in hackathons, build projects, or work on startups with your peers.</p><h2>Student Government and Leadership Groups</h2><p>Get involved in student governance or leadership development programs to represent your peers and make your voice heard in shaping campus policies and events.</p><h2>Final Thoughts</h2><p>No matter your interest or schedule, joining at least one club can open doors to friendships, growth, and unforgettable experiences. Don’t hesitate to attend club fairs or reach out to group leaders—you might just find your second home on campus.</p>',
    featuredImage: "/assets/news-article-student.png",
    publishedDate: "2025-05-19",
    readTimeMinutes: 4,
    status: "PUBLISHED",
    isHighlighted: false,
    sortOrder: 1,
  },
  "evolving-landscape-of-international-humanitarian-law": {
    id: "news-fallback-2",
    title: "The Evolving Landscape of International Humanitarian Law",
    slug: "evolving-landscape-of-international-humanitarian-law",
    categoryId: "programs",
    categoryName: "Programs",
    summary:
      "A deep dive into new institutional frameworks protecting civilian populations and critical civil infrastructure in digital conflict zones.",
    content:
      "<p>Modern asymmetric conflicts present novel challenges to the Geneva Conventions. This working paper explores emerging legal remedies, automated targeting oversight, and multilateral treaties protecting humanitarian personnel.</p><p>Scholars across international appellate courts participated in the drafting of these advisory guidelines.</p>",
    featuredImage: "/assets/news-students-talking.png",
    publishedDate: "2025-05-18",
    readTimeMinutes: 4,
    status: "PUBLISHED",
    isHighlighted: false,
    sortOrder: 2,
  },
};

export default function NewsDetailsPage() {
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    const slug = (router.query.slug as string) || "student-clubs-and-organizations";
    let isMounted = true;
    setIsLoading(true);

    fetchNewsArticleBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setArticle(data);
        } else {
          const fallback =
            fallbackArticlesMap[slug] ||
            Object.values(fallbackArticlesMap).find(
              (a) => a.slug === slug || a.id === slug
            );
          setArticle(fallback || null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback =
          fallbackArticlesMap[slug] ||
          Object.values(fallbackArticlesMap).find(
            (a) => a.slug === slug || a.id === slug
          );
        setArticle(fallback || null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router.isReady, router.query.slug]);

  const pageTitle = article
    ? `${article.title} | IILP News & Media`
    : "News & Media Details | IILP";

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
          {isLoading ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading article details...</p>
            </div>
          ) : !article ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00698c] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Article Not Found
              </h2>
              <p className="text-gray-600 text-sm max-w-md">
                The news article you requested could not be located. It may have been unpublished or removed.
              </p>
              <Link
                href="/news"
                className="mt-2 px-6 py-2.5 bg-[#00bfff] hover:bg-[#009ecc] text-white text-sm font-semibold rounded-full shadow-xs transition-colors"
              >
                Back to News &amp; Media
              </Link>
            </div>
          ) : (
            <>
              {/* Dynamic Hero Section */}
              <NewsMediaHero
                badge={article.categoryName || "News"}
                title={article.title}
                subtitle={article.summary}
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
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
