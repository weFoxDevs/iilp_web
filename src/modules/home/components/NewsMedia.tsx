import Link from 'next/link';
import Image from 'next/image';

export function NewsMedia() {
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

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-16 lg:gap-20">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 w-full">
          {/* Text Content */}
          <div className="flex flex-col items-start gap-4 max-w-2xl">
            <div className="inline-block border border-primary-800 rounded-full px-3 py-1.5">
              <span className="text-gray-950 text-sm font-semibold uppercase tracking-wide font-inter">
                Stay Updated
              </span>
            </div>
            <h2 className="font-playfair font-medium text-4xl lg:text-5xl text-gray-950 tracking-tight">
              News & Media Center
            </h2>
            <p className="text-lg md:text-xl text-gray-950/80 leading-relaxed font-inter">
              Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-primary-50 border border-primary-50 rounded-full p-1 self-start lg:self-end font-inter">
            <button className="bg-gray-800 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm transition-colors">
              Programs
            </button>
            <button className="bg-white text-gray-600 border border-gray-200 font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              News
            </button>
            <button className="bg-white text-gray-600 border border-gray-200 font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
              Events
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
          
          {/* Featured Article (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-6 group cursor-pointer">
            <div className="relative w-full aspect-[4/4] lg:aspect-[606/610] rounded-2xl overflow-hidden">
              <Image 
                src="/assets/news-main.png" 
                alt="Main News" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="bg-primary-50 text-secondary-900 text-sm font-medium px-3.5 py-1 rounded-full font-inter">
                  News
                </span>
                <span className="text-gray-950 text-sm font-medium font-inter">
                  May 20, 2025
                </span>
              </div>
              <h3 className="font-playfair text-2xl lg:text-[28px] leading-tight text-gray-950 group-hover:text-primary-800 transition-colors">
                Technological Advancements
              </h3>
            </div>
          </div>

          {/* Smaller Articles Grid (Right) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
            {newsItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-5 group cursor-pointer">
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary-50 text-secondary-900 text-sm font-medium px-3.5 py-1 rounded-full font-inter">
                      {item.category}
                    </span>
                    <span className="text-gray-950 text-sm font-medium font-inter">
                      {item.date}
                    </span>
                  </div>
                  <h3 className="font-playfair text-xl lg:text-2xl leading-tight text-gray-950 group-hover:text-primary-800 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
        
      </div>
    </section>
  );
}
