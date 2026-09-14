import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import {
  ContactHero,
  ContactFormSection,
  ContactInfoGrid,
} from "@/modules/contact";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us | IILP - International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Get in touch with the International Institute for Law and Politics (IILP). Contact our team for academic inquiries, fellowship programs, institutional partnerships, or visit our campus."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#00506b]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Contact Page Content */}
        <main className="flex-grow">
          {/* Section 1: Hero Banner */}
          <ContactHero />

          {/* Section 2: Send a Message Form & Campus Map */}
          <ContactFormSection />

          {/* Section 3: Contact Information (4 Cards) */}
          <ContactInfoGrid />
        </main>

        {/* Section 4 & 5: CTA Banner + Institutional Footer */}
        <Footer withCta={true} />
      </div>
    </>
  );
}
