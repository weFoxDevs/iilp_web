import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';
import { fetchHomeNews, HomeNewsResponse } from '@/common/services/news.service';

interface NewsItem {
  id: number | string;
  category: string;
  date: string;
  title: string;
  image: string;
  link?: string;
}

interface NewsMetadata extends Record<string, unknown> {
  tabs?: string[];
  featured?: NewsItem;
  articles?: NewsItem[];
}

interface NewsMediaProps {
  data?: Partial<PageSectionData>;
}

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function NewsMedia({ data }: NewsMediaProps) {
  const [activeTab, setActiveTab] = useState('Programs');
  const [apiNews, setApiNews] = useState<HomeNewsResponse | null>(null);

  const defaultNewsData = {
    badge: 'Stay Updated',
    title: 'News & Media Center',
    subtitle:
      'Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.',
    actionText: 'View All News',
    actionUrl: '/news',
    metadata: {
      tabs: ['Programs', 'News', 'Events'],
      featured: {
        id: 'featured',
        category: 'News',
        date: 'May 20, 2025',
        title: 'Technological Advancements',
        image: '/assets/news-main.png',
        link: '/news',
      },
      articles: [
        {
          id: 1,
          category: 'News',
          date: 'May 20, 2025',
          title: 'Technological Advancements',
          image: '/assets/news-small-1.png',
          link: '/news',
        },
        {
          id: 2,
          category: 'News',
          date: 'May 20, 2025',
          title: 'Technological Advancements',
          image: '/assets/news-small-2.png',
          link: '/news',
        },
        {
          id: 3,
          category: 'News',
          date: 'May 20, 2025',
          title: 'Technological Advancements',
          image: '/assets/news-small-3.png',
          link: '/news',
        },
        {
          id: 4,
          category: 'News',
          date: 'May 20, 2025',
          title: 'Technological Advancements',
          image: '/assets/news-small-4.png',
          link: '/news',
        },
      ],
    } as NewsMetadata,
  };

  // Fetch live articles from public News API on mount
  useEffect(() => {
    let isMounted = true;
    fetchHomeNews().then((res) => {
      if (isMounted && res && (res.featured || res.articles?.length > 0)) {
        setApiNews(res);
        if (res.tabs && res.tabs.length > 0) {
          setActiveTab(res.tabs[0]);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const section = {
    badge: data?.badge ?? defaultNewsData.badge,
    title: data?.title ?? defaultNewsData.title,
    subtitle: data?.subtitle ?? defaultNewsData.subtitle,
    actionText: data?.actionText || defaultNewsData.actionText,
    actionUrl: data?.actionUrl || defaultNewsData.actionUrl,
    metadata: (data?.metadata as NewsMetadata) || defaultNewsData.metadata,
  };

  const metadata = (section.metadata as NewsMetadata) || defaultNewsData.metadata;

  // Prefer dynamic public API articles if available, fall back to page section metadata
  const tabs = apiNews?.tabs && apiNews.tabs.length > 0
    ? apiNews.tabs
    : metadata.tabs && metadata.tabs.length > 0
    ? metadata.tabs
    : defaultNewsData.metadata.tabs;

  const featured: NewsItem | undefined = apiNews?.featured
    ? {
        id: apiNews.featured.id,
        category: apiNews.featured.categoryName || 'News',
        date: formatDisplayDate(apiNews.featured.publishedDate),
        title: apiNews.featured.title,
        image: apiNews.featured.featuredImage || '/assets/news-main.png',
        link: `/news/${apiNews.featured.slug}`,
      }
    : metadata.featured || defaultNewsData.metadata.featured;

  const articles: NewsItem[] = (apiNews?.articles && apiNews.articles.length > 0
    ? apiNews.articles.map((a) => ({
        id: a.id,
        category: a.categoryName || 'News',
        date: formatDisplayDate(a.publishedDate),
        title: a.title,
        image: a.featuredImage || '/assets/news-small-1.png',
        link: `/news/${a.slug}`,
      }))
    : metadata.articles && metadata.articles.length > 0
    ? metadata.articles
    : defaultNewsData.metadata.articles) || [];

  const filteredArticles = (articles || []).filter((item) => {
    if (!activeTab || activeTab.toLowerCase() === 'all') return true;
    return item.category?.toLowerCase() === activeTab.toLowerCase();
  });

  const displayArticles = filteredArticles.length > 0 ? filteredArticles : articles || [];

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-10 sm:gap-[60px] lg:gap-[80px] items-center">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 lg:gap-[80px] w-full">
          {/* Text Content */}
          <div className="flex flex-col items-start gap-3 sm:gap-[16px] max-w-[680px]">
            {section.badge && (
              <div className="border border-[#00698c] rounded-full px-3.5 py-1.5 sm:px-[12px] sm:py-[8px]">
                <span className="font-inter font-semibold text-xs sm:text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                  {section.badge}
                </span>
              </div>
            )}

            <h2 className="font-playfair font-medium text-2xl sm:text-3xl md:text-4xl lg:text-[36px] leading-snug sm:leading-[1.25] lg:leading-[44px] text-[#0a0d12] tracking-[-0.72px] max-w-[580px]">
              {section.title || defaultNewsData.title}
            </h2>

            <p className="font-inter font-normal text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12] max-w-[611px]">
              {section.subtitle || defaultNewsData.subtitle}
            </p>
          </div>

          {/* Filter Tabs */}
          {tabs && tabs.length > 0 && (
            <div className="bg-[#e6f9ff] border border-[#b0ebff] p-1 rounded-2xl sm:rounded-full flex gap-1.5 items-center self-start lg:self-end flex-wrap max-w-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 sm:px-[16px] sm:py-[10px] rounded-xl sm:rounded-full font-source font-semibold text-xs sm:text-[14px] leading-tight sm:leading-[20px] transition-all cursor-pointer min-h-[36px] ${
                    activeTab === tab
                      ? 'bg-[#1e2939] text-white shadow-sm'
                      : 'bg-white text-[#4a5565] border border-[#e5e7eb] hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-[32px] items-start w-full">
          
          {/* Featured Article (Left) */}
          {featured && (
            <Link href={featured.link || section.actionUrl || '/news'} className="w-full lg:w-[606px] shrink-0 flex flex-col gap-3 sm:gap-[16px] group cursor-pointer">
              <div className="relative w-full aspect-[606/610] overflow-hidden rounded-xs">
                <Image 
                  src={featured.image} 
                  alt={featured.title} 
                  fill 
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 606px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              </div>

              <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
                <div className="flex items-center gap-2 sm:gap-[10px] flex-wrap">
                  <span className="bg-[#e6f9ff] text-[#000036] font-source font-normal text-xs sm:text-[14px] leading-tight sm:leading-[20px] px-3 py-1 sm:px-[14px] sm:py-[2px] rounded-full">
                    {featured.category}
                  </span>
                  <span className="font-satoshi font-medium text-xs sm:text-[14px] leading-relaxed text-[#160d03]">
                    {featured.date}
                  </span>
                </div>

                <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-xl sm:text-[24px] leading-snug sm:leading-[32px] text-[#0a0d12] group-hover:text-[#00bfff] transition-colors">
                  {featured.title}
                </h3>
              </div>
            </Link>
          )}

          {/* Smaller Articles Grid (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-[32px] flex-1 w-full">
            {displayArticles.map((item) => (
              <Link href={item.link || section.actionUrl || '/news'} key={item.id} className="flex flex-col gap-3 sm:gap-[16px] items-start w-full group cursor-pointer">
                <div className="relative w-full aspect-[339/245] overflow-hidden rounded-xs">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:gap-[8px] items-start w-full">
                  <div className="flex items-center gap-2 sm:gap-[10px] flex-wrap">
                    <span className="bg-[#e6f9ff] text-[#000036] font-source font-normal text-xs sm:text-[14px] leading-tight sm:leading-[20px] px-3 py-1 sm:px-[14px] sm:py-[2px] rounded-full">
                      {item.category}
                    </span>
                    <span className="font-satoshi font-medium text-xs sm:text-[14px] leading-relaxed text-[#160d03]">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-lg sm:text-[24px] leading-snug sm:leading-[32px] text-[#0a0d12] group-hover:text-[#00bfff] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Action Button CTA */}
        {section.actionText && (
          <div className="flex justify-center w-full pt-2">
            <Link
              href={section.actionUrl || '/news'}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#1e2939] hover:bg-[#0a0d12] text-white font-inter font-semibold text-sm transition-all shadow-sm hover:shadow-md cursor-pointer w-full sm:w-auto text-center min-h-[44px]"
            >
              <span>{section.actionText}</span>
              <span>→</span>
            </Link>
          </div>
        )}
        
      </div>
    </section>
  );
}
