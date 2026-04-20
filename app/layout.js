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
  metadataBase: new URL('https://hipobuyspreadsheet.com'),
  title: "HipoBuy Spreadsheet 2025 - #1 Chinese Product Database | Taobao, 1688, Weidian Deals",
  description: "Discover the ultimate HipoBuy Spreadsheet with 10,000+ curated products from Taobao, 1688 & Weidian. Save 50-80% on authentic Chinese products. Updated daily with verified deals, direct purchase links, and exclusive coupons.",
  keywords: "hipobuy spreadsheet, hipobuy product spreadsheet, chinese shopping spreadsheet, taobao spreadsheet, 1688 spreadsheet, weidian spreadsheet, chinese products database, hipobuy deals 2025, taobao agent, chinese shopping agent, wholesale from china, buy from taobao, oopbuy spreadsheet, kakobuy spreadsheet, hoobuy spreadsheet",
  authors: [{ name: "HipoBuy Spreadsheet" }],
  creator: "HipoBuy",
  publisher: "HipoBuy Spreadsheet",
  openGraph: {
    title: "HipoBuy Spreadsheet 2025 - Best Chinese Shopping Deals Database",
    description: "Access 10,000+ verified products from Taobao, 1688 & Weidian. Save up to 80% with our curated spreadsheet. Updated daily!",
    url: "https://hipobuyspreadsheet.com",
    siteName: "HipoBuy Spreadsheet",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HipoBuy Spreadsheet - Chinese Shopping Database"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HipoBuy Spreadsheet - #1 Chinese Shopping Database 2025",
    description: "10,000+ products from Taobao, 1688 & Weidian. Save 50-80% on authentic Chinese products!",
    images: ["/og-image.png"],
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
    canonical: "https://hipobuyspreadsheet.com",
  },
};

export default function RootLayout({ children }) {
  // Structured data for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HipoBuy Spreadsheet",
    "alternateName": ["HipoBuy Product Database", "Chinese Shopping Spreadsheet", "Taobao Spreadsheet", "1688 Spreadsheet", "HooBuy Spreadsheet"],
    "description": "The ultimate HipoBuy Spreadsheet with 10,000+ curated products from Taobao, 1688, and Weidian. Save 50-80% on authentic Chinese products.",
    "url": "https://hipobuyspreadsheet.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://hipobuyspreadsheet.com/?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://hipobuy.com",
      "https://hoobuy.com",
      "https://oopbuysheet.com",
      "https://oopbuyspreadsheet.com",
      "https://orientdigfinds.com",
      "https://kakobuy-spreadsheet.com"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HipoBuy",
    "url": "https://hipobuy.com",
    "logo": "https://hipobuyspreadsheet.com/logo.png",
    "description": "Leading Chinese shopping agent providing access to Taobao, 1688, and Weidian products worldwide.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Chinese"]
    }
  };

  const productCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "HipoBuy Product Spreadsheet",
    "description": "Curated collection of products from Chinese e-commerce platforms",
    "numberOfItems": "10000+",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Taobao Products",
        "description": "Products from China's largest marketplace"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "1688 Products",
        "description": "Wholesale products at factory prices"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Weidian Products",
        "description": "Fashion and streetwear at budget prices"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3B82F6" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.DEBUG_MODE = ${process.env.DEBUG_MODE === 'true'};`
          }}
        />

        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Product Catalog Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogSchema) }}
        />

        {/* Google Analytics */}
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        {children}

        <aside aria-label="Sister projects" className="mt-8 py-6 px-4 border-t border-gray-200 text-center text-sm text-gray-500">
          <div className="uppercase text-[11px] tracking-wider font-semibold text-gray-600 mb-2">Sister projects</div>
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="https://lit-buy-spreadsheet.com" rel="noopener" className="hover:text-gray-900 transition-colors">Lit-Buy product list</a>
            <a href="https://kakobuy-spreadsheet.com" rel="noopener" className="hover:text-gray-900 transition-colors">KakoBuy catalog</a>
            <a href="https://oopbuysheet.com" rel="noopener" className="hover:text-gray-900 transition-colors">OOPBuy catalog</a>
          </nav>
        </aside>

        {/* Hidden SEO Links - Crawlable by search engines */}
        <footer className="seo-links" aria-hidden="true">
          <nav aria-label="Partner network">
            <a href="https://oopbuysheet.com" title="OopBuy Sheet - Chinese Shopping Spreadsheet">OopBuy Sheet</a>
            <a href="https://oopbuyspreadsheet.com" title="OopBuy Spreadsheet - Taobao Product Database">OopBuy Spreadsheet</a>
            <a href="https://orientdigfinds.com" title="Orient Dig Finds - Chinese Product Discovery">Orient Dig Finds</a>
            <a href="https://kakobuy-spreadsheet.com" title="KakoBuy Spreadsheet - 1688 Weidian Products">KakoBuy Spreadsheet</a>
            <a href="https://cnfansportal.com" title="CNFans Portal - Chinese Shopping Agent">CNFans Portal</a>
            <a href="https://hipobuy.com" title="HipoBuy - Official Shopping Agent">HipoBuy Official</a>
            <a href="https://hoobuy.com" title="HooBuy - Chinese Shopping Agent">HooBuy Official</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
