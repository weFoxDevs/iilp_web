import type { GetServerSideProps } from 'next';

const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://iilp.org';

const staticRoutes = [
  { url: '/', changeFreq: 'daily', priority: '1.0' },
  { url: '/about', changeFreq: 'weekly', priority: '0.9' },
  { url: '/academics', changeFreq: 'weekly', priority: '0.8' },
  { url: '/fellowships', changeFreq: 'weekly', priority: '0.8' },
  { url: '/events', changeFreq: 'daily', priority: '0.8' },
  { url: '/governance', changeFreq: 'monthly', priority: '0.7' },
  { url: '/leadership-directory', changeFreq: 'monthly', priority: '0.7' },
  { url: '/news-media', changeFreq: 'daily', priority: '0.8' },
  { url: '/apply', changeFreq: 'weekly', priority: '0.7' },
  { url: '/contact', changeFreq: 'monthly', priority: '0.6' },
  { url: '/privacy-policy', changeFreq: 'yearly', priority: '0.3' },
  { url: '/terms-of-use', changeFreq: 'yearly', priority: '0.3' },
];

function generateSitemap(routes: typeof staticRoutes): string {
  const urlset = routes
    .map(
      ({ url, changeFreq, priority }) => `
  <url>
    <loc>${SITE_ORIGIN}${url}</loc>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSitemap(staticRoutes);

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=3600');
  res.write(sitemap);
  res.end();

  return { props: {} };
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Sitemap() {}
