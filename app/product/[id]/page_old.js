import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Tag, User, Store, ShoppingCart } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { extractIdFromSlug } from '@/lib/slugify';
import BackButton from '@/components/BackButton';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const productId = extractIdFromSlug(resolvedParams.id);

  try {
    await connectDB();
    const product = await Product.findById(productId).select('name description price category images store').lean();

    if (!product) {
      return {
        title: 'Product Not Found - CNFans',
        description: 'The product you are looking for could not be found.'
      };
    }

    // Filter out empty image URLs - handle both string and object formats
    const validImages = product.images
      ?.map(img => typeof img === 'string' ? img : img?.url)
      .filter(img => img && typeof img === 'string' && img.trim() !== '') || [];
    const imageUrl = validImages[0] || null;

    return {
      title: `${product.name} - ${product.category || 'Product'} | CNFans Spreadsheet`,
      description: product.description || `Buy ${product.name} from ${product.store || 'Chinese shopping platforms'}. Best deals on authentic products.`,
      keywords: `${product.name}, ${product.category}, ${product.store}, Chinese shopping, CNFans, buy online, cheap deals`,
      openGraph: {
        title: product.name,
        description: product.description || `Buy ${product.name} from ${product.store}`,
        ...(imageUrl && { images: [imageUrl] }),
        type: 'website',
        siteName: 'CNFans Spreadsheet',
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
      title: 'Product - CNFans',
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

    // Convert MongoDB _id to string
    return {
      ...product,
      _id: product._id.toString()
    };
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

  const convertToJoyaBuy = (productId, store) => {
    const inviteCode = '137664';
    const platformMap = {
      '1688': 'ali_1688',
      'Taobao': 'taobao',
      'Weidian': 'weidian',
    };
    const shopType = platformMap[store] || 'taobao';
    return `https://cnfans.com/product/?shop_type=${shopType}&id=${productId}&ref=${inviteCode}`;
  };

  const currencySymbols = {
    USD: '$',
    GBP: '£',
    EUR: '€',
    CNY: '¥',
  };

  const conversionRates = {
    USD: 0.14,
    GBP: 0.11,
    EUR: 0.12,
    CNY: 1.0,
  };

  // JSON-LD structured data for SEO
  // Filter out empty image URLs - handle both string and object formats
  const validImages = product.images
    ?.map(img => typeof img === 'string' ? img : img?.url)
    .filter(img => img && typeof img === 'string' && img.trim() !== '') || [];

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    ...(validImages.length > 0 && { "image": validImages }),
    "description": product.description || `Buy ${product.name}`,
    "brand": {
      "@type": "Brand",
      "name": product.store || "CNFans"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cnfansportal.com/product/${product._id}`,
      "priceCurrency": "CNY",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": product.creatorName || "CNFans"
      }
    },
    "category": product.category
  };

  // Reconstruct the return URL with all the original filters
  const returnParams = new URLSearchParams();
  if (resolvedSearchParams.page) returnParams.set('page', resolvedSearchParams.page);
  if (resolvedSearchParams.search) returnParams.set('search', resolvedSearchParams.search);
  if (resolvedSearchParams.category) returnParams.set('category', resolvedSearchParams.category);
  if (resolvedSearchParams.currency) returnParams.set('currency', resolvedSearchParams.currency);

  const returnUrl = returnParams.toString() ? `/?${returnParams.toString()}` : '/';

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <BackButton returnUrl={returnUrl} />

          {/* Product Details */}
          <div className="bg-white rounded-3xl shadow-2xl border-2 border-[#C92910]/20 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden">
                  {validImages[0] ? (
                    <Image
                      src={validImages[0]}
                      alt={product.name || 'Product'}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                          <Tag className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="text-gray-400">No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {validImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {validImages.slice(0, 4).map((img, idx) => (
                      <div key={idx} className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#C92910]/10 text-[#C92910] rounded-full text-sm font-semibold">
                      <Tag className="w-4 h-4" />
                      {product.category}
                    </span>
                  )}
                  {product.store && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      <Store className="w-4 h-4" />
                      {product.store}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name || 'Unnamed Product'}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>

                {/* Creator */}
                {product.creatorName && (
                  <div className="flex items-center gap-2 mb-6 text-gray-600">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Listed by: {product.creatorName}</span>
                  </div>
                )}

                {/* Price Section */}
                <div className="bg-gradient-to-r from-[#C92910]/10 to-purple-100 rounded-2xl p-6 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <div className="space-y-2">
                    {Object.entries(conversionRates).map(([curr, rate]) => (
                      <div key={curr} className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{curr}</span>
                        <span className="text-2xl font-bold text-[#C92910]">
                          {currencySymbols[curr]}{(product.price * rate).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buy Button */}
                {product.id && product.store ? (
                  <a
                    href={convertToJoyaBuy(product.id, product.store)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C92910] to-red-700 text-white rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 font-bold text-lg"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Buy Now on CNFans
                    <ExternalLink className="w-5 h-5" />
                  </a>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    Product link not available
                  </div>
                )}

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Platform:</strong> {product.store || 'N/A'}</p>
                    <p><strong>Category:</strong> {product.category || 'Uncategorized'}</p>
                    <p><strong>Product ID:</strong> {product.id || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Looking to buy <strong>{product.name}</strong>? You've found the right place! This product is available through
                trusted Chinese shopping platforms including {product.store || '1688, Taobao, and Weidian'}. CNFans Spreadsheet
                helps you discover authentic products at the best prices directly from Chinese suppliers.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                This {product.category || 'product'} is carefully curated and listed by {product.creatorName || 'our team'},
                ensuring you get quality products at competitive prices. Shop with confidence using our affiliate link to CNFans,
                your trusted shopping agent for Chinese platforms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
