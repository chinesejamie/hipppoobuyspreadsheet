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
  metadataBase: new URL('https://oopbuyproducts.net'),
  title: "OOPBuy Spreadsheet - Official Product Database | Taobao, 1688, Weidian Shopping",
  description: "Official OOPBuy Spreadsheet with 1000+ curated Chinese products. The best OOPBuy product spreadsheet for Taobao, 1688, and Weidian shopping. Browse our comprehensive OOPBuy spreadsheet database with prices, reviews, and direct purchase links. Save 50-80% on authentic products.",
  keywords: "oopbuy spreadsheet, oopbuy product spreadsheet, oopbuy products spreadsheet, oopbuy shopping spreadsheet, chinese shopping spreadsheet, taobao spreadsheet, 1688 spreadsheet, weidian spreadsheet, oopbuy database, oopbuy catalog, chinese products list",
  authors: [{ name: "OOPBuy" }],
  openGraph: {
    title: "OOPBuy Spreadsheet - Find the Best Chinese Shopping Deals",
    description: "Browse our comprehensive OOPBuy spreadsheet with products from 1688, Taobao, and Weidian. The best curated collection for Chinese shopping.",
    url: "https://oopbuyproducts.net",
    siteName: "OOPBuy Spreadsheet",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OOPBuy Spreadsheet - Chinese Shopping Made Easy",
    description: "The ultimate OOPBuy product spreadsheet with curated items from top Chinese platforms.",
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
    canonical: "https://oopbuyproducts.net",
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
              "name": "OOPBuy Spreadsheet - Official Product Database",
              "alternateName": ["OOPBuy Product Spreadsheet", "OOPBuy Shopping Spreadsheet", "OOPBuy Products List"],
              "description": "Official OOPBuy Spreadsheet - The ultimate OOPBuy product spreadsheet database with 1000+ curated products from Chinese shopping platforms including Taobao, 1688, and Weidian. Browse the best OOPBuy spreadsheet for authentic Chinese products at wholesale prices.",
              "url": "https://oopbuyproducts.net",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://oopbuyproducts.net/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

                ttq.load('D4MQ68BC77U6TA8BPBR0');
                ttq.page();
              }(window, document, 'ttq');
            `
          }}
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-64NZJQQ77J"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-64NZJQQ77J');
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
