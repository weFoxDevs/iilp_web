import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import AcademicProgramsHero from "@/modules/academics/components/AcademicProgramsHero";
import AcademicDepartments from "@/modules/academics/components/AcademicDepartments";
import ApplyAcademicProgram from "@/modules/academics/components/ApplyAcademicProgram";
import { usePageContent } from "@/common/hooks/usePageContent";

export default function AcademicsPage() {
  const { getSection } = usePageContent("academics");

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
        <AcademicProgramsHero data={getSection("hero")} />
        <AcademicDepartments data={getSection("departments_intro")} />
        <ApplyAcademicProgram data={getSection("apply_program_banner")} />
      </main>
      <Footer />
    </div>
    </>
  );
}

