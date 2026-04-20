'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function Pagination({ currentPage, hasMore, productsCount }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [clickedButton, setClickedButton] = useState(null);

  const handlePageChange = (newPage, direction) => {
    setClickedButton(direction);

    // Immediately show loading overlay
    const productsSection = document.getElementById('products');
    if (productsSection) {
      // Create and show loading overlay
      const overlay = document.createElement('div');
      overlay.id = 'page-loading-overlay';
      overlay.className = 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center';
      overlay.innerHTML = `
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#3B82F6] border-t-transparent mb-4"></div>
          <p class="text-xl font-bold text-gray-900">Loading Page ${newPage}...</p>
          <p class="text-sm text-gray-600 mt-2">Please wait</p>
        </div>
      `;
      document.body.appendChild(overlay);

      // Scroll to products section smoothly
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update URL and navigate
    const params = new URLSearchParams(searchParams);
    if (newPage > 1) {
      params.set('page', newPage.toString());
    } else {
      params.delete('page');
    }

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}#products` : '/#products';

    // Navigate after a tiny delay to show overlay
    setTimeout(() => {
      window.location.href = newUrl;
    }, 50);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6">
      <div className="text-xs sm:text-sm text-gray-600">
        Showing <span className="font-bold text-[#3B82F6]">{productsCount}</span> products on page <span className="font-bold">{currentPage}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1, 'prev')}
          disabled={currentPage === 1 || clickedButton}
          className="group inline-flex items-center gap-2 px-3 sm:px-5 py-3 bg-gradient-to-r from-[#3B82F6] to-red-700 text-white rounded-xl hover:shadow-2xl hover:scale-105 hover:from-pink-600 hover:to-[#3B82F6] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none active:scale-95 transition-all duration-300 font-semibold text-sm sm:text-base"
        >
          {clickedButton === 'prev' ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          )}
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className={`flex items-center px-3 sm:px-6 py-3 bg-gradient-to-r from-blue-100 to-pink-100 rounded-xl border-2 border-[#3B82F6]/20 shadow-md transition-all ${clickedButton ? 'animate-pulse' : ''}`}>
          {clickedButton ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-[#3B82F6] mr-2" />
          ) : null}
          <span className="font-bold text-gray-700 text-sm sm:text-base">Page {currentPage}</span>
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1, 'next')}
          disabled={!hasMore || clickedButton}
          className="group inline-flex items-center gap-2 px-3 sm:px-5 py-3 bg-gradient-to-r from-[#3B82F6] to-red-700 text-white rounded-xl hover:shadow-2xl hover:scale-105 hover:from-pink-600 hover:to-[#3B82F6] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none active:scale-95 transition-all duration-300 font-semibold text-sm sm:text-base"
        >
          <span className="sm:hidden">Next</span>
          <span className="hidden sm:inline">Next</span>
          {clickedButton === 'next' ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          )}
        </button>
      </div>
    </div>
  );
}
