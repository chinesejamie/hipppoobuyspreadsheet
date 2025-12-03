import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Shopping Guides & Tips - Learn How to Save on Chinese Shopping | CNFans Blog',
  description: 'Expert guides on buying from Taobao, 1688, and Weidian. Learn how to save 50-80% on authentic products with our comprehensive shopping tutorials.',
  keywords: 'Taobao guide, 1688 shopping, Weidian tutorial, Chinese shopping tips, how to buy from China, save money shopping',
  openGraph: {
    title: 'Shopping Guides & Tips - CNFans Blog',
    description: 'Expert guides on buying from Chinese platforms and saving big on authentic products',
    type: 'website',
  }
};

export default function BlogPage() {
  const articles = getAllArticles();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "CNFans Shopping Guides",
    "description": "Expert guides and tips for shopping from Chinese e-commerce platforms",
    "url": "https://cnfansportal.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "CNFans",
      "url": "https://cnfans.com"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Header */}
          <div className="text-center mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C92910] mb-6 transition-colors"
            >
              ← Back to Products
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C92910]/10 rounded-full mb-4">
              <BookOpen className="w-5 h-5 text-[#C92910]" />
              <span className="text-[#C92910] font-semibold text-sm">Shopping Guides & Tips</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-[#C92910] to-purple-600 bg-clip-text text-transparent">
              Learn to Shop Smarter
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Expert guides on buying from Taobao, 1688, and Weidian. Save 50-80% on authentic products with our comprehensive tutorials.
            </p>
          </div>

          {/* Featured Article */}
          {articles.length > 0 && (
            <div className="mb-12">
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#C92910]/20 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 md:h-full min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={articles[0].image}
                      alt={articles[0].title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#C92910] text-white rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {articles[0].category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(articles[0].date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {articles[0].readTime}
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                      {articles[0].title}
                    </h2>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {articles[0].excerpt}
                    </p>

                    <Link
                      href={`/blog/${articles[0].slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#C92910] to-red-700 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold w-fit"
                    >
                      Read Full Guide
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Articles Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Guides</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(1).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#C92910]/30 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#C92910] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center text-[#C92910] font-semibold text-sm">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-[#C92910] via-red-700 to-purple-600 rounded-3xl p-8 sm:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Ready to Start Saving?
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
              Put these guides into action! Sign up for CNFans and get exclusive coupon codes to save even more.
            </p>
            <a
              href="https://cnfans.com/register?ref=137664"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#C92910] rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
            >
              Sign Up & Get Coupons
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
