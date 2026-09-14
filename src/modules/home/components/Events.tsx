import Link from 'next/link';
import Image from 'next/image';

export function Events() {
  const events = [
    {
      date: "January 22, 2026",
      title: "Student Startup Pitch Competition",
      image: "/assets/event-1.png",
      aspectRatio: "aspect-[409/476]"
    },
    {
      date: "May 22, 2026",
      title: "International Fashion Parade",
      image: "/assets/event-2.png",
      aspectRatio: "aspect-[409/542]"
    },
    {
      date: "May 22, 2026",
      title: "Award-winning student play",
      image: "/assets/event-3.png",
      aspectRatio: "aspect-[409/476]"
    }
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[60px] lg:gap-[80px] items-center">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 lg:gap-[80px] w-full">
          <div className="flex flex-col gap-[16px] items-start max-w-[680px]">
            <div className="border border-[#00698c] rounded-full px-[12px] py-[8px]">
              <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                Stay Updated
              </span>
            </div>

            <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12] max-w-[580px]">
              Upcoming Events & Activities
            </h2>

            <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12] max-w-[611px]">
              Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.
            </p>
          </div>
          
          <Link 
            href="/events" 
            className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a2d6] px-[24px] py-[14px] shadow-sm transition-colors shrink-0 mb-1"
          >
            <span className="font-source font-semibold text-white text-[16px] leading-[24px]">
              View All Events
            </span>
          </Link>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-[60px] items-end w-full">
          {events.map((event, index) => (
            <Link 
              href="/events" 
              key={index} 
              className="flex flex-col gap-[24px] group cursor-pointer w-full"
            >
              <div className={`relative w-full ${event.aspectRatio} rounded-[4px] overflow-hidden`}>
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-[8px] items-start w-full">
                <span className="font-satoshi font-medium text-[14px] leading-[23.8px] text-[#4a4949]">
                  {event.date}
                </span>

                <h3 className="font-['Soria',var(--font-playfair),serif] text-[24px] leading-[33.6px] tracking-[-0.5px] text-[#160d03] group-hover:text-[#00bfff] transition-colors">
                  {event.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
        
      </div>
    </section>
  );
}
