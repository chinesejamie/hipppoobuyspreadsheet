'use client';

import { ShoppingCart } from 'lucide-react';
import { trackBuyNowClick } from '@/lib/analytics';

export default function BuyNowButton({ product, href }) {
  const handleClick = () => {
    // Track the click in Google Analytics
    trackBuyNowClick(product, 'product_page');
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full"
    >
      <button className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C92910] to-red-700 text-white rounded-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 font-bold text-lg">
        <ShoppingCart className="w-6 h-6" />
        Buy Now on CNFans
      </button>
    </a>
  );
}
