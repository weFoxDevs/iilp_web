import Image from "next/image";

export function MissionVision() {
  const stats = [
    { number: "6+", label: "Academic Departments", progress: "58%" },
    { number: "18+", label: "Leadership Positions", progress: "58%" },
    { number: "3+", label: "Fellowship Types", progress: "58%" },
    { number: "5+", label: "Partnership Tracks", progress: "58%" },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 lg:gap-[120px]">
        
        {/* Top Two-Column Grid for Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[80px] items-start">
          
          {/* Column 1 (Left): Image on top, Mission Content on bottom */}
          <div className="flex flex-col gap-12 lg:gap-[120px]">
            {/* Top: Image with Overlapping Badges */}
            <div className="relative w-full aspect-[540/600] overflow-hidden">
              <Image
                src="/assets/about-vision-students.png"
                alt="IILP Students on campus"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
                priority
              />

              {/* Overlapping Award Badges at top-left */}
              <div className="absolute top-5 left-5 flex items-center">
                {/* Badge 1: Ultra Award */}
                <div className="w-[75px] h-[75px] sm:w-[100px] sm:h-[100px] rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
                  <div className="relative w-[45px] sm:w-[60px] h-[24px] sm:h-[30px]">
                    <Image
                      src="/assets/about-vision-badge-1.svg"
                      alt="Ultra Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Badge 2: Hyper Best Award (overlaps badge 1) */}
                <div className="w-[75px] h-[75px] sm:w-[100px] sm:h-[100px] -ml-4 rounded-full bg-[#c3f499] flex items-center justify-center shadow-md">
                  <div className="relative w-[48px] sm:w-[63px] h-[24px] sm:h-[30px]">
                    <Image
                      src="/assets/about-vision-badge-2.svg"
                      alt="Hyper Best Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Our Mission Content */}
            <div className="flex flex-col gap-[30px] items-start">
              <div className="inline-flex items-center border border-[#00698c] rounded-[1000px] px-[12px] py-[8px]">
                <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                  Our Mission
                </span>
              </div>

              <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12]">
                Advancing Interdisciplinary Scholarship
              </h2>

              <p className="font-source font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]/70">
                The mission of the International Institute for Law and Politics is to advance interdisciplinary scholarship, strengthen evidence-based policymaking, foster ethical leadership, and contribute to the development of informed and resilient institutions capable of addressing contemporary global challenges.
              </p>
            </div>
          </div>

          {/* Column 2 (Right): Vision Content on top, Image with Ratings on bottom */}
          <div className="flex flex-col gap-12 lg:gap-[120px] self-stretch justify-between">
            {/* Top: Our Vision Content */}
            <div className="flex flex-col gap-[30px] items-start">
              <div className="inline-flex items-center border border-[#00698c] rounded-[1000px] px-[12px] py-[8px]">
                <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
                  Our Vision
                </span>
              </div>

              <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12]">
                A Globally Respected Centre of Excellence
              </h2>

              <p className="font-source font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]/70">
                To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.
              </p>
            </div>

            {/* Bottom: Image with Student Ratings Card */}
            <div className="relative w-full aspect-[540/600] lg:aspect-[580/690] overflow-hidden">
              <Image
                src="/assets/about-mission-student.png"
                alt="Student with laptop and phone"
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
                priority
              />

              {/* Floating Ratings Card */}
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-black/45 backdrop-blur-md border border-white/20 rounded-[10px] p-[15px] flex items-center gap-[15px] shadow-xl w-[290px] h-[80px]">
                {/* Overlapping Avatars */}
                <div className="relative flex items-center -space-x-2.5">
                  <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-1.png"
                      alt="Student reviewer 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-2.png"
                      alt="Student reviewer 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden border border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-3.png"
                      alt="Student reviewer 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Rating details */}
                <div className="flex flex-col font-inter text-white">
                  <span className="font-normal text-[16px] leading-[16px]">5000</span>
                  <span className="font-normal text-[16px] leading-[16px] text-white/90 mt-[5px]">Student ratings</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12 w-full pt-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-[40px] items-start max-w-[243px] w-full">
              {/* Number and Label container */}
              <div className="flex flex-col gap-[5px] items-start w-full">
                <div className="font-inter font-semibold text-4xl sm:text-5xl lg:text-[64px] leading-none text-[#00506b]">
                  {stat.number}
                </div>
                <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-snug lg:leading-[30px] text-[#0a0d12]/70">
                  {stat.label}
                </p>
              </div>

              {/* Progress Line */}
              <div className="w-full max-w-[243px] h-[2px] bg-[#8ae2ff] relative overflow-hidden">
                <div
                  className="h-full bg-[#00506b]"
                  style={{ width: stat.progress }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
