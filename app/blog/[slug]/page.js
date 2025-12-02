import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlug, getAllArticles } from '@/lib/articles';
import { Clock, Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: 'Article Not Found - OOPBuy Blog',
    };
  }

  return {
    title: `${article.title} | OOPBuy Blog`,
    description: article.excerpt,
    keywords: article.title.toLowerCase().split(' ').join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }) {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex(a => a.slug === article.slug);
  const relatedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .slice(0, 3);

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.image,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url": "https://oopbuy.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "OOPBuy",
      "url": "https://oopbuy.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://oopbuyproducts.net/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://oopbuyproducts.net/blog/${article.slug}`
    }
  };

  // Breadcrumb structured data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://oopbuyproducts.net"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://oopbuyproducts.net/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": `https://oopbuyproducts.net/blog/${article.slug}`
      }
    ]
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-white pt-16">
        {/* Hero Section */}
        <div className="relative h-[400px] sm:h-[500px] bg-gradient-to-br from-gray-900 to-gray-800">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="relative h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-white">{article.category}</span>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-[#FF186B] text-white rounded-full text-sm font-semibold">
                {article.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(article.date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {article.readTime}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Excerpt */}
          <div className="bg-gradient-to-r from-[#FF186B]/10 to-purple-100 rounded-2xl p-6 mb-8 border-l-4 border-[#FF186B]">
            <p className="text-lg text-gray-700 leading-relaxed font-medium">
              {article.excerpt}
            </p>
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none
            prose-headings:font-black prose-headings:text-gray-900
            prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-6
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-[#FF186B] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-bold
            prose-em:text-gray-700 prose-em:italic
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700 prose-li:my-2 prose-li:leading-relaxed
            prose-blockquote:border-l-4 prose-blockquote:border-[#FF186B] prose-blockquote:bg-gray-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic
            prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-table:border-collapse prose-table:w-full prose-table:my-8
            prose-th:bg-gray-100 prose-th:p-3 prose-th:border prose-th:border-gray-300 prose-th:font-bold prose-th:text-left
            prose-td:p-3 prose-td:border prose-td:border-gray-300
            prose-img:rounded-lg prose-img:shadow-lg">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-4xl font-black text-gray-900 mt-8 mb-6" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-3xl font-black text-gray-900 mt-12 mb-6 border-b-2 border-gray-200 pb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4" {...props} />,
                h4: ({node, ...props}) => <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                a: ({node, ...props}) => <a className="text-[#FF186B] font-semibold hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 my-6 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-6 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-700 leading-relaxed" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#FF186B] bg-gray-50 py-4 px-6 my-6 italic" {...props} />,
                code: ({node, inline, ...props}) =>
                  inline
                    ? <code className="text-pink-600 bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                    : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono" {...props} />,
                table: ({node, ...props}) => <div className="overflow-x-auto my-8"><table className="w-full border-collapse" {...props} /></div>,
                th: ({node, ...props}) => <th className="bg-gray-100 p-3 border border-gray-300 font-bold text-left" {...props} />,
                td: ({node, ...props}) => <td className="p-3 border border-gray-300" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>

          {/* CTA Box */}
          <div className="mt-12 bg-gradient-to-r from-[#FF186B] via-pink-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-2xl">
            <h3 className="text-2xl sm:text-3xl font-black mb-3">
              Ready to Put This Guide Into Action?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Sign up for OOPBuy now and start saving 50-80% on authentic products from China. Get exclusive coupon codes instantly!
            </p>
            <a
              href="https://oopbuy.com/register?inviteCode=DMP60XRTF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF186B] rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
            >
              Sign Up & Get Coupons Now
              <ArrowRight className="w-6 h-6" />
            </a>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-black text-gray-900 mb-8">More Helpful Guides</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl hover:border-[#FF186B]/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                        {related.category}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-2 mb-2 line-clamp-2 group-hover:text-[#FF186B] transition-colors">
                        {related.title}
                      </h3>
                      <div className="flex items-center text-[#FF186B] font-semibold text-sm">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#FF186B] font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to All Guides
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
