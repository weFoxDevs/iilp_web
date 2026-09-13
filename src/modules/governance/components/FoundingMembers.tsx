import Image from 'next/image';
import Link from 'next/link';

interface FoundingMember {
  name: string;
  role: string;
  image: string;
}

const FOUNDING_MEMBERS: FoundingMember[] = [
  {
    name: 'Mohammed Siraj',
    role: 'Founding Member',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'Mujibur Rahman',
    role: 'Founding Member',
    image: '/assets/governance-founding-member.png',
  },
  {
    name: 'MD. Mahamudun Noby Rupok',
    role: 'Founding Member',
    image: '/assets/governance-founding-member.png',
  },
];

export default function FoundingMembers() {
  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px] items-start lg:items-end justify-between w-full">
          <div className="flex-1 flex flex-col gap-4 items-start">
            <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
              <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                Founding Members
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[44px]">
              Board of Founding Members
            </h2>

            <p className="text-[#0a0d12] text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans max-w-[850px]">
              The Board of Founding Members comprises the individuals who supported the founder during the establishment process of the International Institute for Law and Politics and provided guidance on institutional, strategic, and organizational foundation.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/leadership-directory"
              className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans whitespace-nowrap"
            >
              View Leadership Directory
            </Link>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[24px] w-full">
          {FOUNDING_MEMBERS.map((member, index) => (
            <div key={index} className="flex flex-col items-start w-full group">
              <div className="relative w-full aspect-[277.5/370] overflow-hidden bg-gray-100">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-2.5 items-start mt-6 lg:mt-[30px] w-full">
                <h3 className="text-2xl lg:text-[24px] font-serif font-bold text-[#0a0d12] leading-tight">
                  {member.name}
                </h3>
                <p className="text-base md:text-[20px] text-[#414651] font-sans leading-[30px]">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
