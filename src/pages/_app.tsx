import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/common/components/AuthContext";
import { SiteLayoutProvider } from "@/common/components/SiteLayoutContext";
import "@/assets/style/globals.css";
import "lenis/dist/lenis.css";
import { useEffect } from 'react';
import Lenis from 'lenis';
import { useRouter } from 'next/router';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Disable Lenis smooth scrolling on admin routes to allow native flex/overflow scrolling
    if (router.pathname.startsWith('/admin')) {
      return;
    }

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Scroll smoothly to top on page navigation
    const handleRouteChange = () => {
      lenis.scrollTo(0, { immediate: true });
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      cancelAnimationFrame(rafId);
      router.events.off('routeChangeComplete', handleRouteChange);
      lenis.destroy();
    };
  }, [router.pathname, router.events]);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased`}>
      <AuthProvider>
        <SiteLayoutProvider>
          <Component {...pageProps} />
        </SiteLayoutProvider>
      </AuthProvider>
    </div>
  );
}
