import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import AcademicProgramsHero from "@/modules/academics/components/AcademicProgramsHero";
import AcademicDepartments from "@/modules/academics/components/AcademicDepartments";
import ApplyAcademicProgram from "@/modules/academics/components/ApplyAcademicProgram";
import { usePageContent } from "@/common/hooks/usePageContent";

export default function AcademicsPage() {
  const { getSection } = usePageContent("academics");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <AcademicProgramsHero data={getSection("hero")} />
        <AcademicDepartments data={getSection("departments_intro")} />
        <ApplyAcademicProgram data={getSection("apply_program_banner")} />
      </main>
      <Footer />
    </div>
  );
}

