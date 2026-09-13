import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { Hero } from "@/modules/home/components/Hero";
import { MissionVision } from "@/modules/home/components/MissionVision";
import { Stats } from "@/modules/home/components/Stats";
import { AcademicPrograms } from "@/modules/home/components/AcademicPrograms";
import { Events } from "@/modules/home/components/Events";
import { Testimonial } from "@/modules/home/components/Testimonial";
import { ImageGallery } from "@/modules/home/components/ImageGallery";
import { FellowshipNetwork } from "@/modules/home/components/FellowshipNetwork";
import { FounderMessage } from "@/modules/home/components/FounderMessage";
import { NewsMedia } from "@/modules/home/components/NewsMedia";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <MissionVision />
        <Stats />
        <AcademicPrograms />
        <Events />
        <Testimonial />
        <ImageGallery />
        <FellowshipNetwork />
        <FounderMessage />
        <NewsMedia />
      </main>
      
      <Footer />
    </div>
  );
}
