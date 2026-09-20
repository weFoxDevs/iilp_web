import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';
import { fetchPublicEvents } from '@/common/services/events.service';

interface EventCardItem {
  date: string;
  title: string;
  image: string;
  aspectRatio: string;
  slug?: string;
}

const aspectRatios = [
  'aspect-[409/476]',
  'aspect-[409/542]',
  'aspect-[409/476]',
];

const defaultEventImages = [
  '/assets/event-1.png',
  '/assets/event-2.png',
  '/assets/event-3.png',
];

const defaultEvents: EventCardItem[] = [
  {
    date: 'August 28, 2026',
    title: 'International Law & Human Rights Summit 2026',
    image: '/assets/event-1.png',
    aspectRatio: 'aspect-[409/476]',
    slug: 'summit-2026-1',
  },
  {
    date: 'August 28, 2026',
    title: 'Refugee Protection: Emerging Legal Frameworks',
    image: '/assets/event-2.png',
    aspectRatio: 'aspect-[409/542]',
    slug: 'refugee-protection-2',
  },
  {
    date: 'October 05, 2026',
    title: 'Multilateral Trade & Human Rights Policy Dialogue',
    image: '/assets/event-3.png',
    aspectRatio: 'aspect-[409/476]',
    slug: 'policy-dialogue-5',
  },
];

function formatDisplayDate(dateStr?: string | null): string {
  if (!dateStr) return 'Upcoming Event';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

interface EventsProps {
  data?: Partial<PageSectionData>;
}

export function Events({ data }: EventsProps) {
  const [apiEvents, setApiEvents] = useState<EventCardItem[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchPublicEvents({ limit: 3 })
      .then((res) => {
        if (isMounted && res && Array.isArray(res.items) && res.items.length > 0) {
          setApiEvents(
            res.items.slice(0, 3).map((item, idx) => ({
              date: formatDisplayDate(item.startDate),
              title: item.title,
              image:
                item.imageUrl ||
                item.bannerImage ||
                defaultEventImages[idx % defaultEventImages.length],
              aspectRatio: aspectRatios[idx % aspectRatios.length],
              slug: item.slug || item.id,
            }))
          );
        }
      })
      .catch((err) => {
        console.warn('[Events] Failed to fetch events from API:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const section = {
    badge: data?.badge ?? 'Stay Updated',
    title: data?.title ?? 'Upcoming Events & Activities',
    subtitle:
      data?.subtitle ??
      'Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.',
    actionText: data?.actionText || 'View All Events',
    actionUrl: data?.actionUrl || '/events',
  };

  const rawEvents =
    apiEvents ||
    ((data?.metadata || {}).events as EventCardItem[]) ||
    defaultEvents;

  const events = (Array.isArray(rawEvents) ? rawEvents : defaultEvents).slice(0, 3);

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[60px] lg:gap-[80px] items-center">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 lg:gap-[80px] w-full">
          <div className="flex flex-col gap-[16px] items-start max-w-[680px]">
            {section.badge && (
              <div className="border border-[#00698c] rounded-full px-[12px] py-[8px]">
                <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                  {section.badge}
                </span>
              </div>
            )}

            <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12] max-w-[580px]">
              {section.title}
            </h2>

            <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12] max-w-[611px]">
              {section.subtitle}
            </p>
          </div>
          
          {section.actionText && (
            <Link 
              href={section.actionUrl || '/events'} 
              className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a2d6] px-[24px] py-[14px] shadow-sm transition-colors shrink-0 mb-1"
            >
              <span className="font-source font-semibold text-white text-[16px] leading-[24px]">
                {section.actionText}
              </span>
            </Link>
          )}
        </div>

        {/* Events Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-[60px] items-end w-full">
          {events.map((event, index) => (
            <Link 
              href={event.slug ? `/events/${event.slug}` : (section.actionUrl || '/events')} 
              key={index} 
              className="flex flex-col gap-[24px] group cursor-pointer w-full"
            >
              <div className={`relative w-full ${event.aspectRatio} rounded-[4px] overflow-hidden`}>
                <Image 
                  src={event.image || defaultEventImages[index % defaultEventImages.length]} 
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

                <h3 className="font-['Soria',var(--font-playfair),serif] text-[24px] leading-[33.6px] tracking-[-0.5px] text-[#160d03] group-hover:text-[#00bfff] transition-colors line-clamp-2">
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
