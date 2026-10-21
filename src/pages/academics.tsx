import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import AcademicProgramsHero from "@/modules/academics/components/AcademicProgramsHero";
import AcademicDepartments from "@/modules/academics/components/AcademicDepartments";
import ApplyAcademicProgram from "@/modules/academics/components/ApplyAcademicProgram";
import { usePageContent } from "@/common/hooks/usePageContent";
import { fetchDepartments, DepartmentItem } from "@/common/services/departments.service";
import AcademicsSkeleton from "@/modules/academics/components/AcademicsSkeleton";

export default function AcademicsPage() {
  const { getSection, isLoading: isContentLoading } = usePageContent("academics");
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isDeptsLoading, setIsDeptsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchDepartments({ activeOnly: true })
      .then((items) => {
        if (active && Array.isArray(items)) {
          setDepartments(items);
        }
      })
      .catch((err) => {
        console.warn("[AcademicsPage] Failed to fetch departments:", err);
      })
      .finally(() => {
        if (active) {
          setIsDeptsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const isLoading = isContentLoading || isDeptsLoading;

  return (
    <>
      <Head>
        <title>Academic Programs | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Explore IILP's academic programs, departments, and courses in law, governance, human rights, and international policy."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <AcademicsSkeleton />
          ) : (
            <>
              <AcademicProgramsHero data={getSection("hero")} />
              <AcademicDepartments
                data={getSection("departments_intro")}
                departments={departments}
              />
              <ApplyAcademicProgram data={getSection("apply_program_banner")} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}

