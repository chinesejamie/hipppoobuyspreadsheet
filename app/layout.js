import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL('https://cnfansportal.com'),
  title: "CNFans Spreadsheet - Official Product Database | Taobao, 1688, Weidian Shopping",
  description: "Official CNFans Spreadsheet with 1000+ curated Chinese products. The best CNFans product spreadsheet for Taobao, 1688, and Weidian shopping. Browse our comprehensive CNFans spreadsheet database with prices, reviews, and direct purchase links. Save 50-80% on authentic products.",
  keywords: "cnfans spreadsheet, cnfans product spreadsheet, cnfans products spreadsheet, cnfans shopping spreadsheet, chinese shopping spreadsheet, taobao spreadsheet, 1688 spreadsheet, weidian spreadsheet, cnfans database, cnfans catalog, chinese products list",
  authors: [{ name: "CNFans" }],
  openGraph: {
    title: "CNFans Spreadsheet - Find the Best Chinese Shopping Deals",
    description: "Browse our comprehensive CNFans spreadsheet with products from 1688, Taobao, and Weidian. The best curated collection for Chinese shopping.",
    url: "https://cnfansportal.com",
    siteName: "CNFans Spreadsheet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNFans Spreadsheet - Chinese Shopping Made Easy",
    description: "The ultimate CNFans product spreadsheet with curated items from top Chinese platforms.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here",
  },
  alternates: {
    canonical: "https://cnfansportal.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.DEBUG_MODE = ${process.env.DEBUG_MODE === 'true'};`
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CNFans Spreadsheet - Official Product Database",
              "alternateName": ["CNFans Product Spreadsheet", "CNFans Shopping Spreadsheet", "CNFans Products List"],
              "description": "Official CNFans Spreadsheet - The ultimate CNFans product spreadsheet database with 1000+ curated products from Chinese shopping platforms including Taobao, 1688, and Weidian. Browse the best CNFans spreadsheet for authentic Chinese products at wholesale prices.",
              "url": "https://cnfansportal.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cnfansportal.com/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J8NYMZMMEV"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J8NYMZMMEV');
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
