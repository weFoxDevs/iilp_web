import React from "react";
import Image from "next/image";
import Link from "next/link";

interface ContactCardProps {
  iconSrc: string;
  iconAlt: string;
  title: string;
  timing: string;
  nodeId: string;
  children: React.ReactNode;
}

function ContactCard({
  iconSrc,
  iconAlt,
  title,
  timing,
  nodeId,
  children,
}: ContactCardProps) {
  return (
    <div
      className="bg-white flex flex-col gap-[60px] lg:gap-[80px] h-full items-start overflow-hidden p-[28px] sm:p-[32px] relative shadow-xs hover:shadow-md transition-shadow flex-1 w-full"
      data-node-id={nodeId}
    >
      {/* Icon: 40x40 dark teal container */}
      <div className="bg-[#00506b] flex items-center justify-center relative shrink-0 size-[40px]">
        <div className="relative shrink-0 size-[24px]">
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={24}
            height={24}
            className="block size-full object-contain"
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-[20px] items-start justify-center relative shrink-0 w-full">
        <div className="flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-full">
          {/* Subheading: 24px */}
          <h3 className="font-serif font-bold text-[#0a0d12] text-[24px] leading-normal whitespace-nowrap">
            {title}
          </h3>
          {/* Paragraph: 16px text-[#414651] */}
          <p className="font-sans font-normal leading-[27.2px] text-[16px] text-[#414651] whitespace-nowrap">
            {timing}
          </p>
        </div>

        {/* Highlighted Value: 22px text-[#0a0d12] tracking-[-0.5px] */}
        <div className="font-sans font-medium text-[20px] sm:text-[22px] leading-[35.2px] text-[#0a0d12] tracking-[-0.5px] w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ContactInfoGrid() {
  return (
    <section
      className="bg-[#e6f9ff] flex flex-col gap-[60px] lg:gap-[80px] items-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] py-16 sm:py-24 lg:py-[140px] relative w-full"
      data-node-id="150:72328"
      data-name="Academic Programs"
    >
      <div className="max-w-[1440px] mx-auto w-full flex flex-col gap-[60px] lg:gap-[80px] items-center">
        {/* Header Container (Figma node 150:72329) */}
        <div
          className="flex flex-col gap-4 items-center relative shrink-0 w-full text-center"
          data-node-id="150:72329"
        >
          {/* Pill Badge (Figma node 150:72330) */}
          <div
            className="border border-[#00698c] border-solid flex flex-col items-start px-[12px] py-[8px] relative rounded-[1000px] shrink-0"
            data-node-id="150:72330"
          >
            <span
              className="font-sans font-semibold leading-[17.6px] text-[#0a0d12] text-[16px] uppercase whitespace-nowrap"
              data-node-id="150:72332"
            >
              Reach Us
            </span>
          </div>

          {/* Title (Figma node 150:72333) */}
          <h2
            className="font-serif font-medium leading-tight sm:leading-[44px] text-[#0a0d12] text-3xl sm:text-4xl lg:text-[36px] text-center tracking-[-0.72px] max-w-[580px]"
            data-node-id="150:72333"
          >
            Contact Information
          </h2>
        </div>

        {/* 4 Cards Grid Container (Figma node 150:73332) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[24px] items-stretch relative shrink-0 w-full"
          data-node-id="150:73332"
        >
          {/* Card 1: Call us */}
          <ContactCard
            nodeId="150:73333"
            iconSrc="/icons/contact/phone.svg"
            iconAlt="Call Icon"
            title="Call us"
            timing="Mon-Fri from 8am to 5pm."
          >
            <a
              href="tel:+15550000000"
              className="hover:text-[#00698c] transition-colors whitespace-nowrap"
            >
              +1 (555)000-0000
            </a>
          </ContactCard>

          {/* Card 2: Email us. */}
          <ContactCard
            nodeId="150:73347"
            iconSrc="/icons/contact/email.svg"
            iconAlt="Email Icon"
            title="Email us."
            timing="24/7 any day"
          >
            <a
              href="mailto:info@iilp.org"
              className="hover:text-[#00698c] transition-colors whitespace-nowrap"
            >
              info@iilp.org
            </a>
          </ContactCard>

          {/* Card 3: Office Address */}
          <ContactCard
            nodeId="150:73362"
            iconSrc="/icons/contact/location.svg"
            iconAlt="Location Pin Icon"
            title="Office Address"
            timing="Mon-Fri from 8am to 5pm."
          >
            <p className="leading-[1.3] text-[20px] sm:text-[22px]">
              International Institute for Law and Politics (IILP)
            </p>
          </ContactCard>

          {/* Card 4: Follow IILP */}
          <ContactCard
            nodeId="150:73384"
            iconSrc="/icons/contact/globe.svg"
            iconAlt="Globe Search Icon"
            title="Follow IILP"
            timing="Official Social Media"
          >
            <div
              className="flex gap-[12px] h-[18px] items-center pt-2 relative shrink-0"
              data-node-id="150:73414"
            >
              {/* Facebook */}
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow IILP on Facebook"
                className="flex items-center justify-center hover:opacity-75 transition-opacity"
                data-node-id="150:73415"
              >
                <Image
                  src="/icons/contact/fb.svg"
                  alt="Facebook"
                  width={20}
                  height={18}
                  className="w-[20px] h-[18px]"
                />
              </Link>

              {/* X / Twitter */}
              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow IILP on X"
                className="flex items-center justify-center hover:opacity-75 transition-opacity"
                data-node-id="150:73420"
              >
                <Image
                  src="/icons/contact/x.svg"
                  alt="X (Twitter)"
                  width={20}
                  height={18}
                  className="w-[20px] h-[18px]"
                />
              </Link>

              {/* Instagram */}
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow IILP on Instagram"
                className="flex items-center justify-center hover:opacity-75 transition-opacity"
                data-node-id="150:73425"
              >
                <Image
                  src="/icons/contact/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={18}
                  className="w-[20px] h-[18px]"
                />
              </Link>

              {/* LinkedIn */}
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow IILP on LinkedIn"
                className="flex items-center justify-center hover:opacity-75 transition-opacity"
                data-node-id="150:73430"
              >
                <Image
                  src="/icons/contact/linkedin.svg"
                  alt="LinkedIn"
                  width={20}
                  height={18}
                  className="w-[20px] h-[18px]"
                />
              </Link>
            </div>
          </ContactCard>
        </div>
      </div>
    </section>
  );
}
