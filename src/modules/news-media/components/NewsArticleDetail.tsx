import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function NewsArticleDetail() {
  return (
    <section className="bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-[80px] items-start">
        {/* Left Column: Article Content (900px) */}
        <div className="w-full lg:w-[900px] lg:max-w-[900px] flex flex-col gap-12 lg:gap-[80px] shrink-0">
          <div className="flex flex-col gap-[28px]">
            {/* Main Article Title */}
            <h1 className="font-serif font-medium text-2xl sm:text-3xl lg:text-[32px] text-[#12161a] tracking-[-1px] leading-tight lg:leading-[44.8px]">
              Student Clubs and Organizations You Should Join This Semester
            </h1>

            {/* Intro Paragraph */}
            <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
              College is more than just lectures and exams—it&apos;s also about growing personally,
              building networks, &amp; exploring new interests. One of the best ways to do that is by
              joining student clubs and organizations. Whether you&apos;re looking to develop leadership
              skills, dive into a passion, or simply meet new people, there’s something for everyone.
            </p>

            {/* Section: Academic and Professional Clubs */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Academic and Professional Clubs
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                These clubs align with your major or career goals—think Business Club, Engineering
                Society, or Debate Team. They host workshops, networking events, and guest lectures to
                help you prepare for your future.
              </p>
            </div>

            {/* Section: Cultural and Diversity Organizations */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Cultural and Diversity Organizations
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                Celebrate your heritage and learn about others through clubs that represent
                different cultures, religions, or languages. From international student associations
                to cultural dance troupes, these groups create inclusive spaces for sharing
                traditions and experiences.
              </p>
            </div>

            {/* Section: Creative and Performing Arts */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Creative and Performing Arts
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                Love to paint, sing, act, or write? Join a club that fuels your creative energy. Campus
                theater groups, music ensembles, photography clubs, or literary societies offer the
                chance to express yourself and collaborate with like-minded peers.
              </p>
            </div>

            {/* Section: Sports and Fitness Groups */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Sports and Fitness Groups
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                Whether you&apos;re into competitive sports or casual wellness, there’s something for
                every fitness level. Join intramural teams, dance squads, or yoga clubs to stay active
                and reduce stress.
              </p>
            </div>

            {/* Inline Featured Image (900px x 565.5px) */}
            <div className="pt-6 w-full">
              <div className="relative w-full aspect-[900/565.5] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                <Image
                  src="/assets/news-article-student.png"
                  alt="Student clubs and campus involvement"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
            </div>

            {/* Section: Social Impact and Volunteer Organizations */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Social Impact and Volunteer Organizations
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                Make a difference on campus and in your community by joining a club focused on
                volunteering, sustainability, mental health, or human rights. These groups often run
                awareness campaigns, fundraisers, and outreach programs.
              </p>
            </div>

            {/* Section: Tech and Innovation Societies */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Tech and Innovation Societies
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                If you&apos;re a tech enthusiast, coder, or entrepreneur, these clubs are perfect for
                honing your skills. Participate in hackathons, build projects, or work on startups
                with your peers.
              </p>
            </div>

            {/* Section: Student Government and Leadership Groups */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Student Government and Leadership Groups
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                Get involved in student governance or leadership development programs to represent
                your peers and make your voice heard in shaping campus policies and events.
              </p>
            </div>

            {/* Section: Final Thoughts */}
            <div className="flex flex-col gap-[12px]">
              <h2 className="font-serif font-bold text-[24px] text-[#12161a] leading-normal">
                Final Thoughts
              </h2>
              <p className="font-sans font-normal text-[16px] text-[#3b3b3b] leading-[27.2px]">
                No matter your interest or schedule, joining at least one club can open doors to
                friendships, growth, and unforgettable experiences. Don’t hesitate to attend club
                fairs or reach out to group leaders—you might just find your second home on campus.
              </p>
            </div>
          </div>

          {/* Author Block */}
          <div className="flex items-center gap-[16px] w-full">
            {/* Avatar Circle */}
            <div
              className="size-[50px] rounded-full flex items-center justify-center shrink-0"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)",
              }}
            >
              <span className="font-serif font-bold text-[20px] text-white leading-[28px]">
                MM
              </span>
            </div>

            {/* Author Information */}
            <div className="flex flex-col gap-[8px] items-start">
              <div className="border border-[#00698c] px-[8px] py-[2px] rounded-full">
                <span className="font-sans text-[12px] leading-[18px] text-[#0a0d12]">
                  Author
                </span>
              </div>
              <p className="font-serif font-bold text-[16px] text-[#0a0d12] leading-normal">
                Molla Bhai
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (460px) */}
        <div className="w-full lg:w-[460px] flex flex-col gap-[80px] shrink-0 sticky top-28">
          {/* Widget 1: Apply to IILP */}
          <div className="bg-[#00506b] border border-[#b0ebff] rounded-xl p-[30px] flex flex-col gap-[24px] text-white shadow-sm">
            <div className="flex flex-col gap-[16px]">
              <h3 className="font-serif font-bold text-[24px] text-white leading-normal">
                Apply to IILP
              </h3>
              <p className="font-sans text-[18px] leading-[28px] text-white">
                Take the next step toward advancing your legal education, research, and professional journey with IILP.
              </p>
            </div>
            <div className="flex gap-[12px] items-center w-full">
              <Link
                href="/fellowships#apply"
                className="flex-1 bg-[#00bfff] hover:bg-sky-400 text-white font-sans font-semibold text-[16px] py-[14px] px-[24px] rounded-full text-center transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
              >
                Apply Online
              </Link>
              <Link
                href="/contact"
                className="bg-[#f9fafb] hover:bg-white text-[#4a5565] border border-[#e5e7eb] font-sans font-semibold text-[16px] py-[14px] px-[24px] rounded-full text-center transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Widget 2: Publications & Research */}
          <div className="border border-[#b0ebff] rounded-xl p-[30px] flex flex-col gap-[24px] bg-white shadow-sm">
            <div className="flex flex-col gap-[16px]">
              <h3 className="font-serif font-bold text-[24px] text-[#000080] leading-normal">
                Publications &amp; Research
              </h3>
              <p className="font-sans text-[18px] leading-[28px] text-[#00506b]">
                Department publications, working papers, and research outputs are available in the Research &amp; Publications section.
              </p>
            </div>
            <div>
              <Link
                href="/publications"
                className="inline-block bg-[#00bfff] hover:bg-sky-400 text-white font-sans font-semibold text-[16px] py-[14px] px-[24px] rounded-full text-center transition-colors drop-shadow-[0px_1px_0.25px_rgba(29,41,61,0.02)]"
              >
                View Research
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
