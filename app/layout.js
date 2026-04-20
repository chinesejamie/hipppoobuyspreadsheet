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

const SITE_URL = "https://hippoobuyspreadsheet.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HipoBuy Spreadsheet — 10,000+ Taobao, 1688 & Weidian Deals",
    template: "%s | HipoBuy Spreadsheet",
  },
  description:
    "The HipoBuy Spreadsheet: 10,000+ curated Taobao, 1688 & Weidian products with direct buy links, verified deals, and daily updates. Save 50–80% on authentic Chinese products.",
  keywords: [
    "hipobuy spreadsheet",
    "hipobuy product spreadsheet",
    "chinese shopping spreadsheet",
    "taobao spreadsheet",
    "1688 spreadsheet",
    "weidian spreadsheet",
    "hipobuy deals",
    "taobao agent",
    "chinese shopping agent",
    "rep finds spreadsheet",
  ],
  authors: [{ name: "HipoBuy Spreadsheet" }],
  creator: "HipoBuy Spreadsheet",
  publisher: "HipoBuy Spreadsheet",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "HipoBuy Spreadsheet — Taobao, 1688 & Weidian deals",
    description:
      "10,000+ verified Chinese products with direct buy links. Updated daily. Save 50–80% with the HipoBuy Spreadsheet.",
    url: SITE_URL,
    siteName: "HipoBuy Spreadsheet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HipoBuy Spreadsheet — Taobao, 1688 & Weidian deals",
    description:
      "10,000+ verified Chinese products with direct buy links. Updated daily. Save 50–80%.",
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
};

export default function RootLayout({ children }) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "HipoBuy Spreadsheet",
    alternateName: [
      "HipoBuy Product Spreadsheet",
      "HipoBuy Database",
      "HipoBuy Taobao Spreadsheet",
    ],
    description:
      "The HipoBuy Spreadsheet with 10,000+ curated Taobao, 1688, and Weidian products. Save 50–80% on authentic Chinese shopping.",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HipoBuy Spreadsheet",
    url: SITE_URL,
    description:
      "Curated HipoBuy Spreadsheet covering Taobao, 1688, and Weidian with direct buy links and verified deals.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "Chinese"],
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <Navbar />
        {children}

        <aside
          aria-label="Sister projects"
          className="mt-8 py-6 px-4 border-t border-gray-200 text-center text-sm text-gray-500"
        >
          <div className="uppercase text-[11px] tracking-wider font-semibold text-gray-600 mb-2">
            Sister projects
          </div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a
              href="https://lit-buy-spreadsheet.com"
              rel="noopener"
              className="hover:text-gray-900 transition-colors"
            >
              Lit-Buy product list
            </a>
            <a
              href="https://kakobuy-spreadsheet.com"
              rel="noopener"
              className="hover:text-gray-900 transition-colors"
            >
              KakoBuy catalog
            </a>
            <a
              href="https://oopbuysheet.com"
              rel="noopener"
              className="hover:text-gray-900 transition-colors"
            >
              OOPBuy catalog
            </a>
          </nav>
        </aside>
      </body>
    </html>
  );
}
