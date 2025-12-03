'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';

export default function ProductFilters({ categories, initialSearch, initialCategory, initialCurrency }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set('search', value.trim());
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to page 1
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.delete('page'); // Reset to page 1
    router.push(`/?${params.toString()}`);
  };

  const handleCurrencyChange = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'USD') {
      params.set('currency', value);
    } else {
      params.delete('currency');
    }
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/');
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#C92910]/20 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
      <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={initialSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#C92910] focus:outline-none transition-all text-gray-700 font-medium text-sm sm:text-base"
          />
          {initialSearch && (
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
            value={initialCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#C92910] focus:outline-none transition-all bg-white text-gray-700 font-medium appearance-none cursor-pointer text-sm sm:text-base"
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
            value={initialCurrency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-[#C92910] focus:outline-none transition-all bg-white text-gray-700 font-medium appearance-none cursor-pointer text-sm sm:text-base"
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
      {(initialSearch || initialCategory !== 'all') && (
        <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">Active filters:</span>
          {initialSearch && (
            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-[#C92910]/10 text-[#C92910] rounded-full text-xs sm:text-sm font-medium">
              <span className="truncate max-w-[120px] sm:max-w-none">Search: "{initialSearch}"</span>
              <button onClick={() => handleSearch('')} className="hover:bg-[#C92910]/20 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {initialCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium">
              <span className="truncate max-w-[100px] sm:max-w-none">Category: {initialCategory}</span>
              <button onClick={() => handleCategoryChange('all')} className="hover:bg-purple-200 rounded-full p-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
