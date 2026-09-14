import Link from 'next/link';
import Image from 'next/image';

export function AcademicPrograms() {
  const departments = [
    {
      number: "01",
      title: "Law & International Legal Studies",
      description: "Advancing legal scholarship, international law, and justice systems in a changing global order.",
      isActive: false
    },
    {
      number: "02",
      title: "Political Science & Governance",
      description: "Examining governance frameworks, democratic institutions, and political systems worldwide.",
      isActive: true
    },
    {
      number: "03",
      title: "Human Rights & Humanitarian Studies",
      description: "Promoting human dignity, rights-based approaches, and humanitarian action globally.",
      isActive: false
    }
  ];

  return (
    <section className="w-full bg-[#e6f9ff] py-16 lg:py-[140px] px-4 md:px-8 lg:px-12 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center gap-[60px] lg:gap-[80px]">
        
        {/* Header */}
        <div className="flex flex-col items-center max-w-[680px] text-center gap-4">
          <div className="border border-[#00698c] rounded-full px-[12px] py-[8px]">
            <span className="font-inter font-semibold text-[16px] leading-[17.6px] uppercase text-[#0a0d12]">
              Academic Programs
            </span>
          </div>

          <h2 className="font-playfair font-medium text-3xl md:text-4xl lg:text-[36px] leading-[1.25] lg:leading-[44px] tracking-[-0.72px] text-[#0a0d12] max-w-[580px]">
            Six Academic Departments
          </h2>

          <p className="font-inter font-normal text-base md:text-lg lg:text-[20px] leading-relaxed lg:leading-[30px] text-[#0a0d12]">
            Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] w-full">
          {departments.map((dept, index) => (
            <Link 
              key={index} 
              href="/academics" 
              className="flex flex-col gap-[30px] items-center w-full group cursor-pointer"
            >
              <div className="relative w-full aspect-[413/390] overflow-visible">
                <div className="absolute inset-0 overflow-hidden">
                  <Image 
                    src="/assets/academic-thumbnail-1.png" 
                    alt={dept.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                {/* Number Badge */}
                <div className={`absolute top-[20px] left-[20px] w-[91px] h-[92px] flex items-center justify-center font-inter font-semibold text-[32px] leading-[41.6px] transition-colors duration-300 z-10
                  ${dept.isActive 
                    ? 'bg-[#00bfff] text-white' 
                    : 'bg-[#e6f9ff] text-[#00bfff] group-hover:bg-[#00bfff] group-hover:text-white'
                  }`}
                >
                  {dept.number}
                </div>

                {/* Arrow Button (Active / Hover State) */}
                <div className={`absolute -bottom-4 -right-4 w-12 h-12 bg-[#f9fafb] border border-[#e5e7eb] rounded-full flex items-center justify-center shadow-sm z-20 transition-all duration-300 group-hover:scale-110
                  ${dept.isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <Image 
                    src="/assets/academic-arrow-right.svg" 
                    alt="Arrow Right" 
                    width={24} 
                    height={24} 
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-[10px] items-start justify-center w-full">
                <h3 className={`font-['Soria',var(--font-playfair),serif] font-bold text-[24px] leading-[32px] transition-colors duration-300
                  ${dept.isActive ? 'text-[#00bfff]' : 'text-[#111111] group-hover:text-[#00bfff]'}`}
                >
                  {dept.title}
                </h3>
                <p className="font-source font-normal text-[18px] leading-[28px] text-[#666666]">
                  {dept.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Button */}
        <Link 
          href="/academics" 
          className="inline-flex items-center justify-center rounded-full bg-[#00bfff] hover:bg-[#00a2d6] px-[24px] py-[14px] shadow-sm transition-colors"
        >
          <span className="font-source font-semibold text-white text-[16px] leading-[24px]">
            Explore All Departments
          </span>
        </Link>

      </div>
    </section>
  );
}
