import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import Pagination from '@/components/Pagination';
import SignupModal from '@/components/SignupModal';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import BlogPreview from '@/components/BlogPreview';
import FAQ from '@/components/FAQ';
import { Zap, Shield, Truck, Star, TrendingUp, Users, Package, ArrowRight, Sparkles, Crown } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

// Enable dynamic rendering for real-time product updates
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// Generate metadata for SEO
export const metadata = {
  title: "HipoBuy Spreadsheet 2025 - Best Chinese Product Database | Taobao, 1688, Weidian Deals",
  description: "Discover the #1 HipoBuy Spreadsheet with 10,000+ curated products from Taobao, 1688 & Weidian. Save 50-80% on authentic Chinese products. Updated daily with the best deals and direct purchase links.",
};

// Fetch categories - cached for 10 minutes
let categoriesCache = null;
let categoriesCacheTime = 0;
const CATEGORIES_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

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

// Fetch products
async function getProducts(searchParams) {
  const DEBUG = process.env.DEBUG_MODE === 'true';
  const startTime = DEBUG ? Date.now() : 0;

  try {
    const connection = await connectToDatabase();
    if (DEBUG) console.log(`[SSR] DB connected in ${Date.now() - startTime}ms`);

    const page = Number(searchParams.page) || 1;
    const requestedLimit = Number(process.env.PRODUCTS_PER_PAGE) || 100;
    const MAX_LIMIT = 100;
    const limit = Math.min(requestedLimit, MAX_LIMIT);

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

    // Get page IDs for boosts (support both CNFans and HipoBuy pages)
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
          images: 1
        }
      }
    ];

    const results = await Product.aggregate(pipeline);

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

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;

  const [categories, { products, hasMore, page }] = await Promise.all([
    getCategories(),
    getProducts(resolvedParams)
  ]);

  const currency = resolvedParams.currency?.trim() || 'USD';
  const search = resolvedParams.search || '';
  const category = resolvedParams.category || 'all';

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* SEO Backlinks - Hidden but crawlable */}
      <nav className="seo-links" aria-label="Partner sites">
        <a href="https://oopbuysheet.com" title="OopBuy Sheet - Chinese Shopping Spreadsheet">OopBuy Spreadsheet</a>
        <a href="https://oopbuyspreadsheet.com" title="OopBuy Spreadsheet - Best Taobao Deals">OopBuy Product Database</a>
        <a href="https://orientdigfinds.com" title="Orient Dig Finds - Chinese Product Discovery">Orient Dig Finds</a>
        <a href="https://kakobuy-spreadsheet.com" title="KakoBuy Spreadsheet - 1688 Weidian Products">KakoBuy Spreadsheet</a>
        <a href="https://cnfansportal.com" title="CNFans Portal - Chinese Shopping Agent">CNFans Portal Spreadsheet</a>
      </nav>

      <div className="pt-16">
        {/* Hero Section - Completely New Design */}
        <section className="relative overflow-hidden bg-[#16213e] min-h-[90vh] flex items-center">
          {/* Animated background */}
          <div className="absolute inset-0 gradient-bg opacity-90"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 grid-pattern opacity-30"></div>

          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#3B82F6] rounded-full filter blur-[120px] opacity-30 float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e94560] rounded-full filter blur-[150px] opacity-20 float" style={{animationDelay: '-3s'}}></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">2025 Best HipoBuy Spreadsheet</span>
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
              <span className="block">HipoBuy</span>
              <span className="text-gradient">Spreadsheet</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              The ultimate <strong className="text-[#e94560]">HipoBuy spreadsheet</strong> with 10,000+ verified products from
              Taobao, 1688 & Weidian. Save up to <strong className="text-[#00d9a5]">80%</strong> on authentic Chinese products.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a
                href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-primary px-10 py-5 text-white rounded-2xl font-bold text-lg inline-flex items-center gap-3 pulse-glow"
              >
                <Zap className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#products"
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/20 transition-all inline-flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Browse Products
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: '10K+', label: 'Products', icon: Package },
                { value: '50-80%', label: 'Savings', icon: TrendingUp },
                { value: '200+', label: 'Countries', icon: Truck },
                { value: '24/7', label: 'Support', icon: Users },
              ].map((stat, index) => (
                <div key={index} className="glass rounded-2xl p-6 text-center">
                  <stat.icon className="w-8 h-8 text-[#3B82F6] mx-auto mb-2" />
                  <div className="text-3xl font-black text-[#16213e]">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-white/80 rounded-full"></div>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
              <span className="font-semibold text-gray-700">Trusted platforms:</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span>Taobao</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span>1688</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span>Weidian</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full"></span>Secure Payments</span>
              <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-400 rounded-full"></span>Buyer Protection</span>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full text-sm font-semibold mb-4">
                ABOUT HIPOBUY SPREADSHEET
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#16213e] mb-6">
                The Ultimate HipoBuy Spreadsheet Database
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                The <strong>HipoBuy Spreadsheet</strong> is your comprehensive guide to the best deals on Chinese e-commerce platforms.
                Our expertly curated <strong>HipoBuy product spreadsheet</strong> features verified products from <strong>Taobao</strong>, <strong>1688</strong>, and <strong>Weidian</strong>,
                complete with pricing, seller ratings, and direct purchase links through HipoBuy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Star,
                  title: 'Curated Selection',
                  description: 'Every product is hand-picked and verified by our team. Only the best deals make it to our HipoBuy spreadsheet database.',
                  color: 'from-yellow-400 to-orange-500'
                },
                {
                  icon: Shield,
                  title: 'Buyer Protection',
                  description: 'Shop with confidence knowing every purchase is protected. Quality inspections and secure payments guaranteed through HipoBuy.',
                  color: 'from-[#3B82F6] to-[#e94560]'
                },
                {
                  icon: Truck,
                  title: 'Global Shipping',
                  description: 'Fast delivery to 200+ countries. Multiple shipping options from express to economy to fit your needs.',
                  color: 'from-[#00d9a5] to-teal-500'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 card-hover">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#16213e] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="bg-gray-50 py-16">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 bg-[#e94560]/10 text-[#e94560] rounded-full text-sm font-semibold mb-4">
                PRODUCT CATALOG
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#16213e] mb-4">
                Browse Our Collection
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore {products.length}+ verified products updated daily. Find the best deals from Chinese platforms.
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
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#e94560]/20 flex items-center justify-center">
                  <Package className="w-12 h-12 text-[#3B82F6]" />
                </div>
                <h3 className="text-2xl font-bold text-[#16213e] mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
                  {products.map((product, index) => (
                    <ProductCard
                      key={product._id || index}
                      product={product}
                      currency={currency}
                    />
                  ))}
                </div>

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

        {/* Partner Network Section - Contains SEO Backlinks */}
        <section className="bg-[#16213e] py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Trusted Shopping Network</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Part of the largest Chinese shopping agent network. Access products across multiple verified platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="https://oopbuysheet.com" target="_blank" rel="noopener" className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium">
                OopBuy Sheet
              </a>
              <a href="https://oopbuyspreadsheet.com" target="_blank" rel="noopener" className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium">
                OopBuy Spreadsheet
              </a>
              <a href="https://orientdigfinds.com" target="_blank" rel="noopener" className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium">
                Orient Dig Finds
              </a>
              <a href="https://kakobuy-spreadsheet.com" target="_blank" rel="noopener" className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium">
                KakoBuy Spreadsheet
              </a>
              <a href="https://cnfansportal.com" target="_blank" rel="noopener" className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all text-sm font-medium">
                CNFans Portal
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#0f172a] text-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            {/* Main Footer Content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#e94560] flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-black">HipoBuy</span>
                    <span className="text-xs text-gray-400 block">Spreadsheet</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  The ultimate HipoBuy spreadsheet for Chinese product shopping. Verified deals from Taobao, 1688, and Weidian.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-4 text-white">Shop</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/" className="hover:text-[#e94560] transition-colors">All Products</a></li>
                  <li><a href="/?category=Fashion" className="hover:text-[#e94560] transition-colors">Fashion</a></li>
                  <li><a href="/?category=Electronics" className="hover:text-[#e94560] transition-colors">Electronics</a></li>
                  <li><a href="/?category=Home" className="hover:text-[#e94560] transition-colors">Home & Living</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4 text-white">Resources</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/blog" className="hover:text-[#e94560] transition-colors">Shopping Guides</a></li>
                  <li><a href="/blog/complete-guide-buying-from-taobao-2025" className="hover:text-[#e94560] transition-colors">Taobao Guide</a></li>
                  <li><a href="/blog/1688-vs-taobao-vs-weidian-comparison-guide" className="hover:text-[#e94560] transition-colors">Platform Comparison</a></li>
                  <li><a href="/blog/how-to-avoid-counterfeit-products-chinese-shopping" className="hover:text-[#e94560] transition-colors">Safety Tips</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold mb-4 text-white">HipoBuy</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="https://hipobuy.com" target="_blank" rel="noopener" className="hover:text-[#e94560] transition-colors">Official Site</a></li>
                  <li><a href="https://hipobuy.com/register?inviteCode=LKG2UDAUS" target="_blank" rel="noopener" className="hover:text-[#e94560] transition-colors">Sign Up</a></li>
                  <li><a href="https://hipobuy.com/help" target="_blank" rel="noopener" className="hover:text-[#e94560] transition-colors">Help Center</a></li>
                </ul>
              </div>
            </div>

            {/* SEO Footer Links */}
            <div className="border-t border-gray-800 pt-8 mb-8">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <span>Partner Network:</span>
                <a href="https://oopbuysheet.com" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">OopBuy Sheet</a>
                <a href="https://oopbuyspreadsheet.com" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">OopBuy Spreadsheet</a>
                <a href="https://orientdigfinds.com" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">Orient Dig Finds</a>
                <a href="https://kakobuy-spreadsheet.com" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">KakoBuy Spreadsheet</a>
                <a href="https://cnfansportal.com" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">CNFans Portal</a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-sm text-gray-500 border-t border-gray-800 pt-8">
              <p>&copy; {new Date().getFullYear()} HipoBuy Spreadsheet. The best Chinese shopping product database.</p>
              <p className="mt-2 text-xs">
                Taobao, 1688, and Weidian are trademarks of their respective owners.
                HipoBuy Spreadsheet is not affiliated with Alibaba Group.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Signup Modal */}
      <SignupModal />

      {/* Floating CTA Button */}
      <a
        href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 btn-primary px-6 py-4 text-white rounded-2xl font-bold shadow-2xl inline-flex items-center gap-2 hover:scale-110 transition-transform"
      >
        <Sparkles className="w-5 h-5" />
        <span className="hidden sm:inline">Sign Up Free</span>
      </a>
    </div>
  );
}
