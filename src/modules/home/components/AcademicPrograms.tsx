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
    <section className="bg-[#E6F9FF] py-20 lg:py-[140px] px-4 md:px-12 lg:px-[240px] flex flex-col items-center gap-[80px]">
      
      {/* Header */}
      <div className="flex flex-col items-center max-w-[680px] text-center gap-4">
        <div className="border border-[#00698c] rounded-full px-3 py-2">
          <span className="text-[#0a0d12] text-base font-semibold uppercase tracking-wide">
            Academic Programs
          </span>
        </div>
        <h2 className="font-serif font-medium text-[36px] leading-[44px] text-[#0a0d12] tracking-[-0.72px]">
          Six Academic Departments
        </h2>
        <p className="font-sans text-[20px] leading-[30px] text-[#0a0d12]">
          Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] w-full">
        {departments.map((dept, index) => (
          <div key={index} className="flex flex-col gap-[30px] items-center w-full group cursor-pointer">
            
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
              <div className={`absolute top-[20px] left-[20px] w-[91px] h-[92px] flex items-center justify-center font-semibold text-[32px] transition-colors duration-300 z-10
                ${dept.isActive 
                  ? 'bg-[#00BFFF] text-white' 
                  : 'bg-[#E6F9FF] text-[#00BFFF] group-hover:bg-[#00BFFF] group-hover:text-white'
                }`}
              >
                {dept.number}
              </div>

              {/* Arrow Button (Active/Hover State) */}
              <div className={`absolute right-0 bottom-[15px] translate-x-1/2 w-12 h-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm z-20 transition-opacity duration-300
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
              <h3 className={`font-serif font-bold text-[24px] leading-[32px] transition-colors duration-300
                ${dept.isActive ? 'text-[#00BFFF]' : 'text-[#111] group-hover:text-[#00BFFF]'}`}
              >
                {dept.title}
              </h3>
              <p className="font-sans text-[18px] text-[#666] leading-[28px]">
                {dept.description}
              </p>
            </div>
            
          </div>
        ))}
      </div>

      {/* Explore Button */}
      <Link href="/academics" className="inline-flex items-center justify-center rounded-full bg-[#00BFFF] px-6 py-3.5 shadow-sm hover:bg-[#00a3d9] transition-colors">
        <span className="font-sans font-semibold text-white text-[16px] leading-[24px]">
          Explore All Departments
        </span>
      </Link>
      
    </section>
  );
}
