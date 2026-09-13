import React from "react";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import FellowshipHero from "@/modules/fellowships/components/FellowshipHero";
import FellowshipCategories from "@/modules/fellowships/components/FellowshipCategories";
import FellowshipApplication from "@/modules/fellowships/components/FellowshipApplication";
import { CallToAction } from "@/common/components/CallToAction";

interface FellowshipsPageProps {
  defaultTab?: "research" | "junior" | "honorary";
}

export default function FellowshipsPage({
  defaultTab = "research",
}: FellowshipsPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <FellowshipHero />
        <FellowshipCategories initialTab={defaultTab} />
        <FellowshipApplication />
      </main>
      <Footer />
    </div>
  );
}
