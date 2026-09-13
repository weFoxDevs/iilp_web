import Image from 'next/image';

export default function MissionAndVision() {
  const stats = [
    { number: '6+', label: 'Academic Departments', progress: '58%' },
    { number: '18+', label: 'Leadership Positions', progress: '58%' },
    { number: '3+', label: 'Fellowship Types', progress: '58%' },
    { number: '5+', label: 'Partnership Tracks', progress: '58%' },
  ];

  return (
    <section className="w-full bg-[#e6f9ff] py-16 lg:py-[140px] px-4 md:px-8 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 lg:gap-[120px]">
        
        {/* Top Two-Column Grid for Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[80px] items-start">
          
          {/* Column 1 (Left) */}
          <div className="flex flex-col gap-12 lg:gap-[80px]">
            {/* Top: Image with Badges */}
            <div className="relative w-full aspect-[540/600] overflow-hidden shadow-sm">
              <Image
                src="/assets/about-vision-students.png"
                alt="IILP Students on campus"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
              />

              {/* Overlapping Floating Award Badges */}
              <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex items-center">
                {/* Badge 1: Ultra Award */}
                <div className="w-[75px] h-[75px] sm:w-[95px] sm:h-[95px] rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
                  <div className="relative w-[45px] sm:w-[58px] h-[24px] sm:h-[30px]">
                    <Image
                      src="/assets/about-vision-badge-1.svg"
                      alt="Ultra Award"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Badge 2: Hyper Best (overlaps badge 1) */}
                <div className="w-[75px] h-[75px] sm:w-[95px] sm:h-[95px] -ml-4 rounded-full bg-[#c3f499] flex items-center justify-center shadow-md">
                  <div className="relative w-[48px] sm:w-[62px] h-[24px] sm:h-[30px]">
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
            <div className="flex flex-col gap-6 items-start">
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                  Our Mission
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[1.25]">
                Advancing Interdisciplinary Scholarship
              </h2>

              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans">
                The mission of the International Institute for Law and Politics is to advance interdisciplinary scholarship, strengthen evidence-based policymaking, foster ethical leadership, and contribute to the development of informed and resilient institutions capable of addressing contemporary global challenges.
              </p>
            </div>
          </div>

          {/* Column 2 (Right) */}
          <div className="flex flex-col gap-12 lg:gap-[80px]">
            {/* Top: Our Vision Content */}
            <div className="flex flex-col gap-6 items-start">
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                  Our Vision
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[1.25]">
                A Globally Respected Centre of Excellence
              </h2>

              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans">
                To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.
              </p>
            </div>

            {/* Bottom: Image with Student Ratings Card */}
            <div className="relative w-full aspect-[580/690] overflow-hidden shadow-sm">
              <Image
                src="/assets/about-mission-student.png"
                alt="Student with laptop and phone"
                fill
                sizes="(max-width: 1024px) 100vw, 580px"
                className="object-cover"
              />

              {/* Floating Ratings Card */}
              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-black/45 backdrop-blur-md border border-white/20 rounded-[10px] p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xl">
                {/* Overlapping Avatars */}
                <div className="flex items-center -space-x-3.5">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-1.png"
                      alt="Student reviewer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-2.png"
                      alt="Student reviewer"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/40">
                    <Image
                      src="/assets/about-rating-avatar-3.png"
                      alt="Student reviewer"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Rating details */}
                <div className="flex flex-col pl-1 font-inter text-white">
                  <span className="text-base sm:text-lg font-semibold leading-tight">5000</span>
                  <span className="text-xs sm:text-sm text-white/90 leading-tight">Student ratings</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10 pt-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-3.5">
              {/* Number */}
              <div className="text-4xl sm:text-5xl lg:text-[64px] font-semibold text-[#00506b] font-inter leading-none">
                {stat.number}
              </div>

              {/* Label */}
              <p className="text-[#0a0d12]/70 text-base md:text-lg lg:text-[20px] font-sans leading-snug">
                {stat.label}
              </p>

              {/* Progress Line */}
              <div className="w-full max-w-[243px] h-[2px] bg-[#8ae2ff] rounded-full overflow-hidden mt-2">
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
