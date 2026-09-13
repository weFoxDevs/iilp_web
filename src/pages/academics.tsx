import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import AcademicProgramsHero from "@/modules/academics/components/AcademicProgramsHero";
import AcademicDepartments from "@/modules/academics/components/AcademicDepartments";
import ApplyAcademicProgram from "@/modules/academics/components/ApplyAcademicProgram";

export default function AcademicsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <AcademicProgramsHero />
        <AcademicDepartments />
        <ApplyAcademicProgram />
      </main>
      <Footer />
    </div>
  );
}
