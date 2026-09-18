import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { Hero } from "@/modules/home/components/Hero";
import { MissionVision } from "@/modules/home/components/MissionVision";
import { AcademicPrograms } from "@/modules/home/components/AcademicPrograms";
import { Events } from "@/modules/home/components/Events";
import { Testimonial } from "@/modules/home/components/Testimonial";
import { ImageGallery } from "@/modules/home/components/ImageGallery";
import { FellowshipNetwork } from "@/modules/home/components/FellowshipNetwork";
import { FounderMessage } from "@/modules/home/components/FounderMessage";
import { NewsMedia } from "@/modules/home/components/NewsMedia";
import { usePageContent } from "@/common/hooks/usePageContent";

export default function Home() {
  const { getSection } = usePageContent("home");

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans overflow-x-hidden">
      <Header />
      
      <main className="flex-grow overflow-x-hidden">
        <Hero data={getSection("hero")} />
        <MissionVision
          missionData={getSection("our_mission")}
          visionData={getSection("our_vision")}
        />
        <AcademicPrograms data={getSection("academic_programs")} />
        <Events data={getSection("events")} />
        <Testimonial />
        <ImageGallery data={getSection("image_gallery")} />
        <FellowshipNetwork data={getSection("fellowship_network")} />
        <FounderMessage data={getSection("founder_message")} />
        <NewsMedia data={getSection("news_media")} />
      </main>
      
      <Footer />
    </div>
  );
}
