import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import SignupModal from '@/components/SignupModal';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import BlogPreview from '@/components/BlogPreview';
import FAQ from '@/components/FAQ';
import { Gift, Sparkles } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// Enable dynamic rendering for real-time product updates
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Generate metadata for SEO
export const metadata = {
  title: "CNFans Spreadsheet - Official Product Database | Taobao, 1688, Weidian Shopping",
  description: "Official CNFans Spreadsheet with 1000+ curated Chinese products. Browse our comprehensive CNFans spreadsheet database with prices, reviews, and direct purchase links. Save 50-80% on authentic products.",
};

// Fetch categories - cached for 10 minutes
let categoriesCache = null;
let categoriesCacheTime = 0;
const CATEGORIES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function getCategories() {
  try {
    // Return cached categories if still valid
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

// Fetch products
async function getProducts(searchParams) {
  const DEBUG = process.env.DEBUG_MODE === 'true';
  const startTime = DEBUG ? Date.now() : 0;

  try {
    const connection = await connectToDatabase();
    if (DEBUG) console.log(`[SSR] DB connected in ${Date.now() - startTime}ms`);

    const page = Number(searchParams.page) || 1;

    // Security: Enforce maximum limit of 100
    const requestedLimit = Number(process.env.PRODUCTS_PER_PAGE) || 100;
    const MAX_LIMIT = 100;
    const limit = Math.min(requestedLimit, MAX_LIMIT);

    const search = searchParams.search || '';
    const category = searchParams.category || 'all';

    // Build query
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

    // Get page ID for boosts
    const pageId = '692d53b66be92af615b19149';
    const now = new Date();

    // Aggregation pipeline with boost calculation
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
                        { $eq: ['$$b.boostPage', pageId] },
                        { $gt: ['$$b.validUntil', now] }
                      ]
                    }
                  }
                },
                as: 'validBoost',
                in: '$$validBoost.amount'
              }
            }
          }
        }
      },
      {
        $sort: {
          totalBoostForPage: -1,
          purchased: -1,
          viewCount: -1,
          _id: -1
        }
      },
      { $skip: (page - 1) * limit },
      { $limit: limit + 1 }, // Fetch one extra to check if there are more pages
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
          images: 1
        }
      }
    ];

    const queryStart = DEBUG ? Date.now() : 0;

    // Debug: Check collection counts
    const db = connection.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));

    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`📊 Collection "${col.name}": ${count} documents`);
    }

    const results = await Product.aggregate(pipeline);
    if (DEBUG) console.log(`[SSR] Query executed in ${Date.now() - queryStart}ms`);

    const hasMore = results.length > limit;
    const products = results.slice(0, limit).map(p => ({
      _id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      creatorName: p.creatorName,
      store: p.store,
      id: p.id,
      category: p.category,
      images: p.images?.map(img => typeof img === 'string' ? img : img?.url || '').filter(Boolean) || []
    }));

    if (DEBUG) console.log(`[SSR] Total time: ${Date.now() - startTime}ms for ${products.length} products`);
    return { products, hasMore, page };
  } catch (error) {
    console.error('[SSR] Error fetching products:', error);
    return { products: [], hasMore: false, page: 1 };
  }
}

// Helper functions are now in lib/productUtils.js and imported by components

