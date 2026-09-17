import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import { TermsHero, TermsContent } from "@/modules/terms";

export default function TermsOfUsePage() {
  const { getSection } = usePageContent("terms-of-use");

  return (
    <>
      <Head>
        <title>Terms of Use | IILP - International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Review the Terms and Conditions governing your use of the International Institute for Law and Politics (IILP) website and digital publications."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Hero Section (Figma node 155:75196) */}
          <TermsHero data={getSection("hero")} />

          {/* Terms Body Content (Figma node 155:75208) */}
          <TermsContent data={getSection("terms_sections")} />
        </main>

        {/* Institutional Footer (Figma Frame 155:75195 renders Footer without CTA) */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
