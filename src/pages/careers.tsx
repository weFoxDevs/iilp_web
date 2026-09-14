import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { CareersHero, CareersMainSection } from "@/modules/careers";

export default function CareersPage() {
  return (
    <>
      <Head>
        <title>Careers / Work With Us | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Explore career opportunities at the International Institute for Law and Politics (IILP). Join our team of researchers, educators, administrators, and communicators committed to advancing global justice."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {/* Section 1: Hero Banner (Figma node 155:77146) */}
          <CareersHero />

          {/* Section 2: Opportunities & Expression of Interest Form (Figma node 155:77158) */}
          <CareersMainSection />
        </main>

        {/* Institutional Footer (Figma Frame 155:77145 renders Footer without CTA) */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
