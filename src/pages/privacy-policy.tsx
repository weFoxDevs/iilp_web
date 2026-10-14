import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import {
  PrivacyPolicyHero,
  PrivacyPolicyContent,
} from "@/modules/privacy";

import { GenericPageSkeleton } from "@/common/components/PageSkeletons";

export default function PrivacyPolicyPage() {
  const { getSection, isLoading } = usePageContent("privacy-policy");

  return (
    <>
      <Head>
        <title>Privacy Policy | IILP - International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Learn how the International Institute for Law and Politics (IILP) collects, uses, and protects your personal information."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {isLoading ? (
            <GenericPageSkeleton title="Privacy Policy" />
          ) : (
            <>
              {/* Hero Section (Figma node 150:74268) */}
              <PrivacyPolicyHero data={getSection("hero")} />

              {/* Policy Body Content (Figma node 150:74280) */}
              <PrivacyPolicyContent
                data={getSection("policy_sections") || getSection("content")}
              />
            </>
          )}
        </main>

        {/* Institutional Footer (Figma Frame 150:74267 renders Footer without CTA) */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