export default async function Home({ searchParams }) {
  const DEBUG = process.env.DEBUG_MODE === 'true';
  const pageStart = DEBUG ? Date.now() : 0;

  const resolvedParams = await searchParams;

  // Fetch categories and products in parallel for better performance
  const [categories, { products, hasMore, page }] = await Promise.all([
    getCategories(),
    getProducts(resolvedParams)
  ]);

  // Ensure currency is always a valid string, never empty or undefined
  const currency = resolvedParams.currency?.trim() || 'USD';
  const search = resolvedParams.search || '';
  const category = resolvedParams.category || 'all';

  if (DEBUG) {
    console.log('[SSR Page] Total render time:', Date.now() - pageStart, 'ms');
    console.log('[SSR Page] Currency:', currency, 'Products:', products.length);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
            {/* Announcement Badge */}
            <div className="flex justify-center mb-6">
              <a
                href="https://cnfans.com/register?ref=137664"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#C92910]/10 hover:bg-[#C92910]/15 rounded-full transition-all duration-300"
              >
                <Gift className="w-4 h-4 text-[#C92910]" />
                <span className="text-sm font-semibold text-[#C92910]">
                  Get Exclusive Coupons
                </span>
                <Sparkles className="w-4 h-4 text-[#C92910] group-hover:rotate-12 transition-transform" />
              </a>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[#C92910] via-red-700 to-purple-600 bg-clip-text text-transparent">
                CNFans Spreadsheet
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Best Chinese Shopping Products
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              The ultimate CNFans product spreadsheet with curated items from Taobao, 1688, and Weidian.
              Save 50-80% on authentic Chinese products with direct shipping worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="https://cnfans.com/register?ref=137664"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C92910] hover:bg-[#C92910]/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign Up Free
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-full font-semibold text-base border-2 border-gray-200 transition-all duration-200"
              >
                Browse Products
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">1M+ Products</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">200+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                What is the CNFans Spreadsheet?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                The <strong>CNFans Spreadsheet</strong> is your comprehensive product database for finding the best deals on Chinese shopping platforms.
                Our curated <strong>CNFans product spreadsheet</strong> features thousands of verified items from <strong>Taobao</strong>, <strong>1688</strong>, and <strong>Weidian</strong>,
                all organized with prices, categories, and direct purchase links. Browse our <strong>CNFans spreadsheet</strong> to discover authentic Chinese products
                at wholesale prices with worldwide shipping through CNFans's trusted service.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 text-left">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">📊 Comprehensive Database</h3>
                  <p className="text-sm text-gray-600">Our CNFans spreadsheet includes detailed product information, pricing, and seller ratings for easy comparison.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">🔍 Easy Search & Filter</h3>
                  <p className="text-sm text-gray-600">Find exactly what you need in the CNFans product spreadsheet with advanced search and category filters.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">🛒 Direct Purchase Links</h3>
                  <p className="text-sm text-gray-600">Every item in our CNFans spreadsheet includes a direct link to purchase through CNFans with your invite code.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="bg-white">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {/* Products Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                Browse the CNFans Spreadsheet
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our complete CNFans product spreadsheet with {products.length}+ curated items updated daily
              </p>
            </div>

            {/* Filters */}
            <ProductFilters
              categories={categories}
              initialSearch={search}
              initialCategory={category}
              initialCurrency={currency}
            />

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-8">
                  {products.map((product, index) => (
                    <ProductCard
                      key={product._id || index}
                      product={product}
                      currency={currency}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination currentPage={page} hasMore={hasMore} productsCount={products.length} />
              </>
            )}
          </div>
        </section>

        {/* SEO Content Sections */}
        <div className="bg-white">
          <HowItWorks />
          <WhyChooseUs />
          <BlogPreview />
          <FAQ />
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Final CTA */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ready to start saving?
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Join thousands of shoppers getting authentic products at 50-80% off retail prices.
              </p>
              <a
                href="https://cnfans.com/register?ref=137664"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C92910] hover:bg-[#C92910]/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Gift className="w-5 h-5" />
                Get Your Coupons Now
              </a>
            </div>

            {/* Footer Links */}
            <div className="border-t border-gray-200 pt-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Shop</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="/" className="hover:text-[#C92910] transition-colors">All Products</a></li>
                    <li><a href="/?category=fashion" className="hover:text-[#C92910] transition-colors">Fashion</a></li>
                    <li><a href="/?category=electronics" className="hover:text-[#C92910] transition-colors">Electronics</a></li>
                    <li><a href="/?category=home" className="hover:text-[#C92910] transition-colors">Home & Living</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Learn</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="/blog" className="hover:text-[#C92910] transition-colors">Shopping Guides</a></li>
                    <li><a href="/blog/complete-guide-buying-from-taobao-2025" className="hover:text-[#C92910] transition-colors">How to Use Taobao</a></li>
                    <li><a href="/blog/1688-vs-taobao-vs-weidian-comparison-guide" className="hover:text-[#C92910] transition-colors">Platform Comparison</a></li>
                    <li><a href="/blog/how-to-avoid-counterfeit-products-chinese-shopping" className="hover:text-[#C92910] transition-colors">Avoid Counterfeits</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">CNFans</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="https://cnfans.com" target="_blank" rel="noopener" className="hover:text-[#C92910] transition-colors">Official Site</a></li>
                    <li><a href="https://cnfans.com/register?ref=137664" target="_blank" rel="noopener" className="hover:text-[#C92910] transition-colors">Sign Up</a></li>
                    <li><a href="https://cnfans.com/help" target="_blank" rel="noopener" className="hover:text-[#C92910] transition-colors">Help Center</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="https://cnfans.com/contact" target="_blank" rel="noopener" className="hover:text-[#C92910] transition-colors">Contact Support</a></li>
                    <li><span className="text-gray-400">24/7 Available</span></li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
                <p>© {new Date().getFullYear()} CNFans Spreadsheet. Curated products from Chinese shopping platforms.</p>
                <p className="mt-1">Taobao, 1688, and Weidian are trademarks of their respective owners.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Signup Modal */}
      <SignupModal />

      {/* Floating Signup Button */}
      <a
        href="https://cnfans.com/register?ref=137664"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-[#C92910] to-red-700 text-white rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 font-bold text-sm sm:text-base shadow-xl animate-bounce hover:animate-none"
      >
        <Sparkles className="w-5 h-5" />
        <span className="hidden sm:inline">Sign Up!</span>
      </a>
    </div>
  );
}
