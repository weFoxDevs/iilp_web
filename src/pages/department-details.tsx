import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { CallToAction } from "@/common/components/CallToAction";
import DepartmentDetailsHero from "@/modules/departments/components/DepartmentDetailsHero";
import DepartmentOverview from "@/modules/departments/components/DepartmentOverview";
import DepartmentFaculty from "@/modules/departments/components/DepartmentFaculty";
import DepartmentAcademicPrograms from "@/modules/departments/components/DepartmentAcademicPrograms";

export default function DepartmentDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <DepartmentDetailsHero />
        <DepartmentOverview />
        <DepartmentFaculty />
        <DepartmentAcademicPrograms />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
