import { notFound } from 'next/navigation';
import { Tag, User, Store, Info, Gift, Sparkles } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { extractIdFromSlug } from '@/lib/slugify';
import BackButton from '@/components/BackButton';
import ProductImageGallery from '@/components/ProductImageGallery';
import BuyNowButton from '@/components/BuyNowButton';
import { convertToMuleBuy, currencySymbols, conversionRates } from '@/lib/productUtils';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = extractIdFromSlug(resolvedParams.id);

  try {
    await connectDB();
    const product = await Product.findById(productId).select('name description price category images store').lean();

    if (!product) {
      return {
        title: 'Product Not Found - HipoBuy',
        description: 'The product you are looking for could not be found.'
      };
    }

    const validImages = product.images
      ?.map(img => typeof img === 'string' ? img : img?.url)
      .filter(img => img && typeof img === 'string' && img.trim() !== '') || [];
    const imageUrl = validImages[0] || null;

    return {
      title: `${product.name} - ${product.category || 'Product'} | HipoBuy Spreadsheet`,
      description: product.description || `Buy ${product.name} from ${product.store || 'Chinese shopping platforms'}. Best deals on authentic products.`,
      keywords: `${product.name}, ${product.category}, ${product.store}, Chinese shopping, HipoBuy, buy online, cheap deals`,
      openGraph: {
        title: product.name,
        description: product.description || `Buy ${product.name} from ${product.store}`,
        ...(imageUrl && { images: [imageUrl] }),
        type: 'website',
        siteName: 'HipoBuy Spreadsheet',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        ...(imageUrl && { images: [imageUrl] }),
      },
      alternates: {
        canonical: `/product/${resolvedParams.id}`
      }
    };
  } catch (error) {
    return {
      title: 'Product - HipoBuy',
      description: 'Find the best deals on Chinese shopping platforms'
    };
  }
}

async function getProduct(id) {
  try {
    await connectDB();
    const product = await Product.findById(id).select('name description price category images creatorName store id').lean();

    if (!product) {
      return null;
    }

    // Serialize the entire object to remove any MongoDB-specific types
    return JSON.parse(JSON.stringify({
      ...product,
      _id: product._id.toString(),
      // Ensure images are properly serialized
      images: product.images?.map(img => {
        if (typeof img === 'string') return img;
        if (img?.url) return img.url;
        return null;
      }).filter(Boolean) || []
    }));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const productId = extractIdFromSlug(resolvedParams.id);
  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const validImages = product.images
    ?.map(img => typeof img === 'string' ? img : img?.url)
    .filter(img => {
      if (!img || typeof img !== 'string' || img.trim() === '') return false;
      // Allow /uploads/, /assets/ paths (they'll be rewritten by next.config.js)
      // Allow HTTP(S) URLs
      // Allow paths starting with /
      return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
    }) || [];

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    ...(validImages.length > 0 && { "image": validImages }),
    "description": product.description || `Buy ${product.name}`,
    "brand": {
      "@type": "Brand",
      "name": product.store || "HipoBuy"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://hipobuyspreadsheet.com/product/${product._id}`,
      "priceCurrency": "CNY",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": product.creatorName || "HipoBuy"
      }
    },
    "category": product.category
  };

  const returnParams = new URLSearchParams();
  if (resolvedSearchParams.page) returnParams.set('page', resolvedSearchParams.page);
  if (resolvedSearchParams.search) returnParams.set('search', resolvedSearchParams.search);
  if (resolvedSearchParams.category) returnParams.set('category', resolvedSearchParams.category);
  if (resolvedSearchParams.currency) returnParams.set('currency', resolvedSearchParams.currency);

  const returnUrl = returnParams.toString() ? `/?${returnParams.toString()}` : '/';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <BackButton returnUrl={returnUrl} />

          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            {/* Left Column - Images */}
            <ProductImageGallery images={validImages} productName={product.name} />

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Product Header Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3B82F6]/10 text-[#3B82F6] rounded-full text-sm font-semibold">
                      <Tag className="w-3.5 h-3.5" />
                      {product.category}
                    </span>
                  )}
                  {product.store && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      <Store className="w-3.5 h-3.5" />
                      {product.store}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name || 'Unnamed Product'}
                </h1>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>

                {/* Creator */}
                {product.creatorName && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3B82F6]/10">
                      <User className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Listed by</p>
                      <p className="text-sm font-semibold text-gray-900">{product.creatorName}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-[#3B82F6]/5 via-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-[#3B82F6]/20 p-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Pricing</h3>
                <div className="space-y-3">
                  {Object.entries(conversionRates).map(([curr, rate]) => (
                    <div key={curr} className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">{curr}</span>
                      <span className="text-2xl font-bold text-[#3B82F6]">
                        {currencySymbols[curr]}{(product.price * rate).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy Button */}
              {product.id && product.store ? (
                <BuyNowButton
                  product={{
                    _id: product._id,
                    name: product.name,
                    category: product.category,
                    price: product.price
                  }}
                  href={convertToMuleBuy(product.id, product.store)}
                />
              ) : (
                <div className="w-full text-center py-4 bg-gray-100 rounded-xl text-gray-500 font-medium">
                  Product link not available
                </div>
              )}

              {/* Product Details Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-[#3B82F6]" />
                  <h3 className="font-bold text-gray-900">Product Details</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Platform</span>
                    <span className="font-semibold text-gray-900">{product.store || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">{product.category || 'Uncategorized'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Product ID</span>
                    <span className="font-mono text-sm font-semibold text-gray-900">{product.id || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Signup CTA Banner */}
          <div className="mt-8 bg-gradient-to-r from-[#3B82F6] via-red-700 to-blue-500 rounded-2xl shadow-2xl border-2 border-pink-300 p-6 sm:p-8 text-center overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-4 left-4">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
              <div className="absolute bottom-4 right-4">
                <Gift className="w-16 h-16 text-white animate-bounce" />
              </div>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Want This at an Even Better Price?
              </h2>
              <p className="text-white/90 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
                Sign up now and get exclusive coupon codes to save even more on this product and thousands of others!
              </p>
              <a
                href="https://hipobuy.com/register?inviteCode=LKG2UDAUS"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#3B82F6] rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"
              >
                <Gift className="w-6 h-6" />
                Get Your Coupons Now!
                <Sparkles className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* SEO Content Card */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">
                Looking to buy <strong>{product.name}</strong>? You've found the right place! This product is available through
                trusted Chinese shopping platforms including {product.store || '1688, Taobao, and Weidian'}. HipoBuy Spreadsheet
                helps you discover authentic products at the best prices directly from Chinese suppliers.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This {product.category || 'product'} is carefully curated and listed by {product.creatorName || 'our team'},
                ensuring you get quality products at competitive prices. Shop with confidence using our affiliate link to HipoBuy,
                your trusted shopping agent for Chinese platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
