import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/common/components/AuthContext";
import { SiteLayoutProvider } from "@/common/components/SiteLayoutContext";
import "@/assets/style/globals.css";
import "lenis/dist/lenis.css";
import "quill/dist/quill.snow.css";
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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <div className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col antialiased overflow-x-hidden`}>
        <AuthProvider>
          <SiteLayoutProvider>
            <Component {...pageProps} />
          </SiteLayoutProvider>
        </AuthProvider>
      </div>
    </>
  );
}
