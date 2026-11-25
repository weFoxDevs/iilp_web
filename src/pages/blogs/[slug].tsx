import React from 'react';
import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import {
  SeoHead,
  articleJsonLd,
  breadcrumbJsonLd,
} from '@/common/components/SeoHead';
import {
  fetchPublicBlogBySlug,
  BlogPostItem,
} from '@/common/services/blogs.service';
import { useGetBlogBySlugQuery } from '@/store/api/cmsApi';

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://iilp.org';

export const getServerSideProps = (async (context) => {
  const slug = (context.params?.slug as string) || '';
  let initialPost: BlogPostItem | null = null;

  if (slug) {
    initialPost = await fetchPublicBlogBySlug(slug);
  }

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300',
  );

  return { props: { initialPost, slug } };
}) satisfies GetServerSideProps<{
  initialPost: BlogPostItem | null;
  slug: string;
}>;

export default function BlogDetailsPage({
  initialPost,
  slug: initialSlug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const currentSlug = (router.query.slug as string) || initialSlug || '';

  const { data: queriedPost, isLoading: isQueryLoading } =
    useGetBlogBySlugQuery(currentSlug, { skip: !currentSlug });

  const post =
    queriedPost ??
    (initialPost &&
    (initialPost.slug === currentSlug || initialPost.id === currentSlug)
      ? initialPost
      : null);

  const isLoading = !post && isQueryLoading;

  const pageTitle = post ? `${post.title} | IILP Blog` : 'Blog Post | IILP';
  const pageDescription =
    post?.summary ||
    'Read perspectives and analysis on international law and policy from IILP.';
  const canonicalPath = post ? `/blogs/${post.slug}` : '/blogs';

  return (
    <>
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        ogImage={post?.featuredImage || null}
        ogType="article"
        publishedAt={post?.publishedAt || post?.publishedDate}
        jsonLd={
          post
            ? [
                articleJsonLd({
                  title: post.title,
                  description: post.summary,
                  url: canonicalPath,
                  image: post.featuredImage
                    ? post.featuredImage.startsWith('http')
                      ? post.featuredImage
                      : `${SITE_ORIGIN}${post.featuredImage}`
                    : `${SITE_ORIGIN}/assets/og-default.png`,
                  publishedAt: post.publishedAt || post.publishedDate || '',
                }),
                breadcrumbJsonLd([
                  { name: 'Home', url: '/' },
                  { name: 'Blog', url: '/blogs' },
                  { name: post.title, url: canonicalPath },
                ]),
              ]
            : undefined
        }
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />

        <main className="flex-grow">
          {isLoading ? (
            <div className="max-w-4xl mx-auto px-6 py-20 space-y-6 animate-pulse">
              <div className="h-6 w-32 bg-[#f3f4f6] rounded" />
              <div className="h-12 w-3/4 bg-[#f3f4f6] rounded" />
              <div className="h-80 w-full bg-[#f3f4f6] rounded-2xl" />
            </div>
          ) : !post ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center px-6">
              <h1 className="text-3xl font-playfair font-bold text-[#0a0d12]">
                Blog Post Not Found
              </h1>
              <p className="text-sm text-[#6a7282] max-w-md">
                The blog post you are looking for may have been unpublished or
                moved.
              </p>
              <Link
                href="/blogs"
                className="px-5 py-2.5 rounded-xl bg-[#000080] text-white text-xs font-bold hover:bg-[#000066]"
              >
                ← Back to All Blogs
              </Link>
            </div>
          ) : (
            <article className="max-w-4xl mx-auto px-6 py-12 sm:py-16">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-xs font-semibold text-[#6a7282] mb-6">
                <Link href="/" className="hover:text-[#000080]">
                  Home
                </Link>
                <span>/</span>
                <Link href="/blogs" className="hover:text-[#000080]">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-[#00698c] truncate">{post.categoryName}</span>
              </nav>

              {/* Header */}
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#e6f9ff] text-[#00698c] text-xs font-bold">
                  {post.categoryName}
                </span>
                <h1 className="text-3xl sm:text-5xl font-playfair font-bold text-[#0a0d12] leading-tight">
                  {post.title}
                </h1>
                {post.summary && (
                  <p className="text-base sm:text-lg text-[#4a5565] leading-relaxed">
                    {post.summary}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#6a7282] border-b border-[#e5e7eb] pb-6">
                  {post.authorName && (
                    <div className="font-bold text-[#101828]">
                      By {post.authorName}
                      {post.authorRole && (
                        <span className="font-normal text-[#6a7282]">
                          {' '}
                          · {post.authorRole}
                        </span>
                      )}
                    </div>
                  )}
                  <span>Published {post.publishedDate}</span>
                  <span>· {post.readTimeMinutes} min read</span>
                </div>
              </div>

              {/* Cover Image */}
              {post.featuredImage && (
                <div className="my-8 rounded-3xl overflow-hidden border border-[#e5e7eb] bg-[#f9fafb]">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full max-h-[520px] object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-lg max-w-none text-[#1f2937] leading-relaxed [&>h2]:font-playfair [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:font-playfair [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mt-6 [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-[#000080] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[#4a5565]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-[#e5e7eb] flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#6a7282] mr-1">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#f3f4f6] text-xs font-semibold text-[#374151]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Related Posts */}
              {post.related && post.related.length > 0 && (
                <section className="mt-14 pt-10 border-t border-[#e5e7eb]">
                  <h2 className="text-2xl font-playfair font-bold text-[#0a0d12] mb-6">
                    Related Articles
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {post.related.map((rel) => (
                      <Link
                        key={rel.id}
                        href={`/blogs/${rel.slug}`}
                        className="group rounded-2xl border border-[#e5e7eb] p-4 hover:shadow-sm transition-shadow bg-white"
                      >
                        <span className="text-[11px] font-bold text-[#00698c]">
                          {rel.categoryName}
                        </span>
                        <h3 className="mt-1.5 text-sm font-playfair font-bold text-[#0a0d12] group-hover:text-[#000080] line-clamp-2">
                          {rel.title}
                        </h3>
                        <p className="mt-2 text-xs text-[#6a7282]">
                          {rel.publishedDate} · {rel.readTimeMinutes} min read
                        </p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
