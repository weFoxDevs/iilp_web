import Image from 'next/image';
import { PageSectionData } from '@/common/services/cms.service';

interface AboutFounderMessageProps {
  data?: Partial<PageSectionData>;
}

const defaultParagraphs = [
  'It is with profound pleasure and immense honor that I welcome you to the International Institute for Law and Politics (IILP) — a vibrant community committed to the creation of knowledge, rigorous scholarship, profound insights, and impactful engagement with the critical legal, political, humanitarian, and socio-economic issues defining our times. IILP was established upon a straightforward yet ambitious principle: knowledge must serve humanity. Knowledge is power, and that power cannot be siloed within academia or confined to intellectual discussions alone. It must be applied effectively to fight injustice, foster democracy, uphold human dignity, and seek solutions to the global challenges impacting communities across the globe, with a dedicated focus on displaced and refugee populations.',
  'My own experience — having lived through the Rohingya genocide and experienced life as a refugee — impelled me to create IILP. I profoundly understand the consequences of institution failure to protect the vulnerable, and the transformative potential of knowledge in service of justice. We live in times of immense change and uncertainty. Conflict, war, genocide, persecution, political violence, displacement, statelessness, inequity, failed governance, humanitarian crises, and violations of basic human rights continue to challenge communities worldwide. Addressing these complexities cannot be solely a matter of good intentions; it demands rigorous scholarship, responsible leadership, data-driven policies, interdisciplinary approaches, and an unyielding dedication to ethical public service. IILP serves as a central hub where scholars, researchers, students, policymakers, practitioners, and leaders, including young activists and future leaders, come together to exchange knowledge, build capacity, and contribute to a more just, equitable, and sustainable global future for all, particularly for those displaced or seeking refuge.',
  'IILP operates under the highest standards of research, intellectual inquiry, and academic integrity, complemented by an unwavering commitment to professionalism and excellence. We foster a culture that celebrates learning, creativity, collaboration, and civic engagement through our programs, publications, conferences, workshops, policy dialogues, training sessions, and partnerships. We firmly believe that law, politics, governance, human rights, and societal development are inextricably linked and that lasting change arises from integrative strategies that draw upon diverse perspectives and dialogue across academic disciplines, geographic regions, and cultural diversities.',
  'I encourage you to join our collective mission. Whether you are an esteemed professor, an aspiring scholar or student, a dedicated researcher, a seasoned policy practitioner, a grassroots activist, a collaborating organization or institution, a funding partner, or simply a concerned individual passionate about making a difference in the world, your involvement is invaluable to creating a better, more informed, more equitable, and more compassionate future. Together, we will convert knowledge into impactful action, bright ideas into lasting solutions, and devoted leadership into transformative and sustainable change.',
];

export default function AboutFounderMessage({ data }: AboutFounderMessageProps) {
  const badge = data?.badge ?? 'From the Founder';
  const title = data?.title ?? "Founder's Message";
  const bgImage = data?.bgImage || '/assets/about-institutional-2.png';

  const meta = (data?.metadata || {}) as {
    founderName?: string;
    founderRole?: string;
    founderInitials?: string;
    signatureImage?: string;
    paragraphs?: string[];
  };

  const founderName = meta.founderName || 'Mohammed Siraj';
  const founderRole = meta.founderRole || 'Founder & President, IILP';
  const founderInitials = meta.founderInitials || 'MS';
  const signatureImage = meta.signatureImage || '/assets/about-founder-signature.png';
  const paragraphs = meta.paragraphs || defaultParagraphs;

  return (
    <section className="w-full bg-white py-16 lg:py-[140px] px-4 md:px-8 lg:px-16 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4 items-center text-center">
          {badge && (
            <div className="inline-flex items-center border border-[#00698c] rounded-full px-3.5 py-1.5">
              <span className="text-xs md:text-sm font-semibold tracking-wider text-[#0a0d12] uppercase font-inter">
                {badge}
              </span>
            </div>
          )}

          <h2 className="text-3xl md:text-4xl lg:text-[36px] font-medium text-[#0a0d12] tracking-[-0.72px] font-serif leading-[1.25]">
            {title}
          </h2>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-[80px] w-full">
          
          {/* Left Column: Image, Signature Overlay, and Author Badge */}
          <div className="w-full lg:w-[480px] xl:w-[520px] flex flex-col gap-8 shrink-0 relative">
            <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[660px] overflow-hidden shadow-md">
              <Image
                src={bgImage}
                alt={founderName}
                fill
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover"
              />

              {/* Signature Overlay */}
              {signatureImage && (
                <div className="absolute right-2 bottom-4 w-48 h-32 sm:w-64 sm:h-44 pointer-events-none opacity-85">
                  <Image
                    src={signatureImage}
                    alt={`${founderName} signature`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Author Attribution */}
            <div className="flex items-center gap-3.5">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: 'linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)' }}
              >
                <span className="font-bold text-white text-base font-serif">{founderInitials}</span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif font-bold text-xl lg:text-[24px] text-[#000080] leading-tight">
                  {founderName}
                </h3>
                <p className="text-xs md:text-sm text-[#6a7282] font-inter">
                  {founderRole}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Decorative Quote + Full Letter */}
          <div className="flex-1 flex flex-col items-start w-full">
            {/* Decorative Quote Icon */}
            <div className="text-[72px] lg:text-[84px] leading-none text-[#000080] opacity-20 font-serif select-none -mb-4">
              &ldquo;
            </div>

            {/* Full Message Paragraphs */}
            <div className="text-[#000080] font-serif text-lg md:text-[21px] lg:text-[23px] leading-relaxed lg:leading-[36px] flex flex-col gap-6 tracking-[-0.01em]">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
