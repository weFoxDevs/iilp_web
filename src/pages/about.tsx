import Head from "next/head";
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
import { usePageContent } from '@/common/hooks/usePageContent';

export default function AboutPage() {
  const { getSection } = usePageContent('about');

  return (
    <>
      <Head>
        <title>About IILP | International Institute for Law and Politics</title>
        <meta
          name="description"
          content="Learn about the International Institute for Law and Politics (IILP) — our mission, vision, institutional values, strategic objectives, and global engagement."
        />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow">
        <AboutHero data={getSection('hero')} />
        <InstitutionalProfile data={getSection('profile') || getSection('institutional_profile')} />
        <MissionAndVision
          missionData={getSection('our_mission')}
          visionData={getSection('our_vision')}
          data={getSection('mission_vision')}
        />
        <StrategicObjectives data={getSection('objectives') || getSection('strategic_objectives')} />
        <InstitutionalValues data={getSection('values') || getSection('institutional_values')} />
        <GlobalEngagement data={getSection('global_engagement')} />
        <AboutFounderMessage data={getSection('founder_message')} />
        <AboutGallery data={getSection('gallery')} />
      </main>
      <Footer />
    </div>
    </>
  );
}
