import type { AppProps } from 'next/app'
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/common/components/AuthContext";
import "@/assets/style/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  )
}
