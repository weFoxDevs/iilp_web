import Head from "next/head";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { NotFoundSection } from "@/modules/not-found";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="The page you are looking for doesn't exist or has been moved. Return to the International Institute for Law and Politics home page or contact our team."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* 404 Main Content */}
        <main className="flex-grow flex items-center justify-center">
          <NotFoundSection />
        </main>

        {/* Institutional Footer */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
