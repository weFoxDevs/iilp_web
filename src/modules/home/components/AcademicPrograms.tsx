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
    <section className="bg-primary-50 py-20 lg:py-[140px] px-4 md:px-12 lg:px-[240px] flex flex-col items-center gap-[80px]">
      
      {/* Header */}
      <div className="flex flex-col items-center max-w-[680px] text-center gap-4">
        <div className="border border-primary-800 rounded-full px-3 py-2">
          <span className="text-gray-950 text-base font-semibold uppercase tracking-wide font-inter">
            Academic Programs
          </span>
        </div>
        <h2 className="font-playfair font-medium text-[36px] leading-[44px] text-gray-950 tracking-[-0.72px]">
          Six Academic Departments
        </h2>
        <p className="font-inter text-[20px] leading-[30px] text-gray-950">
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
              <div className={`absolute top-[20px] left-[20px] w-[91px] h-[92px] flex items-center justify-center font-semibold text-[32px] font-inter transition-colors duration-300 z-10
                ${dept.isActive 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-primary-50 text-primary-500 group-hover:bg-primary-500 group-hover:text-white'
                }`}
              >
                {dept.number}
              </div>

              {/* Arrow Button (Active/Hover State) */}
              <div className={`absolute right-0 bottom-[15px] translate-x-1/2 w-12 h-12 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-20 transition-opacity duration-300
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
              <h3 className={`font-playfair font-bold text-[24px] leading-[32px] transition-colors duration-300
                ${dept.isActive ? 'text-primary-500' : 'text-gray-950 group-hover:text-primary-500'}`}
              >
                {dept.title}
              </h3>
              <p className="font-inter text-[18px] text-gray-600 leading-[28px]">
                {dept.description}
              </p>
            </div>
            
          </div>
        ))}
      </div>

      {/* Explore Button */}
      <Link href="/academics" className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3.5 shadow-sm hover:bg-primary-600 transition-colors">
        <span className="font-inter font-semibold text-white text-[16px] leading-[24px]">
          Explore All Departments
        </span>
      </Link>
      
    </section>
  );
}
