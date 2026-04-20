import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'HipoBuy Spreadsheet Guides — Taobao, 1688 & Weidian Shopping Tips',
  description: 'Expert HipoBuy spreadsheet guides for buying from Taobao, 1688, and Weidian. Save 50–80% on authentic Chinese products with verified tutorials.',
  keywords: 'hipobuy spreadsheet guide, taobao guide, 1688 shopping, weidian tutorial, chinese shopping tips, how to buy from china',
  alternates: { canonical: 'https://hippoobuyspreadsheet.com/blog' },
  openGraph: {
    title: 'HipoBuy Spreadsheet Guides — Save on Chinese Shopping',
    description: 'Expert guides for using the HipoBuy Spreadsheet on Taobao, 1688, and Weidian.',
    url: 'https://hippoobuyspreadsheet.com/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'HipoBuy Spreadsheet Guides',
    description: 'Expert guides and tips for the HipoBuy Spreadsheet and Chinese e-commerce platforms.',
    url: 'https://hippoobuyspreadsheet.com/blog',
    publisher: {
      '@type': 'Organization',
      name: 'HipoBuy Spreadsheet',
      url: 'https://hippoobuyspreadsheet.com',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="min-h-screen bg-white pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm transition-colors">
              ← Back to products
            </Link>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full mb-4">
              <BookOpen className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700 font-medium text-xs uppercase tracking-wide">HipoBuy Spreadsheet Guides</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
              HipoBuy Spreadsheet shopping guides
            </h1>
            <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
              Practical guides for using the HipoBuy Spreadsheet to find and buy from Taobao, 1688, and Weidian safely — written for beginners and seasoned rep-shoppers.
            </p>
          </div>

          {articles.length > 0 && (
            <div className="mb-12">
              <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-64 md:h-full min-h-[280px] bg-gray-100">
                    <Image src={articles[0].image} alt={articles[0].title} fill className="object-cover" priority />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-white text-gray-900 rounded-full text-[11px] font-semibold shadow-sm">Featured</span>
                    </div>
                  </div>

                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium">{articles[0].category}</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(articles[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {articles[0].readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                      <Link href={`/blog/${articles[0].slug}`} className="hover:text-blue-600 transition-colors">
                        {articles[0].title}
                      </Link>
                    </h2>

                    <p className="text-gray-600 mb-5 leading-relaxed">{articles[0].excerpt}</p>

                    <Link
                      href={`/blog/${articles[0].slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                    >
                      Read the full guide
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          )}

          <section aria-labelledby="all-guides" className="mb-12">
            <h2 id="all-guides" className="text-xl font-bold text-gray-900 mb-5">All guides</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.slice(1).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="relative h-44 bg-gray-100">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2 uppercase tracking-wide">
                      <span>{article.category}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <aside className="bg-gray-900 rounded-2xl p-8 sm:p-10 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start saving on the HipoBuy Spreadsheet</h2>
            <p className="text-gray-300 text-base mb-6 max-w-2xl mx-auto">
              Browse 10,000+ verified products and buy through the HipoBuy shopping agent with full buyer protection.
            </p>
            <a
              href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm"
            >
              Sign up with HipoBuy
              <ArrowRight className="w-4 h-4" />
            </a>
          </aside>
        </div>
      </main>
    </>
  );
}
