import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function NewsMedia() {
  const [activeTab, setActiveTab] = useState('Programs');

  const newsItems = [
    {
      id: 1,
      category: 'News',
      date: 'May 20, 2025',
      title: 'Technological Advancements',
      image: '/assets/news-small-1.png',
    },
    {
      id: 2,
      category: 'News',
      date: 'May 20, 2025',
      title: 'Technological Advancements',
      image: '/assets/news-small-2.png',
    },
    {
      id: 3,
      category: 'News',
      date: 'May 20, 2025',
      title: 'Technological Advancements',
      image: '/assets/news-small-3.png',
    },
    {
      id: 4,
      category: 'News',
      date: 'May 20, 2025',
      title: 'Technological Advancements',
      image: '/assets/news-small-4.png',
    },
  ];

  const tabs = ['Programs', 'News', 'Events'];

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[60px] lg:gap-[80px] items-center">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-[80px] w-full">
          {/* Text Content */}
          <div className="flex flex-col items-start gap-[16px] max-w-[680px]">
            <div className="border border-[#00698c] rounded-full px-[12px] py-[8px]">
              <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                Stay Updated
              </span>
            </div>

            <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] text-[#0a0d12] tracking-[-0.72px] max-w-[580px]">
              News & Media Center
            </h2>

            <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12] max-w-[611px]">
              Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-[#e6f9ff] border border-[#e6f9ff] p-[4px] rounded-full flex gap-[4px] items-center self-start lg:self-end">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-[16px] py-[10px] rounded-full font-source font-semibold text-[14px] leading-[20px] transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#1e2939] text-white shadow-sm'
                    : 'bg-white text-[#4a5565] border border-[#e5e7eb] hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex flex-col lg:flex-row gap-[32px] items-start w-full">
          
          {/* Featured Article (Left) */}
          <Link href="/news" className="w-full lg:w-[606px] shrink-0 flex flex-col gap-[16px] group cursor-pointer">
            <div className="relative w-full aspect-[606/610] overflow-hidden">
              <Image 
                src="/assets/news-main.png" 
                alt="Main News" 
                fill 
                sizes="(max-width: 1024px) 100vw, 606px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>

            <div className="flex flex-col gap-[8px] items-start w-full">
              <div className="flex items-center gap-[10px]">
                <span className="bg-[#e6f9ff] text-[#000036] font-source font-normal text-[14px] leading-[20px] px-[14px] py-[2px] rounded-[24px]">
                  News
                </span>
                <span className="font-satoshi font-medium text-[14px] leading-[23.8px] text-[#160d03]">
                  May 20, 2025
                </span>
              </div>

              <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-[24px] leading-[32px] text-[#0a0d12] group-hover:text-[#00bfff] transition-colors">
                Technological Advancements
              </h3>
            </div>
          </Link>

          {/* Smaller Articles Grid (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[32px] flex-1 w-full">
            {newsItems.map((item) => (
              <Link href="/news" key={item.id} className="flex flex-col gap-[16px] items-start w-full group cursor-pointer">
                <div className="relative w-full aspect-[339/245] overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 340px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-col gap-[8px] items-start w-full">
                  <div className="flex items-center gap-[10px]">
                    <span className="bg-[#e6f9ff] text-[#000036] font-source font-normal text-[14px] leading-[20px] px-[14px] py-[2px] rounded-[24px]">
                      {item.category}
                    </span>
                    <span className="font-satoshi font-medium text-[14px] leading-[23.8px] text-[#160d03]">
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-['Soria',var(--font-playfair),serif] font-bold text-[24px] leading-[32px] text-[#0a0d12] group-hover:text-[#00bfff] transition-colors">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

        </div>
        
      </div>
    </section>
  );
}
