import Head from 'next/head';

interface SeoHeadProps {
  title: string;
  description: string;
  /** Canonical path (e.g. "/about") — site origin prepended automatically */
  canonicalPath?: string;
  /** Absolute URL for OG image. Falls back to /assets/og-default.png */
  ogImage?: string | null;
  ogType?: 'website' | 'article';
  /** ISO 8601 publish date, used for article OG type */
  publishedAt?: string;
  /** Structured data JSON-LD object(s) */
  jsonLd?: object | object[];
  noIndex?: boolean;
}

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://iilp.org';
const SITE_NAME = 'International Institute for Law and Politics (IILP)';
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/assets/og-default.png`;

export function SeoHead({
  title,
  description,
  canonicalPath,
  ogImage,
  ogType = 'website',
  publishedAt,
  jsonLd,
  noIndex = false,
}: SeoHeadProps) {
  const canonical = canonicalPath ? `${SITE_ORIGIN}${canonicalPath}` : undefined;
  const resolvedOg = ogImage || DEFAULT_OG_IMAGE;
  const truncDesc = description.length > 160 ? description.slice(0, 157) + '…' : description;

  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Head>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={truncDesc} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={truncDesc} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={resolvedOg} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {ogType === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={truncDesc} />
      <meta name="twitter:image" content={resolvedOg} />

      {/* JSON-LD */}
      {jsonLdArray.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}

// ─── Preset JSON-LD helpers ───────────────────────────────────────────────────

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/assets/logo.png`,
    description:
      'IILP advances scholarship, fellowship, and leadership in law, governance, human rights, and global policy.',
    sameAs: [
      'https://www.facebook.com/iilp',
      'https://twitter.com/iilp',
      'https://www.linkedin.com/company/iilp',
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_ORIGIN}${item.url}`,
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  authorName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    url: article.url.startsWith('http') ? article.url : `${SITE_ORIGIN}${article.url}`,
    image: article.image,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: article.authorName || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/assets/logo.png` },
    },
  };
}
