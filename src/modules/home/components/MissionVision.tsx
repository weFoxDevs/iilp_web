import Image from "next/image";

export function MissionVision() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-32">
          
          {/* Mission Section */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 relative aspect-[4096/2731] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/assets/mission-img.png" 
                alt="Our Mission" 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all">
                  <div className="w-16 h-16 bg-[#C3F499] rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3l14 9-14 9V3z" fill="#0A0D12" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <div className="inline-block border border-[#00698C] rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#0A0D12] text-sm font-semibold uppercase tracking-wide">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-medium font-serif text-[#0A0D12] mb-6 leading-tight">
                Advancing Interdisciplinary Scholarship
              </h2>
              <p className="text-xl text-[#0A0D12]/70 leading-relaxed">
                The mission of the International Institute for Law and Politics is to advance interdisciplinary scholarship, strengthen evidence-based policymaking, foster ethical leadership, and contribute to the development of informed and resilient institutions capable of addressing contemporary global challenges.
              </p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-24">
            <div className="w-full lg:w-1/2 relative aspect-[2731/4096] rounded-2xl overflow-visible">
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                <Image 
                  src="/assets/vision-img.png" 
                  alt="Our Vision" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Overlay Card */}
              <div className="absolute -bottom-10 left-10 lg:-bottom-12 lg:-left-12 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4 shadow-2xl z-10 w-72">
                <div className="flex -space-x-3">
                  <Image src="/assets/avatar-1.png" alt="Student" width={48} height={48} className="rounded-full border-2 border-white object-cover" />
                  <Image src="/assets/avatar-2.png" alt="Student" width={48} height={48} className="rounded-full border-2 border-white object-cover" />
                  <Image src="/assets/avatar-3.png" alt="Student" width={48} height={48} className="rounded-full border-2 border-white object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-lg">5000</span>
                  <span className="text-white/80 text-sm">Student ratings</span>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <div className="inline-block border border-[#00698C] rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#0A0D12] text-sm font-semibold uppercase tracking-wide">
                  Our Vision
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-medium font-serif text-[#0A0D12] mb-6 leading-tight">
                A Globally Respected Centre of Excellence
              </h2>
              <p className="text-xl text-[#0A0D12]/70 leading-relaxed">
                To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
