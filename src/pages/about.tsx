import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";

import AboutHero from '@/modules/about/components/AboutHero';
import InstitutionalProfile from '@/modules/about/components/InstitutionalProfile';
import MissionAndVision from '@/modules/about/components/MissionAndVision';
import StrategicObjectives from '@/modules/about/components/StrategicObjectives';
import InstitutionalValues from '@/modules/about/components/InstitutionalValues';
import GlobalEngagement from '@/modules/about/components/GlobalEngagement';
import AboutFounderMessage from '@/modules/about/components/AboutFounderMessage';
import AboutGallery from '@/modules/about/components/AboutGallery';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <AboutHero />
        <InstitutionalProfile />
        <MissionAndVision />
        <StrategicObjectives />
        <InstitutionalValues />
        <GlobalEngagement />
        <AboutFounderMessage />
        <AboutGallery />
      </main>
      <Footer />
    </div>
  );
}
