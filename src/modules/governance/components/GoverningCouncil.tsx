import Image from 'next/image';

interface CouncilResponsibility {
  number: string;
  text: string;
}

const RESPONSIBILITIES: CouncilResponsibility[] = [
  {
    number: '01',
    text: 'Approves institutional policies, regulations, and governance frameworks.',
  },
  {
    number: '02',
    text: 'Provides strategic direction and long-term institutional planning.',
  },
  {
    number: '03',
    text: 'Ensures accountability, transparency, and responsible institutional management.',
  },
  {
    number: '04',
    text: 'Oversees organizational growth, development, and sustainability.',
  },
  {
    number: '05',
    text: 'Safeguards academic quality, professional standards, and ethical integrity.',
  },
  {
    number: '06',
    text: 'Reviews major programs, partnerships, projects, and institutional initiatives.',
  },
  {
    number: '07',
    text: 'Supports resource mobilization and institutional capacity development.',
  },
  {
    number: '08',
    text: 'Monitors institutional performance and strategic progress.',
  },
];

export default function GoverningCouncil() {
  return (
    <section className="w-full bg-[#00506b] py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 lg:gap-[80px]">
        
        {/* Top Section: Heading + Image */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[120px]">
          {/* Content Block */}
          <div className="flex-1 flex flex-col gap-6 lg:gap-[30px] items-start">
            <div className="flex flex-col gap-4 items-start">
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                <span className="text-sm md:text-[16px] font-semibold tracking-wider text-white uppercase leading-[17.6px]">
                  Highest Governing Body
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-white tracking-[-0.72px] font-serif leading-[44px] max-w-[580px]">
                Governing Council
              </h2>
            </div>

            <p className="text-white/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans">
              The Governing Council serves as the highest governing and decision-making body of the Institute. It provides strategic leadership, policy oversight, and institutional accountability while ensuring that the Institute operates in accordance with its mission, objectives, and ethical principles.
            </p>
          </div>

          {/* Feature Image */}
          <div className="w-full lg:w-[500px] h-[360px] sm:h-[450px] lg:h-[520px] relative shrink-0 overflow-hidden">
            <Image
              src="/assets/governance-founding-authority.png"
              alt="Governing Council - Academic celebration"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Bottom Section: 8 Responsibilities in 2 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {RESPONSIBILITIES.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 border border-[#00698c] flex items-center gap-4 p-6 transition-colors hover:bg-white/[0.15]"
            >
              <span className="text-[#00bfff] text-4xl sm:text-5xl lg:text-[72px] font-bold leading-none tracking-[-1.44px] shrink-0 font-sans">
                {item.number}
              </span>
              <p className="text-white text-base md:text-[18px] leading-[28px] font-sans font-normal">
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
