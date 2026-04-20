'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import SignupModal from '@/components/SignupModal';
import HowItWorks from '@/components/HowItWorks';
import WhyChooseUs from '@/components/WhyChooseUs';
import BlogPreview from '@/components/BlogPreview';
import FAQ from '@/components/FAQ';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2, X, Gift, Sparkles } from 'lucide-react';

export default function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currency, setCurrency] = useState('USD');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 100,
    hasMore: false
  });

  // Initialize state from URL on mount
  useEffect(() => {
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const curr = searchParams.get('currency') || 'USD';

    setCurrentPage(page);
    setSearchTerm(search);
    setSelectedCategory(category);
    setCurrency(curr);
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchProducts();
    }
  }, [currentPage, selectedCategory, searchTerm, categories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data.categories || ['all']);
    } catch (error) {
      console.error('[Frontend] Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '100'
      });

      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const startTime = Date.now();
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      const duration = Date.now() - startTime;

      console.log(`[Frontend] Received ${data.products?.length || 0} products in ${duration}ms`);

      setProducts(data.products || []);
      setPagination(data.pagination || {
        page: 1,
        limit: 100,
        hasMore: false
      });
    } catch (error) {
      console.error('[Frontend] Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (params) => {
    const urlParams = new URLSearchParams();

    if (params.page && params.page !== 1) {
      urlParams.set('page', params.page.toString());
    }
    if (params.search && params.search.trim()) {
      urlParams.set('search', params.search.trim());
    }
    if (params.category && params.category !== 'all') {
      urlParams.set('category', params.category);
    }
    if (params.currency && params.currency !== 'USD') {
      urlParams.set('currency', params.currency);
    }

    const queryString = urlParams.toString();
    const newUrl = queryString ? `?${queryString}` : '/';
    router.push(newUrl, { scroll: false });
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL({ page: 1, search: value, category: selectedCategory, currency });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
    updateURL({ page: 1, search: searchTerm, category: value, currency });
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    updateURL({ page: currentPage, search: searchTerm, category: selectedCategory, currency: value });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage, search: searchTerm, category: selectedCategory, currency });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const convertPrice = (price) => {
    const conversionRates = {
      USD: 0.14,
      GBP: 0.11,
      EUR: 0.12,
      NZD: 0.23,
      AUD: 0.21,
      CAD: 0.19,
      MXN: 2.55,
      BRL: 0.72,
      KRW: 186.24,
      CNY: 1.0,
      PLN: 0.54,
    };

    const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
    const rate = conversionRates[currency] || 1;
    return (numPrice * rate).toFixed(2);
  };

  const getPlatformId = (platform) => {
    const platformLower = platform?.toLowerCase();
    if (platformLower === '1688') return 0;
    if (platformLower === 'taobao') return 1;
    if (platformLower === 'weidian') return 2;
    return 1;
  };

  const convertToMuleBuy = (id, platform) => {
    const inviteCode = '200001570';
    const platformId = getPlatformId(platform);

    switch (platformId) {
      case 0:
        return `https://mulebuy.com/product/?shop_type=ali_1688&id=${id}&ref=${inviteCode}`;
      case 1:
        return `https://mulebuy.com/product/?shop_type=taobao&id=${id}&ref=${inviteCode}`;
      case 2:
        return `https://mulebuy.com/product/?shop_type=weidian&id=${id}&ref=${inviteCode}`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Add padding-top to account for fixed navbar */}
      <div className="pt-16">
        {/* Apple-Style Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
            {/* Announcement Badge */}
            <div className="flex justify-center mb-6">
              <a
                href="https://mulebuy.com/register?ref=200001570"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/15 rounded-full transition-all duration-300"
              >
                <Gift className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-sm font-semibold text-[#3B82F6]">
                  Get Exclusive Coupons
                </span>
                <Sparkles className="w-4 h-4 text-[#3B82F6] group-hover:rotate-12 transition-transform" />
              </a>
            </div>

            {/* Main Headline - SEO Optimized */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-[#3B82F6] via-red-700 to-blue-500 bg-clip-text text-transparent">
                MuleBuy Spreadsheet
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Best Chinese Shopping Products
              </span>
            </h1>

            {/* Subtitle - Keyword Rich */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              The ultimate MuleBuy product spreadsheet with curated items from Taobao, 1688, and Weidian.
              Save 50-80% on authentic Chinese products with direct shipping worldwide.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="https://mulebuy.com/register?ref=200001570"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
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
                What is the MuleBuy Spreadsheet?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
                The <strong>MuleBuy Spreadsheet</strong> is your comprehensive product database for finding the best deals on Chinese shopping platforms.
                Our curated <strong>MuleBuy product spreadsheet</strong> features thousands of verified items from <strong>Taobao</strong>, <strong>1688</strong>, and <strong>Weidian</strong>,
                all organized with prices, categories, and direct purchase links. Browse our <strong>MuleBuy spreadsheet</strong> to discover authentic Chinese products
                at wholesale prices with worldwide shipping through MuleBuy's trusted service.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 text-left">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">📊 Comprehensive Database</h3>
                  <p className="text-sm text-gray-600">Our MuleBuy spreadsheet includes detailed product information, pricing, and seller ratings for easy comparison.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">🔍 Easy Search & Filter</h3>
                  <p className="text-sm text-gray-600">Find exactly what you need in the MuleBuy product spreadsheet with advanced search and category filters.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-2">🛒 Direct Purchase Links</h3>
                  <p className="text-sm text-gray-600">Every item in our MuleBuy spreadsheet includes a direct link to purchase through MuleBuy with your invite code.</p>
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
                Browse the MuleBuy Spreadsheet
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore our complete MuleBuy product spreadsheet with 100+ curated items updated daily
              </p>
            </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#3B82F6]/20 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#3B82F6] focus:outline-none transition-all text-gray-700 font-medium text-sm sm:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative lg:min-w-[200px]">
              <Filter className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#3B82F6] focus:outline-none transition-all bg-white text-gray-700 font-medium appearance-none cursor-pointer text-sm sm:text-base"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="relative lg:min-w-[150px]">
              <select
                value={currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#3B82F6] focus:outline-none transition-all bg-white text-gray-700 font-medium appearance-none cursor-pointer text-sm sm:text-base"
              >
                <option value="USD">🇺🇸 USD</option>
                <option value="EUR">🇪🇺 EUR</option>
                <option value="GBP">🇬🇧 GBP</option>
                <option value="CAD">🇨🇦 CAD</option>
                <option value="AUD">🇦🇺 AUD</option>
                <option value="CNY">🇨🇳 CNY</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== 'all') && (
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full text-xs sm:text-sm font-medium">
                  <span className="truncate max-w-[120px] sm:max-w-none">Search: "{searchTerm}"</span>
                  <button onClick={() => handleSearch('')} className="hover:bg-[#3B82F6]/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-medium">
                  <span className="truncate max-w-[100px] sm:max-w-none">Category: {selectedCategory}</span>
                  <button onClick={() => handleCategoryChange('all')} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 text-[#3B82F6] animate-spin mb-4" />
            <p className="text-gray-600 text-lg font-medium">Loading amazing products...</p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                handleSearch('');
                handleCategoryChange('all');
              }}
              className="px-6 py-3 bg-[#3B82F6] text-white rounded-xl hover:bg-[#3B82F6]/90 transition-colors font-semibold"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id || index}
                  product={product}
                  currency={currency}
                  convertPrice={convertPrice}
                  convertToMuleBuy={convertToMuleBuy}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-bold text-[#3B82F6]">{products.length}</span> products on page <span className="font-bold">{currentPage}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-2 px-3 sm:px-5 py-3 bg-gradient-to-r from-[#3B82F6] to-red-700 text-white rounded-xl hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>

                <div className="flex items-center px-3 sm:px-6 py-3 bg-gradient-to-r from-blue-100 to-pink-100 rounded-xl">
                  <span className="font-bold text-gray-700 text-sm sm:text-base">Page {currentPage}</span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasMore}
                  className="inline-flex items-center gap-2 px-3 sm:px-5 py-3 bg-gradient-to-r from-[#3B82F6] to-red-700 text-white rounded-xl hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-sm sm:text-base"
                >
                  <span className="sm:hidden">Next</span>
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
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

        {/* Apple-Style Footer */}
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
                href="https://mulebuy.com/register?ref=200001570"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
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
                    <li><a href="/" className="hover:text-[#3B82F6] transition-colors">All Products</a></li>
                    <li><a href="/?category=fashion" className="hover:text-[#3B82F6] transition-colors">Fashion</a></li>
                    <li><a href="/?category=electronics" className="hover:text-[#3B82F6] transition-colors">Electronics</a></li>
                    <li><a href="/?category=home" className="hover:text-[#3B82F6] transition-colors">Home & Living</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Learn</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="/blog" className="hover:text-[#3B82F6] transition-colors">Shopping Guides</a></li>
                    <li><a href="/blog/complete-guide-buying-from-taobao-2025" className="hover:text-[#3B82F6] transition-colors">How to Use Taobao</a></li>
                    <li><a href="/blog/1688-vs-taobao-vs-weidian-comparison-guide" className="hover:text-[#3B82F6] transition-colors">Platform Comparison</a></li>
                    <li><a href="/blog/how-to-avoid-counterfeit-products-chinese-shopping" className="hover:text-[#3B82F6] transition-colors">Avoid Counterfeits</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">MuleBuy</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="https://cnfans.com" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">Official Site</a></li>
                    <li><a href="https://mulebuy.com/register?ref=200001570" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">Sign Up</a></li>
                    <li><a href="https://cnfans.com/help" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">Help Center</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Connect</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="https://cnfans.com/contact" target="_blank" rel="noopener" className="hover:text-[#3B82F6] transition-colors">Contact Support</a></li>
                    <li><span className="text-gray-400">24/7 Available</span></li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
                <p>© {new Date().getFullYear()} MuleBuy Spreadsheet. Curated products from Chinese shopping platforms.</p>
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
        href="https://mulebuy.com/register?ref=200001570"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-[#3B82F6] to-red-700 text-white rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 font-bold text-sm sm:text-base shadow-xl animate-bounce hover:animate-none"
      >
        <Sparkles className="w-5 h-5" />
        <span className="hidden sm:inline">Sign Up!</span>
      </a>
    </div>
  );
}
