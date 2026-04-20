'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Tag, User, Package, ShoppingCart, Star } from 'lucide-react';
import { generateSlug } from '@/lib/slugify';
import { convertPrice, convertToMuleBuy, currencySymbols } from '@/lib/productUtils';
import { trackBuyNowClick } from '@/lib/analytics';

export default function ProductCard({ product, currency }) {
  const searchParams = useSearchParams();
  const productSlug = generateSlug(product.name, product._id);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const currentParams = new URLSearchParams(searchParams.toString());
  const productUrl = `/product/${productSlug}?${currentParams.toString()}`;

  const validImages = product.images
    ?.map(img => typeof img === 'string' ? img : img?.url)
    .filter(img => {
      if (!img || typeof img !== 'string' || img.trim() === '') return false;
      return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
    }) || [];
  const firstImage = validImages[0] || null;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#3B82F6]/20 flex flex-col h-full card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable Card Link */}
      <Link href={productUrl} className="flex-1 flex flex-col">
        {/* Image Container */}
        <div className="relative w-full h-44 sm:h-52 md:h-60 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden cursor-pointer">
          {firstImage && !imageError ? (
            <>
              <Image
                src={firstImage}
                alt={product.name || 'Product'}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#16213e]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Quick view hint */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-[#16213e] rounded-full text-xs font-semibold shadow-lg">
                  View Details
                </span>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#e94560]/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-[#3B82F6]/40" />
                </div>
                <p className="text-xs text-gray-400">No image</p>
              </div>
            </div>
          )}

          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-[#3B82F6] rounded-lg text-[10px] sm:text-xs font-semibold shadow-md border border-[#3B82F6]/10">
                <Tag className="w-2.5 h-2.5" />
                <span className="truncate max-w-[80px]">{product.category}</span>
              </span>
            </div>
          )}

          {/* Store Badge */}
          {product.store && (
            <div className="absolute top-3 right-3 z-10">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold shadow-md ${
                product.store === 'Taobao' ? 'bg-orange-500 text-white' :
                product.store === '1688' ? 'bg-red-500 text-white' :
                product.store === 'Weidian' ? 'bg-blue-500 text-white' :
                'bg-gray-800 text-white'
              }`}>
                {product.store}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="text-sm sm:text-base font-bold text-[#16213e] mb-2 line-clamp-2 group-hover:text-[#3B82F6] transition-colors duration-300">
            {product.name || 'Unnamed Product'}
          </h3>

          {/* Description - Desktop only */}
          <p className="hidden sm:block text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
            {product.description || 'No description available'}
          </p>

          {/* Creator */}
          {product.creatorName && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#3B82F6]/20 to-[#e94560]/20 flex items-center justify-center">
                <User className="w-3 h-3 text-[#3B82F6]" />
              </div>
              <span className="truncate">{product.creatorName}</span>
            </div>
          )}

          {/* Price Section */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Price</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-[#3B82F6]">
                    {currencySymbols[currency]}{convertPrice(product.price, currency)}
                  </span>
                </div>
              </div>
              {/* Rating placeholder */}
              <div className="flex items-center gap-0.5 text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current" />
                <Star className="w-3.5 h-3.5 fill-current opacity-40" />
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Buy Button */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        {product.id && product.store ? (
          <a
            href={convertToMuleBuy(product.id, product.store)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackBuyNowClick(product, 'product_card');
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 btn-primary text-white rounded-xl font-bold text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy on HipoBuy</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        ) : (
          <span className="text-gray-400 text-xs text-center block py-3">Link unavailable</span>
        )}
      </div>
    </div>
  );
}
