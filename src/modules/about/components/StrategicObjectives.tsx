import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface ObjectiveItem {
  num: string;
  text: string;
}

const defaultObjectives: ObjectiveItem[] = [
  {
    num: '01',
    text: 'Provide academic programs, training programs, and certificate courses, and establish partnerships with universities, international organizations, and civil society organizations.',
  },
  {
    num: '02',
    text: 'Advance high-quality academic and policy research in law, politics, governance, human rights, forced displacement and statelessness, humanitarian affairs, and social development.',
  },
  {
    num: '03',
    text: 'Promote intellectual inquiry and critical thinking through rigorous scholarship and interdisciplinary collaboration.',
  },
  {
    num: '04',
    text: 'Develop future scholars, researchers, policymakers, public servants, and leaders committed to ethical responsibility and public service.',
  },
  {
    num: '05',
    text: 'Encourage evidence-based policymaking and informed public dialogue on issues of national, regional, and global significance.',
  },
  {
    num: '06',
    text: 'Promote human rights, justice, accountability, inclusion, and democratic values.',
  },
  {
    num: '07',
    text: 'Strengthen collaboration among universities, research institutions, civil society organizations, international organizations, and policy networks.',
  },
  {
    num: '08',
    text: 'Support innovative approaches to addressing complex legal, political, and humanitarian challenges.',
  },
  {
    num: '09',
    text: 'Bridge the gap between research and practice by transforming knowledge into practical policy recommendations and institutional solutions.',
  },
  {
    num: '10',
    text: 'Foster international cooperation and intellectual exchange across cultures, disciplines, and regions.',
  },
];

interface StrategicObjectivesProps {
  data?: Partial<PageSectionData>;
}

export default function StrategicObjectives({ data }: StrategicObjectivesProps) {
  const badge = data?.badge ?? 'Our Vision';
  const title = data?.title ?? 'A Globally Respected Centre of Excellence';
  const subtitle =
    data?.subtitle ??
    'To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.';
  const bgImage = data?.bgImage || '/assets/about-objectives-graduation.png';

  const meta = (data?.metadata || {}) as {
    objectives?: ObjectiveItem[];
  };

  const objectives = meta.objectives || defaultObjectives;

  return (
    <section className="w-full bg-[#00506b] py-12 sm:py-20 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[240px] text-white">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16 lg:gap-[80px]">
        
        {/* Top Feature: Vision Text + Graduation Image */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-[120px]">
          
          {/* Left Text */}
          <div className="flex-1 flex flex-col gap-6 items-start">
            {badge && (
              <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
                <span className="text-xs md:text-sm font-semibold tracking-wider text-white uppercase font-inter">
                  {badge}
                </span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-medium text-white tracking-tight font-serif leading-[1.25]">
              {title}
            </h2>

            {subtitle && (
              <p className="text-white/70 text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] font-sans">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Image */}
          <div className="w-full lg:w-[500px] h-[250px] sm:h-[400px] lg:h-[520px] relative shrink-0 overflow-hidden shadow-2xl rounded-lg sm:rounded-none">
            <Image
              src={bgImage}
              alt="Graduating student embracing loved one"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Bottom: 10 Numbered Objective Cards (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">
          {objectives.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/10 border border-[#00698c] p-6 sm:p-7 lg:p-[30px] flex items-center gap-5 sm:gap-6 hover:bg-white/15 transition-all"
            >
              {/* Cyan Number */}
              <span className="text-[#00bfff] text-3xl sm:text-5xl lg:text-[72px] font-bold tracking-tight font-inter leading-none shrink-0 w-[45px] sm:w-[85px] lg:w-[100px] text-right">
                {item.num}
              </span>

              {/* Description */}
              <p className="flex-1 text-white text-sm sm:text-base lg:text-[18px] leading-relaxed lg:leading-[28px] font-sans">
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
