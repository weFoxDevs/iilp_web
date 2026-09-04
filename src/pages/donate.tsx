import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";

export default function DonatePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center py-32">
        <h1 className="text-4xl font-bold font-serif">Donate</h1>
      </main>
      <Footer />
    </div>
  );
}
