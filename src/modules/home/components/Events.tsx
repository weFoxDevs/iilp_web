import Link from 'next/link';
import Image from 'next/image';

export function Events() {
  const events = [
    {
      date: "January 22, 2026",
      title: "Student Startup Pitch Competition",
      image: "/assets/event-1.png"
    },
    {
      date: "May 22, 2026",
      title: "International Fashion Parade",
      image: "/assets/event-2.png"
    },
    {
      date: "May 22, 2026",
      title: "Award-winning student play",
      image: "/assets/event-3.png"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="inline-block border border-[#00698C] rounded-full px-4 py-1.5 w-fit">
              <span className="text-[#0A0D12] text-sm font-semibold uppercase tracking-wide">
                Stay Updated
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-medium font-serif text-[#0A0D12]">
              Upcoming Events & Activities
            </h2>
            <p className="text-lg md:text-xl text-[#0A0D12]/70 leading-relaxed">
              Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.
            </p>
          </div>
          
          <Link href="/events" className="inline-flex items-center justify-center rounded-full bg-[#00BFFF] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-[#00a3d9] transition-colors shrink-0 mb-2">
            View All Events
          </Link>
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {events.map((event, index) => (
            <Link href="#" key={index} className="flex flex-col gap-6 group cursor-pointer">
              <div className="relative w-full rounded overflow-hidden" style={{ aspectRatio: index === 1 ? '3/4' : '4/5' }}>
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#4A4949]">
                  {event.date}
                </span>
                <h3 className="text-2xl font-serif text-[#160D03] group-hover:text-[#00BFFF] transition-colors">
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
