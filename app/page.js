import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import SignupModal from '@/components/SignupModal';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import BlogPreview from '@/components/BlogPreview';
import FAQ from '@/components/FAQ';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Tag } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'HipoBuy Spreadsheet — 10,000+ Taobao, 1688 & Weidian Deals',
  description:
    'The HipoBuy Spreadsheet: 10,000+ curated Taobao, 1688 & Weidian products with direct buy links, verified deals, and daily updates. Save 50–80% on authentic Chinese shopping.',
  alternates: { canonical: 'https://hippoobuyspreadsheet.com' },
};

let categoriesCache = null;
let categoriesCacheTime = 0;
const CATEGORIES_CACHE_TTL = 10 * 60 * 1000;

async function getCategories() {
  try {
    if (categoriesCache && Date.now() - categoriesCacheTime < CATEGORIES_CACHE_TTL) {
      return categoriesCache;
    }
    await connectToDatabase();
    const categories = await Product.distinct('category');
    categoriesCache = ['all', ...categories.filter(Boolean).sort()];
    categoriesCacheTime = Date.now();
    return categoriesCache;
  } catch (error) {
    console.error('[SSR] Error fetching categories:', error);
    return ['all'];
  }
}

async function getProducts(searchParams) {
  try {
    await connectToDatabase();

    const page = Number(searchParams.page) || 1;
    const requestedLimit = Number(process.env.PRODUCTS_PER_PAGE) || 100;
    const limit = Math.min(requestedLimit, 100);

    const search = searchParams.search || '';
    const category = searchParams.category || 'all';

    const mongoQuery = {};
    if (search) {
      const rx = new RegExp(String(search), 'i');
      mongoQuery.$or = [
        { name: { $regex: rx } },
        { description: { $regex: rx } },
        { creatorName: { $regex: rx } },
        { id: { $regex: rx } },
      ];
    }
    if (category && category !== 'all' && category !== 'All') {
      mongoQuery.category = category;
    }

    const pageIds = ['692d53b66be92af615b19149', '6938616f524b069ebb531ad6'];
    const now = new Date();

    const pipeline = [
      { $match: mongoQuery },
      {
        $addFields: {
          totalBoostForPage: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: { $ifNull: ['$boosts', []] },
                    as: 'b',
                    cond: {
                      $and: [
                        { $in: ['$$b.boostPage', pageIds] },
                        { $gt: ['$$b.validUntil', now] },
                      ],
                    },
                  },
                },
                as: 'validBoost',
                in: '$$validBoost.amount',
              },
            },
          },
        },
      },
      { $sort: { totalBoostForPage: -1, purchased: -1, viewCount: -1, _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit + 1 },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          creatorName: 1,
          store: 1,
          id: 1,
          category: 1,
          images: 1,
        },
      },
    ];

    const results = await Product.aggregate(pipeline);
    const hasMore = results.length > limit;
    const products = results.slice(0, limit).map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      creatorName: p.creatorName,
      store: p.store,
      id: p.id,
      category: p.category,
      images:
        p.images?.map((img) => (typeof img === 'string' ? img : img?.url || '')).filter(Boolean) || [],
    }));

    return { products, hasMore, page };
  } catch (error) {
    console.error('[SSR] Error fetching products:', error);
    return { products: [], hasMore: false, page: 1 };
  }
}

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;

  const [categories, { products, hasMore, page }] = await Promise.all([
    getCategories(),
    getProducts(resolvedParams),
  ]);

  const currency = resolvedParams.currency?.trim() || 'USD';
  const search = resolvedParams.search || '';
  const category = resolvedParams.category || 'all';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the HipoBuy Spreadsheet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The HipoBuy Spreadsheet is a curated product database of 10,000+ verified Taobao, 1688, and Weidian items with direct buy links through the HipoBuy shopping agent. It is updated daily with the best rep-finds and wholesale deals.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I buy products listed on the HipoBuy Spreadsheet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Click any product on the spreadsheet, review the photos and price, then use the direct HipoBuy buy link. HipoBuy places the order with the Chinese seller, quality-checks the item, and ships it to you worldwide.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much can I save using the HipoBuy Spreadsheet?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most products in the HipoBuy Spreadsheet are 50–80% cheaper than Western retail, because you buy direct from Taobao, 1688, and Weidian sellers via an agent.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the HipoBuy Spreadsheet safe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Every order is handled by the HipoBuy agent with buyer protection and a quality-check step before shipping, so you never pay directly to an unknown Taobao seller.',
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 mb-5">
            <Tag className="w-3.5 h-3.5" />
            HipoBuy Spreadsheet · updated daily
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-[1.05] tracking-tight">
            The HipoBuy Spreadsheet for<br className="hidden sm:block" /> Taobao, 1688 &amp; Weidian
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            10,000+ hand-picked Chinese products with direct buy links through the HipoBuy agent. Verified deals, real photos, updated daily. Save <strong className="text-gray-900 font-semibold">50–80%</strong> vs retail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              Sign up with HipoBuy
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold text-sm hover:border-gray-900 transition-colors"
            >
              Browse the spreadsheet
            </a>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-gray-500">
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              10,000+ verified products
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              Agent buyer protection
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-green-600" />
              Ships to 200+ countries
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="what-is" className="py-16 sm:py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">About</span>
            <h2 id="what-is" className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              What is the HipoBuy Spreadsheet?
            </h2>
          </div>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <p>
              The <strong>HipoBuy Spreadsheet</strong> is a curated product database covering the best finds from
              <strong> Taobao</strong>, <strong>1688</strong>, and <strong>Weidian</strong> &mdash; three of China&apos;s largest e-commerce platforms.
              Instead of scrolling through millions of listings in Chinese, the HipoBuy Spreadsheet gives you
              a clean, searchable catalog with photos, prices, seller info, and direct purchase links.
            </p>
            <p>
              Every listing is reviewed and buyable in one click through the <strong>HipoBuy shopping agent</strong>, which
              places the order, runs a quality-check on the item, and ships it to your country with tracking. It&apos;s the
              fastest way for rep-shoppers, fashion buyers, and wholesalers outside of China to access the same catalogs that
              Chinese buyers use &mdash; at 50&ndash;80% less than Western retail.
            </p>
          </div>
        </div>
      </section>

      <section id="products" aria-labelledby="catalog" className="py-16 sm:py-20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Catalog</span>
            <h2 id="catalog" className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              Browse the HipoBuy Spreadsheet
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              {products.length > 0
                ? `${products.length} curated products on this page. Filter by category or search to narrow down.`
                : 'Use the filters below to explore the curated HipoBuy catalog.'}
            </p>
          </div>

          <ProductFilters
            categories={categories}
            initialSearch={search}
            initialCategory={category}
            initialCurrency={currency}
          />

          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 text-sm">Try adjusting the category or search query.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-6 mb-8">
                {products.map((product, index) => (
                  <ProductCard key={product._id || index} product={product} currency={currency} />
                ))}
              </div>
              <Pagination currentPage={page} hasMore={hasMore} productsCount={products.length} />
            </>
          )}
        </div>
      </section>

      <div className="bg-white border-t border-gray-100">
        <HowItWorks />
        <WhyChooseUs />
        <BlogPreview />
        <FAQ />
      </div>

      <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="font-bold text-white text-lg mb-2">HipoBuy Spreadsheet</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                The curated HipoBuy Spreadsheet for Taobao, 1688, and Weidian. Verified products, direct buy links, updated daily.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider text-[11px]">Shop</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">All products</a></li>
                <li><a href="/?category=Fashion" className="hover:text-white transition-colors">Fashion</a></li>
                <li><a href="/?category=Electronics" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="/?category=Home" className="hover:text-white transition-colors">Home &amp; Living</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider text-[11px]">Guides</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/blog" className="hover:text-white transition-colors">All guides</a></li>
                <li><a href="/blog/complete-guide-buying-from-taobao-2025" className="hover:text-white transition-colors">Taobao buying guide</a></li>
                <li><a href="/blog/1688-vs-taobao-vs-weidian-comparison-guide" className="hover:text-white transition-colors">1688 vs Taobao vs Weidian</a></li>
                <li><a href="/blog/how-to-avoid-counterfeit-products-chinese-shopping" className="hover:text-white transition-colors">Avoiding counterfeits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wider text-[11px]">HipoBuy</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://hipobuy.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">Official site</a></li>
                <li><a href="https://hipobuy.com/register?inviteCode=LKG2UDAUS" target="_blank" rel="noopener" className="hover:text-white transition-colors">Sign up</a></li>
                <li><a href="https://hipobuy.com/help" target="_blank" rel="noopener" className="hover:text-white transition-colors">Help center</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} HipoBuy Spreadsheet &mdash; Curated Taobao, 1688 &amp; Weidian finds.</p>
            <p className="mt-1.5 text-gray-600">
              Taobao, 1688, and Weidian are trademarks of their respective owners. Not affiliated with Alibaba Group.
            </p>
          </div>
        </div>
      </footer>

      <SignupModal />
    </main>
  );
}
