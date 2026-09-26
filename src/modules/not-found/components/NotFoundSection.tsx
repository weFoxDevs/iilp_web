import React from "react";
import Image from "next/image";
import Link from "next/link";

export function NotFoundSection() {
  return (
    <section
      className="bg-white flex flex-col items-center pt-8 sm:pt-12 lg:pt-[60px] pb-12 sm:pb-24 lg:pb-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] w-full text-center"
      data-node-id="150:74074"
      data-name="Academic Programs"
    >
      {/* 404 Illustration matching Figma node 150:74182 */}
      <div
        className="relative w-full max-w-[568px] h-[220px] sm:h-[340px] md:h-[400px] shrink-0 mb-6 sm:mb-8 flex items-center justify-center"
        data-node-id="150:74182"
        data-name="image 2 [Vectorized]"
      >
        <Image
          src="/images/404-illustration.svg"
          alt="404 Page Not Found"
          width={568}
          height={400}
          priority
          className="w-full h-full object-contain"
        />
      </div>

      {/* Main Container matching Figma node 150:74245 */}
      <div
        className="flex flex-col gap-6 sm:gap-12 lg:gap-[56px] items-center justify-center w-full max-w-[1080px] mx-auto"
        data-node-id="150:74245"
        data-name="Container"
      >
        <div
          className="flex flex-col gap-4 sm:gap-6 items-center"
          data-node-id="150:74246"
        >
          {/* Pill Badge (Figma node 150:74247) */}
          <div
            className="bg-[rgba(230,249,255,0.1)] border border-[#33ccff] rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 flex items-center justify-center"
            data-node-id="150:74247"
          >
            <span
              className="font-sans font-semibold text-xs sm:text-sm md:text-base text-[#0a0d12] uppercase tracking-wider leading-[17.6px]"
              data-node-id="150:74249"
            >
              Error
            </span>
          </div>

          {/* Heading & Subtitle (Figma node 150:74250) */}
          <div
            className="flex flex-col gap-3 sm:gap-4 items-center"
            data-node-id="150:74250"
          >
            {/* Title (Figma node 150:74253) */}
            <h1
              className="font-serif font-medium text-2xl sm:text-4xl lg:text-[36px] text-[#0a0d12] text-center tracking-tight sm:tracking-[-0.72px] leading-tight lg:leading-[44px]"
              data-node-id="150:74253"
            >
              Sorry. Page Not Found!
            </h1>

            {/* Description (Figma node 150:74255) */}
            <p
              className="font-sans font-normal text-base sm:text-lg lg:text-[20px] text-[#0a0d12]/80 text-center leading-relaxed lg:leading-[30px] max-w-[800px]"
              data-node-id="150:74255"
            >
              The page you are looking for doesn&apos;t exist or has been moved
            </p>
          </div>
        </div>

        {/* Action Buttons matching Figma node 150:74256 */}
        <div
          className="flex flex-col sm:flex-row gap-3 sm:gap-[12px] items-center justify-center w-full sm:w-auto"
          data-node-id="150:74256"
          data-name="Actions"
        >
          {/* Back to Home Page (Figma node 150:74257) */}
          <Link
            href="/"
            className="bg-[#00bfff] hover:bg-[#009ecc] active:bg-[#0088b3] text-white drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex gap-2 items-center justify-center px-6 py-3.5 rounded-full transition-all w-full sm:w-auto text-center"
            data-node-id="150:74257"
            data-name="Button"
          >
            <div className="relative shrink-0 w-5 h-5 flex items-center justify-center">
              <Image
                src="/icons/arrow-left-white.svg"
                alt="Arrow Left"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
            </div>
            <span className="font-sans font-semibold text-base leading-6 text-white whitespace-nowrap">
              Back to home page
            </span>
          </Link>

          {/* Contact Us (Figma node 150:74258) */}
          <Link
            href="/contact"
            className="bg-[#f9fafb] hover:bg-gray-100 active:bg-gray-200 border border-[#e5e7eb] drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)] flex items-center justify-center px-6 py-3.5 rounded-full transition-all w-full sm:w-auto text-center"
            data-node-id="150:74258"
            data-name="Button"
          >
            <span className="font-sans font-semibold text-base leading-6 text-[#4a5565] whitespace-nowrap">
              Contact us
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
