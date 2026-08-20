import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "YKS Taban Puanları ve Sıralama Hesaplama 2026",
  description: "2026 güncel YKS üniversite taban puanları, başarı sıralamaları ve TYT/AYT netlerinize göre detaylı sıralama hesaplama aracı.",
  keywords: ["YKS 2026", "Taban Puanlar", "Başarı Sıralaması", "YKS Hesaplama", "Üniversite Puanları", "TYT", "AYT", "Eşit Ağırlık Hukuk Puanları", "Kazanabilirsin"],
  openGraph: {
    title: "YKS Taban Puanları ve Sıralama Hesaplama 2026",
    description: "2026 güncel YKS üniversite taban puanları ve başarı sıralamaları.",
    type: "website",
    locale: "tr_TR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Navbar from "@/components/Navbar";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
      </head>
      <body>
        {/* Google Analytics */}
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-JDZ2Z15EWX" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JDZ2Z15EWX');
          `}
        </Script>

        {/* Google AdSense */}
        <Script 
          strategy="afterInteractive" 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4546672067852912" 
          crossOrigin="anonymous" 
        />

        <Navbar />
        {children}
      </body>
    </html>
  );
}
