import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export function RouteProgressBar() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleStart = (url: string) => {
      // Don't show progress for hash-only navigation on the same page
      if (url.includes('#') && url.split('#')[0] === router.asPath.split('#')[0]) {
        return;
      }
      setIsNavigating(true);
      setProgress(25);

      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 88) {
            clearInterval(timer);
            return 88;
          }
          return prev + 12;
        });
      }, 150);
    };

    const handleStop = () => {
      clearInterval(timer);
      setProgress(100);
      const endTimer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(endTimer);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      clearInterval(timer);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-1 overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#000080] via-[#00bfff] to-[#93186c] shadow-[0_0_10px_rgba(0,191,255,0.7)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
