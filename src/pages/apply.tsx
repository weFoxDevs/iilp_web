import React from "react";
import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import AdmissionHero from "@/modules/admissions/components/AdmissionHero";
import AdmissionCategories from "@/modules/admissions/components/AdmissionCategories";
import AdmissionApplicationSection from "@/modules/admissions/components/AdmissionApplicationSection";
import { usePageContent } from "@/common/hooks/usePageContent";
import FellowshipsSkeleton from "@/modules/fellowships/components/FellowshipsSkeleton";

interface ApplyPageProps {
  defaultTab?: "diploma" | "certificate" | "training" | "short-course";
}

export default function ApplyPage({
  defaultTab = "diploma",
}: ApplyPageProps) {
  const { getSection: getApplySection, isLoading } = usePageContent("apply");
  const { getSection: getAdmissionsSection } = usePageContent("admissions");
  const getSection = (key: string) => getApplySection(key) || getAdmissionsSection(key);
  const [selectedProgramType, setSelectedProgramType] = React.useState<string | undefined>(undefined);

  return (
    <>
      <Head>
        <title>Online Admission & Application Form | International Institute for Law and Politics (IILP)</title>
        <meta
          name="description"
          content="Apply online for IILP Academic Programs, Certificate Courses, Diploma Programs, and Professional Training in law, governance, human rights, and international policy."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <FellowshipsSkeleton />
          ) : (
            <>
              {/* Section 1: Hero Banner (identical layout & overlay to FellowshipHero) */}
              <AdmissionHero data={getSection("hero")} />

              {/* Section 2: Program Pathways Categories (identical layout & 3-col card to FellowshipCategories) */}
              <AdmissionCategories
                initialTab={defaultTab}
                data={getSection("pathways_intro") || getSection("categories")}
                onSelectProgramType={(type) => setSelectedProgramType(type)}
              />

              {/* Section 3: Online Application Form (identical bg-[#e6f9ff] & card to FellowshipApplication) */}
              <AdmissionApplicationSection
                data={getSection("application_cta") || getSection("application")}
                initialProgramType={selectedProgramType}
              />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
