import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { CallToAction } from "@/common/components/CallToAction";
import DepartmentDetailsHero from "@/modules/departments/components/DepartmentDetailsHero";
import DepartmentOverview from "@/modules/departments/components/DepartmentOverview";
import DepartmentFaculty from "@/modules/departments/components/DepartmentFaculty";
import DepartmentAcademicPrograms from "@/modules/departments/components/DepartmentAcademicPrograms";
import { fetchDepartmentByIdOrSlug, DepartmentItem } from "@/common/services/departments.service";

export default function DepartmentDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [department, setDepartment] = useState<DepartmentItem | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    let isMounted = true;
    fetchDepartmentByIdOrSlug(id)
      .then((data) => {
        if (isMounted && data) {
          setDepartment(data);
        }
      })
      .catch((err) => {
        console.warn("[DepartmentDetailsPage] Failed to fetch department:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <>
      <Head>
        <title>{department?.name ? `${department.name} | IILP` : "Department Details | IILP"}</title>
        {department?.description && <meta name="description" content={department.description} />}
      </Head>
      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          <DepartmentDetailsHero department={department} />
          <DepartmentOverview department={department} />
          <DepartmentFaculty />
          <DepartmentAcademicPrograms />
        </main>
        <Footer />
      </div>
    </>
  );
}
