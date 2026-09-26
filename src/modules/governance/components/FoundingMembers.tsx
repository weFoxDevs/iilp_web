import Image from 'next/image';
import Link from 'next/link';
import { PageSectionData } from '@/common/services/cms.service';

interface FoundingMember {
  name: string;
  role: string;
  image: string;
}

const defaultFoundingMembers: FoundingMember[] = [
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

interface FoundingMembersProps {
  data?: Partial<PageSectionData>;
}

export default function FoundingMembers({ data }: FoundingMembersProps) {
  const badge = data?.badge ?? 'Founding Members';
  const title = data?.title ?? 'Board of Founding Members';
  const subtitle =
    data?.subtitle ??
    'The Board of Founding Members comprises the individuals who supported the founder during the establishment process of the International Institute for Law and Politics and provided guidance on institutional, strategic, and organizational foundation.';
  const actionText = data?.actionText ?? 'View Leadership Directory';
  const actionUrl = data?.actionUrl ?? '/leadership-directory';

  const membersList: FoundingMember[] =
    Array.isArray(data?.metadata?.members) && data.metadata.members.length > 0
      ? (data.metadata.members as FoundingMember[])
      : defaultFoundingMembers;

  return (
    <section className="w-full bg-white py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[80px] items-start lg:items-end justify-between w-full">
          <div className="flex-1 flex flex-col gap-4 items-start">
            {badge && (
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3 py-2">
                <span className="text-sm md:text-[16px] font-semibold tracking-wider text-[#0a0d12] uppercase leading-[17.6px]">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-tight font-serif leading-tight sm:leading-[44px]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-[#0a0d12] text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-normal font-sans max-w-[850px]">
                {subtitle}
              </p>
            )}
          </div>

          {actionText && (
            <div className="shrink-0 w-full sm:w-auto">
              <Link
                href={actionUrl}
                className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a8e0] text-white px-6 py-3.5 text-base font-semibold shadow-[0px_1px_2px_rgba(29,41,61,0.05)] transition-all font-sans whitespace-nowrap w-full sm:w-auto text-center"
              >
                {actionText}
              </Link>
            </div>
          )}
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[24px] w-full">
          {membersList.map((member, index) => (

            <div key={index} className="flex flex-col items-start w-full group">
              <div className="relative w-full aspect-[277.5/370] overflow-hidden bg-gray-100">
                <Image
                  src={member.image || '/assets/governance-founding-member.png'}
                  alt={member.name || 'Founding Member'}
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
