'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Tag, User, Package } from 'lucide-react';
import { generateSlug } from '@/lib/slugify';
import { convertPrice, convertToOopBuy, currencySymbols } from '@/lib/productUtils';
import { trackBuyNowClick } from '@/lib/analytics';

export default function ProductCard({ product, currency }) {
  const searchParams = useSearchParams();
  const productSlug = generateSlug(product.name, product._id);
  const [imageError, setImageError] = useState(false);

  // Preserve current page state in the product URL
  const currentParams = new URLSearchParams(searchParams.toString());
  const productUrl = `/product/${productSlug}?${currentParams.toString()}`;

  // Filter out empty and invalid image URLs - handle both string and object formats
  const validImages = product.images
    ?.map(img => typeof img === 'string' ? img : img?.url)
    .filter(img => {
      if (!img || typeof img !== 'string' || img.trim() === '') return false;
      // Allow /assets/ paths (they'll be rewritten by next.config.js)
      // Allow HTTP(S) URLs
      // Allow paths starting with /
      return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
    }) || [];
  const firstImage = validImages[0] || null;

  // Debug logging (controlled by DEBUG_MODE)
  if (typeof window !== 'undefined' && window.DEBUG_MODE && product.name) {
    console.log(`[ProductCard] ${product.name}:`, {
      totalImages: product.images?.length || 0,
      validImages: validImages.length,
      firstImage: firstImage || 'NO IMAGE',
      imageError
    });
  }

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#FF186B]/30 flex flex-col h-full">
      {/* Clickable Card Link */}
      <Link href={productUrl} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer">
        {firstImage && !imageError ? (
          <>
            <Image
              src={firstImage}
              alt={product.name || 'Product'}
              fill
              unoptimized
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-sm text-gray-400">No image</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="inline-flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/95 backdrop-blur-sm text-[#FF186B] rounded-full text-[10px] sm:text-xs font-semibold shadow-lg">
              <Tag className="w-2 h-2 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">{product.category}</span>
              <span className="sm:hidden truncate max-w-[60px]">{product.category}</span>
            </span>
          </div>
        )}

        {/* Store Badge */}
        {product.store && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-black/80 backdrop-blur-sm text-white rounded text-[10px] sm:text-xs font-medium">
              {product.store}
            </span>
          </div>
        )}
      </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-[#FF186B] transition-colors">
            {product.name || 'Unnamed Product'}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2 flex-1 hidden sm:block">
            {product.description || 'No description available'}
          </p>

          {/* Creator */}
          {product.creatorName && (
            <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="truncate">{product.creatorName}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 sm:pt-3 md:pt-4 border-t border-gray-100">
            {/* Price */}
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Price</span>
              <span className="text-base sm:text-xl lg:text-2xl font-bold text-[#FF186B]">
                {currencySymbols[currency]}{convertPrice(product.price, currency)}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Buy Button - Outside Link to prevent nested links */}
      <div className="px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5">
        {product.id && product.store ? (
          <a
            href={convertToOopBuy(product.id, product.store)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              // Track the click in Google Analytics
              trackBuyNowClick(product, 'product_card');
            }}
            className="inline-flex items-center justify-center gap-1 sm:gap-2 w-full px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 lg:py-2.5 bg-gradient-to-r from-[#FF186B] to-pink-600 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Buy Now</span>
            <span className="sm:hidden">Buy</span>
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        ) : (
          <span className="text-gray-400 text-xs sm:text-sm text-center block">No link</span>
        )}
      </div>
    </div>
  );
}
