import React, { useState } from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import {
  fetchPublicBlogs,
  fetchFeaturedBlog,
  BlogPostItem,
  PaginatedBlogsResponse,
} from '@/common/services/blogs.service';
import { useGetBlogsQuery } from '@/store/api/cmsApi';

export const getServerSideProps = (async ({ res }) => {
  const [featuredRes, listRes] = await Promise.all([
    fetchFeaturedBlog(),
    fetchPublicBlogs({ page: 1, limit: 9 }),
  ]);

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300',
  );

  return {
    props: {
      initialFeatured: featuredRes?.featured ?? null,
      initialList: listRes ?? {
        items: [],
        total: 0,
        page: 1,
        limit: 9,
        totalPages: 0,
        categories: ['All'],
      },
    },
  };
}) satisfies GetServerSideProps<{
  initialFeatured: BlogPostItem | null;
  initialList: PaginatedBlogsResponse;
}>;

export default function BlogsPage({
  initialFeatured,
  initialList,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);

  const isDefaultFilter =
    category === 'All' && !search.trim() && !selectedTag && page === 1;

  const { data: queriedList, isFetching } = useGetBlogsQuery(
    {
      category: category !== 'All' ? category : undefined,
      tag: selectedTag || undefined,
      search: search.trim() || undefined,
      page,
      limit: 9,
    },
    { skip: isDefaultFilter },
  );

  const activeList = isDefaultFilter ? initialList : queriedList ?? initialList;
  const categories = activeList.categories?.length
    ? activeList.categories
    : initialList.categories || ['All'];
  const posts = activeList.items || [];

  return (
    <>
      <SeoHead
        title="Blog & Insights | IILP"
        description="Explore perspectives, legal insights, policy analysis, and commentary from IILP scholars and fellows."
        canonicalPath="/blogs"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blogs' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />

        <main className="flex-grow">
          {/* Hero Header */}
          <section className="bg-gradient-to-b from-[#f4faff] to-white border-b border-[#e5e7eb] py-14 sm:py-20">
            <div className="max-w-7xl mx-auto px-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#e6f9ff] text-[#00698c] text-xs font-bold uppercase tracking-wider mb-4">
                IILP Blog &amp; Insights
              </span>
              <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-[#0a0d12] max-w-3xl leading-tight">
                Perspectives on International Law, Policy &amp; Global Governance
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#4a5565] max-w-2xl">
                In-depth essays, commentary, and research reflections from our
                faculty, fellows, and visiting scholars.
              </p>

              {/* Featured Post */}
              {initialFeatured && isDefaultFilter && (
                <Link
                  href={`/blogs/${initialFeatured.slug}`}
                  className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-[#e5e7eb] overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="lg:col-span-6 bg-[#f3f4f6] min-h-[260px] max-h-[380px] overflow-hidden">
                    {initialFeatured.featuredImage ? (
                      <img
                        src={initialFeatured.featuredImage}
                        alt={initialFeatured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-sm">
                        Featured Blog
                      </div>
                    )}
                  </div>
                  <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#00698c]">
                      <span className="px-2.5 py-1 rounded-full bg-[#e6f9ff]">
                        Featured · {initialFeatured.categoryName}
                      </span>
                      <span className="text-[#6a7282]">
                        {initialFeatured.publishedDate}
                      </span>
                      <span className="text-[#6a7282]">
                        · {initialFeatured.readTimeMinutes} min read
                      </span>
                    </div>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-playfair font-bold text-[#0a0d12] group-hover:text-[#000080] transition-colors">
                      {initialFeatured.title}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-[#4a5565] line-clamp-3">
                      {initialFeatured.summary}
                    </p>
                    {initialFeatured.authorName && (
                      <div className="mt-5 text-xs font-semibold text-[#101828]">
                        By {initialFeatured.authorName}
                        {initialFeatured.authorRole && (
                          <span className="text-[#6a7282] font-normal">
                            {' '}
                            — {initialFeatured.authorRole}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* Filters & Grid */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      category === cat
                        ? 'bg-[#000080] text-white shadow-xs'
                        : 'bg-[#f3f4f6] text-[#4a5565] hover:bg-[#e5e7eb]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                {selectedTag && (
                  <button
                    onClick={() => {
                      setSelectedTag('');
                      setPage(1);
                    }}
                    className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold cursor-pointer"
                  >
                    Tag: {selectedTag} ✕
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="w-full md:w-72">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search blog posts..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#d1d5db] text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                />
              </div>
            </div>

            {isFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="rounded-2xl border border-[#e5e7eb] h-80 animate-pulse bg-[#f9fafb]"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-[#f9fafb] rounded-3xl border border-[#e5e7eb]">
                <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">
                  No blog posts found
                </h3>
                <p className="text-sm text-[#6a7282] mt-1">
                  Try clearing your search or selecting a different category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="block h-52 bg-[#f3f4f6] overflow-hidden"
                    >
                      {post.featuredImage ? (
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#9ca3af] text-xs">
                          IILP Blog
                        </div>
                      )}
                    </Link>

                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between text-xs text-[#6a7282] mb-2.5">
                        <span className="font-bold text-[#00698c]">
                          {post.categoryName}
                        </span>
                        <span>
                          {post.publishedDate} · {post.readTimeMinutes} min read
                        </span>
                      </div>

                      <Link href={`/blogs/${post.slug}`}>
                        <h3 className="text-lg font-playfair font-bold text-[#0a0d12] group-hover:text-[#000080] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="mt-2.5 text-sm text-[#4a5565] line-clamp-3 flex-grow">
                        {post.summary}
                      </p>

                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {post.tags.slice(0, 3).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSelectedTag(tag);
                                setPage(1);
                              }}
                              className="px-2.5 py-0.5 rounded-full bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[11px] font-medium text-[#4a5565] cursor-pointer"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 pt-4 border-t border-[#f3f4f6] flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#101828]">
                          {post.authorName || 'IILP Editorial'}
                        </span>
                        <Link
                          href={`/blogs/${post.slug}`}
                          className="font-bold text-[#000080] hover:underline"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {activeList.totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border border-[#d1d5db] text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-[#4a5565] px-3">
                  Page {page} of {activeList.totalPages}
                </span>
                <button
                  disabled={page >= activeList.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(activeList.totalPages, p + 1))
                  }
                  className="px-4 py-2 rounded-xl border border-[#d1d5db] text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
