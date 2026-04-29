import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import SignupModal from '@/components/SignupModal';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import BlogPreview from '@/components/BlogPreview';
import FAQ from '@/components/FAQ';
import { ArrowRight, CheckCircle2, ShieldCheck, Truck, Tag, Clock } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata = {
  title: 'Hippo Buy Spreadsheet 2025 — Hipobuy & Hippobuy Taobao, 1688 & Weidian Deals',
  description:
    'The Hippo Buy Spreadsheet (Hipobuy / Hippobuy): 10,000+ curated Taobao, 1688 & Weidian products with direct Hippo Buy links, verified deals, and daily 2025 updates. Save 50–80% on authentic Chinese shopping.',
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

  return (
    <main className="min-h-screen bg-white">
      <section className="pt-24 pb-16 sm:pt-28 sm:pb-20 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-600 mb-5">
            <Tag className="w-3.5 h-3.5" />
            2026 edition · Updated daily · Hipobuy / Hippobuy / Hippo Buy
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-[1.05] tracking-tight">
            The Hippo Buy Spreadsheet 2025
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-600 mt-3">
              Hipobuy &amp; Hippobuy rep finds, all in one list.
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            <strong className="text-gray-900 font-semibold">Stop scrolling Taobao in Chinese.</strong> 10,000+ verified Taobao, 1688 &amp; Weidian picks with direct <strong className="text-gray-900 font-semibold">Hippo Buy links</strong> &mdash; one click, the agent ships it. Save <strong className="text-gray-900 font-semibold">50&ndash;80%</strong> vs retail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              Claim my free Hippobuy account
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-semibold text-sm hover:border-gray-900 transition-colors"
            >
              See today&apos;s spreadsheet picks
            </a>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-gray-500">
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              10,000+ verified picks
            </li>
            <li className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              Agent buyer protection
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-green-600" />
              Ships to 200+ countries
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-green-600" />
              Updated daily
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="what-is" className="py-16 sm:py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">About</span>
            <h2 id="what-is" className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              What is the Hippo Buy Spreadsheet?
            </h2>
          </div>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <p>
              The <strong>Hippo Buy Spreadsheet</strong> &mdash; also called the <strong>Hipobuy spreadsheet</strong> or
              <strong> Hippobuy spreadsheet</strong> &mdash; is a curated product database covering the best finds from
              <strong> Taobao</strong>, <strong>1688</strong>, and <strong>Weidian</strong>, three of China&apos;s largest
              e-commerce platforms. Instead of scrolling through millions of listings in Chinese, the Hippo Buy
              spreadsheet gives you a clean, searchable catalog with photos, prices, seller info, and direct
              <strong> Hippo Buy links</strong>.
            </p>
            <p>
              Every listing is reviewed and buyable in one click through the <strong>HipoBuy shopping agent</strong> (hipobuy.com),
              which places the order, runs a quality-check on the item, and ships it to your country with tracking. It&apos;s
              the fastest way for rep-shoppers, fashion buyers, and wholesalers outside of China to access the same
              catalogs Chinese buyers use &mdash; at 50&ndash;80% less than Western retail.
            </p>
            <p className="text-sm text-gray-500">
              <strong>Spelling note:</strong> the official brand is <em>HipoBuy</em> (one P), but shoppers also search
              for it as <em>Hippobuy</em>, <em>Hippo Buy</em>, <em>Hipobuy spreadsheets</em>, or even
              <em> hippobuy spreedsheet</em>. They all point to the same agent and the same catalog you see here.
            </p>
          </div>
        </div>
      </section>

      <section id="products" aria-labelledby="catalog" className="py-16 sm:py-20">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">Catalog</span>
            <h2 id="catalog" className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight">
              Browse the Hippo Buy Spreadsheet
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

      <section
        aria-labelledby="changelog"
        className="py-16 sm:py-20 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500">
              Update log
            </span>
            <h2
              id="changelog"
              className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 tracking-tight"
            >
              Hippo Buy Spreadsheet — version history
            </h2>
            <p className="text-gray-600 mt-3">
              What&apos;s new in the Hipobuy / Hippobuy catalog. Last refresh: <strong>April 29, 2026</strong>.
            </p>
          </div>

          <ol className="relative border-l border-gray-200 ml-2">
            {[
              {
                date: '2026-04-29',
                label: 'April 29, 2026',
                title: 'Spelling-variant SEO refresh',
                body: 'Site copy now covers Hippo Buy, Hippobuy, and Hipobuy spellings together. Added a 2025-edition FAQ entry and a dedicated spelling Q&A so shoppers searching any variant land on the same catalog.',
              },
              {
                date: '2026-04-21',
                label: 'April 21, 2026',
                title: 'Catalog refresh — spring footwear',
                body: 'Added 380+ new spring/summer footwear listings from Taobao top sellers (sneakers, running, sandals). Refreshed pricing on the 1688 wholesale section.',
              },
              {
                date: '2026-04-12',
                label: 'April 12, 2026',
                title: 'Weidian streetwear drop',
                body: 'Imported 220+ Weidian streetwear and accessories listings, including newly verified sellers for hoodies, tees, and bags.',
              },
              {
                date: '2026-03-28',
                label: 'March 28, 2026',
                title: 'Sister-site backlinks + footer',
                body: 'Connected the Hippo Buy Spreadsheet to the wider rep-shopper network: Lit-Buy, KakoBuy, and OOPBuy catalogs are now linked from the footer.',
              },
              {
                date: '2026-03-15',
                label: 'March 15, 2026',
                title: 'Search & filter overhaul',
                body: 'Switched to server-rendered search and category filters for faster Hippo Buy spreadsheet browsing on mobile, with category dedup and currency-aware pricing.',
              },
              {
                date: '2026-02-20',
                label: 'February 20, 2026',
                title: '1688 wholesale section expanded',
                body: 'Added 600+ verified 1688 wholesale items (electronics, home goods, accessories) with minimum order quantities surfaced on each card.',
              },
              {
                date: '2026-01-10',
                label: 'January 10, 2026',
                title: '2025 → 2026 catalog rollover',
                body: 'Archived 2024 listings and seeded the 2026 Hippo Buy spreadsheet with the year&apos;s first verified Taobao rep finds and trending fashion drops.',
              },
            ].map((entry) => (
              <li key={entry.date} className="mb-8 ml-4 last:mb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-1.5 mt-1.5 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"
                />
                <time
                  dateTime={entry.date}
                  className="block text-xs font-semibold uppercase tracking-wider text-blue-600"
                >
                  {entry.label}
                </time>
                <h3 className="text-base font-semibold text-gray-900 mt-1">
                  {entry.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  {entry.body}
                </p>
              </li>
            ))}
          </ol>

          <p className="text-center text-xs text-gray-500 mt-8">
            The Hippo Buy Spreadsheet is updated daily. Major changes are logged here; minor product additions happen continuously.
          </p>
        </div>
      </section>

      <footer className="bg-gray-950 text-gray-300 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="font-bold text-white text-lg mb-2">Hippo Buy Spreadsheet</div>
              <p className="text-sm text-gray-400 leading-relaxed">
                The curated Hippo Buy Spreadsheet (Hipobuy / Hippobuy) for Taobao, 1688, and Weidian. Verified products, direct Hippo Buy links, updated daily.
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
            <p>&copy; {new Date().getFullYear()} Hippo Buy Spreadsheet (Hipobuy &middot; Hippobuy) &mdash; Curated Taobao, 1688 &amp; Weidian finds.</p>
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
