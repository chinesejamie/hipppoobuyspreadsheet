'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Package } from 'lucide-react';

export default function ProductImageGallery({ images, productName }) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-4">
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">No image available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden p-4">
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
          <Image
            src={images[selectedImage]}
            alt={`${productName} - Image ${selectedImage + 1}`}
            fill
            unoptimized
            className="object-contain p-4"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 8).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`bg-white rounded-xl shadow-md border-2 overflow-hidden p-2 transition-all duration-200 cursor-pointer ${
                selectedImage === idx
                  ? 'border-[#FF186B] ring-2 ring-[#FF186B]/30 scale-105'
                  : 'border-gray-200 hover:border-[#FF186B]/50 hover:scale-105'
              }`}
            >
              <div className="relative aspect-square">
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                  sizes="100px"
                />
              </div>
              {selectedImage === idx && (
                <div className="absolute inset-0 bg-[#FF186B]/10 rounded-lg pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Image <span className="font-bold text-[#FF186B]">{selectedImage + 1}</span> of{' '}
            <span className="font-bold">{Math.min(images.length, 8)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
