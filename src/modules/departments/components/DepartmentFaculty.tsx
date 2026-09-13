import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FacultyMember {
  id: string;
  name: string;
  role: string;
  image: string;
}

const facultyMembers: FacultyMember[] = [
  {
    id: "siraj-1",
    name: "Mohammed Siraj",
    role: "Head of Law and International Legal Studies",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "mujibur-1",
    name: "Mujibur Rahman",
    role: "Founding Member",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "hasan-1",
    name: "MD Mahamodul Hasan",
    role: "Founding Member",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "siraj-2",
    name: "Mohammed Siraj",
    role: "Head of Law and International Legal Studies",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "mujibur-2",
    name: "Mujibur Rahman",
    role: "Founding Member",
    image: "/assets/department-faculty-member.png",
  },
  {
    id: "hasan-2",
    name: "MD Mahamodul Hasan",
    role: "Founding Member",
    image: "/assets/department-faculty-member.png",
  },
];

export default function DepartmentFaculty() {
  return (
    <section className="bg-[#e6f9ff] py-16 lg:py-[140px] px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 lg:gap-[80px]">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-4 items-start">
            {/* Pill Badge */}
            <div className="border border-[#00698c] rounded-full px-3 py-1.5">
              <span className="font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider text-[#0a0d12]">
                Departmental Leadership
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[36px] text-[#0a0d12] tracking-[-0.72px] leading-tight sm:leading-[44px]">
              Distinguished Faculty.
            </h2>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <Link
              href="/leadership-directory"
              className="inline-flex items-center justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base px-6 py-3.5 rounded-full drop-shadow-xs transition-colors duration-200"
            >
              View Leadership Directory
            </Link>
          </div>
        </div>

        {/* 6 Faculty Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-[24px]">
          {facultyMembers.map((member) => (
            <Link
              key={member.id}
              href="/leadership-directory"
              className="flex flex-col gap-[30px] group cursor-pointer"
            >
              {/* Photo Container */}
              <div className="aspect-[277.5/370] relative w-full overflow-hidden rounded-none bg-gray-200">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Info Container */}
              <div className="flex flex-col gap-2.5">
                <h3 className="font-serif font-bold text-xl sm:text-[24px] text-[#0a0d12] group-hover:text-[#00698c] transition-colors leading-snug">
                  {member.name}
                </h3>
                <p className="font-sans text-base sm:text-[20px] text-[#414651] leading-[30px]">
                  {member.role}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
