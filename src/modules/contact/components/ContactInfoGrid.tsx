import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageSectionData } from "@/common/services/cms.service";

export interface ContactInfoCardItem {
  title: string;
  value: string;
  timing: string;
  iconAlt?: string;
  iconSrc?: string;
  link?: string;
}

export const defaultContactCards: ContactInfoCardItem[] = [
  {
    title: "Email",
    value: "info@iilp.org",
    timing: "Online Support",
    iconAlt: "Email Icon",
    iconSrc: "/images/contact-icon-email.svg",
  },
  {
    title: "Phone",
    value: "+880 1819-254425",
    timing: "Sunday to Thursday 9am to 5pm",
    iconAlt: "Phone Icon",
    iconSrc: "/images/contact-icon-phone.svg",
  },
  {
    title: "Office",
    value: "Dhaka, Bangladesh",
    timing: "Visit Our Head Office",
    iconAlt: "Office Icon",
    iconSrc: "/images/contact-icon-office.svg",
  },
  {
    title: "Media Relations",
    value: "media@iilp.org",
    timing: "Press and Communications",
    iconAlt: "Media Icon",
    iconSrc: "/images/contact-icon-media.svg",
  },
];

interface ContactCardProps {
  iconSrc?: string;
  iconAlt?: string;
  title: string;
  timing: string;
  value: string;
  link?: string;
  nodeId?: string;
}

function getFallbackIcon(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("mail")) return "/images/contact-icon-email.svg";
  if (lower.includes("phone") || lower.includes("call"))
    return "/images/contact-icon-phone.svg";
  if (lower.includes("office") || lower.includes("location") || lower.includes("address"))
    return "/images/contact-icon-office.svg";
  return "/images/contact-icon-media.svg";
}

function ContactCard({
  iconSrc,
  iconAlt,
  title,
  timing,
  value,
  link,
  nodeId,
}: ContactCardProps) {
  const finalIconSrc = iconSrc || getFallbackIcon(title);
  const isRemote =
    finalIconSrc.startsWith("http://") || finalIconSrc.startsWith("https://");

  const renderValue = () => {
    if (link) {
      return (
        <a
          href={link}
          target={link.startsWith("http") ? "_blank" : undefined}
          rel={link.startsWith("http") ? "noopener noreferrer" : undefined}
          className="hover:text-[#00698c] transition-colors break-words"
        >
          {value}
        </a>
      );
    }

    if (value.includes("@") && !value.includes(" ")) {
      return (
        <a
          href={`mailto:${value}`}
          className="hover:text-[#00698c] transition-colors break-words"
        >
          {value}
        </a>
      );
    }

    const isPhone =
      title.toLowerCase().includes("phone") ||
      title.toLowerCase().includes("call") ||
      /^[+\d\s()-]{7,}$/.test(value.trim());

    if (isPhone) {
      return (
        <a
          href={`tel:${value.replace(/[^\d+]/g, "")}`}
          className="hover:text-[#00698c] transition-colors whitespace-nowrap"
        >
          {value}
        </a>
      );
    }

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#00698c] transition-colors break-words"
        >
          {value}
        </a>
      );
    }

    return (
      <p className="leading-[1.3] text-[20px] sm:text-[22px] break-words">
        {value}
      </p>
    );
  };

  return (
    <div
      className="bg-white flex flex-col justify-between gap-[40px] lg:gap-[60px] h-full items-start overflow-hidden p-[28px] sm:p-[32px] relative shadow-xs hover:shadow-md transition-shadow flex-1 w-full rounded-2xl border border-sky-100/60"
      data-node-id={nodeId}
    >
      {/* Icon: 40x40 dark teal container */}
      <div className="bg-[#00506b] rounded-lg flex items-center justify-center relative shrink-0 size-[44px] shadow-2xs">
        <div className="relative shrink-0 size-[24px]">
          <Image
            src={finalIconSrc}
            alt={iconAlt || title}
            width={24}
            height={24}
            unoptimized={isRemote}
            className="block size-full object-contain"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
        <div className="flex flex-col gap-[6px] items-start justify-center relative shrink-0 w-full">
          {/* Subheading: 24px */}
          <h3 className="font-serif font-bold text-[#0a0d12] text-[22px] sm:text-[24px] leading-snug">
            {title}
          </h3>
          {/* Paragraph: 15-16px text-[#414651] */}
          <p className="font-sans font-normal leading-[24px] text-[15px] sm:text-[16px] text-[#414651]">
            {timing}
          </p>
        </div>

        {/* Highlighted Value: 20-22px text-[#0a0d12] tracking-[-0.5px] */}
        <div className="font-sans font-medium text-[19px] sm:text-[21px] leading-[30px] sm:leading-[32px] text-[#0a0d12] tracking-[-0.5px] w-full">
          {renderValue()}
        </div>
      </div>
    </div>
  );
}

interface ContactInfoGridProps {
  data?: Partial<PageSectionData>;
}

export function ContactInfoGrid({ data }: ContactInfoGridProps = {}) {
  const badge = data?.badge || "Reach Us";
  const title = data?.title || "Contact Information";

  const rawCards = (data?.metadata as any)?.cards;
  const cards: ContactInfoCardItem[] =
    Array.isArray(rawCards) && rawCards.length > 0 ? rawCards : defaultContactCards;

  return (
    <section
      className="bg-[#e6f9ff] flex flex-col gap-10 sm:gap-[60px] lg:gap-[80px] items-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] py-12 sm:py-20 lg:py-[140px] relative w-full"
      data-node-id="150:72328"
      data-name="Contact Information Grid"
    >
      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-8 sm:gap-[60px] lg:gap-[80px] items-center">
        {/* Header Container */}
        <div
          className="flex flex-col gap-3 sm:gap-4 items-center relative shrink-0 w-full text-center"
          data-node-id="150:72329"
        >
          {/* Pill Badge */}
          <div
            className="border border-[#00698c] border-solid flex flex-col items-start px-3.5 py-1.5 sm:px-[14px] sm:py-[6px] relative rounded-full shrink-0 bg-white/40"
            data-node-id="150:72330"
          >
            <span
              className="font-sans font-semibold leading-tight sm:leading-[17.6px] text-[#0a0d12] text-xs sm:text-[15px] uppercase tracking-wider text-center"
              data-node-id="150:72332"
            >
              {badge}
            </span>
          </div>

          {/* Title */}
          <h2
            className="font-serif font-medium leading-snug sm:leading-[44px] text-[#0a0d12] text-2xl sm:text-4xl lg:text-[36px] text-center tracking-[-0.72px] max-w-[680px]"
            data-node-id="150:72333"
          >
            {title}
          </h2>
        </div>

        {/* Cards Grid Container */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-[24px] items-stretch relative shrink-0 w-full"
          data-node-id="150:73332"
        >
          {cards.map((card, idx) => (
            <ContactCard
              key={`${card.title}-${idx}`}
              nodeId={`contact-card-${idx}`}
              iconSrc={card.iconSrc}
              iconAlt={card.iconAlt || `${card.title} Icon`}
              title={card.title}
              timing={card.timing}
              value={card.value}
              link={card.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
