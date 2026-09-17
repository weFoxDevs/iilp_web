import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import { DonateHero, DonateMainSection } from "@/modules/donate";

export default function DonatePage() {
  const { getSection } = usePageContent("donate");

  return (
    <>
      <Head>
        <title>Donate &amp; Support IILP | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Support the International Institute for Law and Politics (IILP). Your donation empowers researchers, scholars, fellowships, and academic programs advancing justice and human rights globally."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Section 1: Hero Banner (Figma node 155:76236) */}
          <DonateHero data={getSection("hero")} />

          {/* Section 2: Why Give & Make a Gift Form (Figma node 155:76605) */}
          <DonateMainSection data={getSection("impact_intro")} />
        </main>

        {/* Institutional Footer (Figma Frame 155:76235 renders Footer without CTA) */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
