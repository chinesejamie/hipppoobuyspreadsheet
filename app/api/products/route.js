import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Product from '@/models/Product';
import connectToDatabase from '@/lib/mongodb';

// Helper function CNY → USD
const convertCnyToUsd = (cny) => (cny * 0.14).toFixed(2);

export async function GET(request) {
  // 1) Connect to DB
  await connectToDatabase();

  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const creatorName = url.searchParams.get('creatorName');
  const category = url.searchParams.get('category');
  const page = Number(url.searchParams.get('page') ?? '1');
  const limit = Number(url.searchParams.get('limit') ?? '100');
  const now = new Date();

  // 2) Base Query
  const mongoQuery = {};
  if (search) {
    const rx = new RegExp(String(search), 'i');
    mongoQuery.$or = [
      { name: { $regex: rx } },
      { description: { $regex: rx } },
      { creatorName: { $regex: rx } },
      { id: { $regex: rx } },
      { link: { $regex: rx } },
    ];
  }
  if (category && category !== 'All') {
    mongoQuery.category = category;
  }
  if (creatorName) {
    mongoQuery.creatorName = new RegExp(String(creatorName), 'i');
  }

  // 3) Counts
  const rawCount = await mongoose.connection.db.collection(Product.collection.name).countDocuments();
  const exactCount = await Product.countDocuments({});
  const filteredCount = Object.keys(mongoQuery).length
    ? await Product.countDocuments(mongoQuery)
    : exactCount;

  // 4) Page ID for Boosts - UPDATED TO NEW PAGE ID
  const pageId = '692d53b66be92af615b19149';

  // 5) Aggregation Pipeline
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
                      { $eq: ['$$b.boostPage', pageId] },
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
    { $limit: limit },
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        creatorName: 1,
        store: 1,
        id: 1,
        mainImage: { $arrayElemAt: ['$images', 0] },
        images: 1,
        viewCount: 1,
        purchased: 1,
        category: 1,
        findsOfTheWeekUntil: 1,
        boostAmount: '$totalBoostForPage'
      }
    }
  ];

  // 6) Execute Aggregation
  const products = await Product.aggregate(pipeline);

  if (!products.length) {
    return NextResponse.json({ message: 'No products found' }, { status: 404 });
  }

  // 7) Convert results
  const converted = products.map(p => {
    // Extract mainImage URL (handle object or string)
    let mainImageUrl = '/images/default-product.jpg';
    if (p.mainImage) {
      if (typeof p.mainImage === 'string') {
        mainImageUrl = p.mainImage;
      } else if (p.mainImage.url) {
        mainImageUrl = p.mainImage.url;
      }
    }

    // Convert images array to strings (handle objects with url property)
    const normalizedImages = p.images?.map(img =>
      typeof img === 'string' ? img : img?.url || ''
    ).filter(url => url !== '') || [];

    const result = {
      ...p,
      price: typeof p.price === 'number' ? convertCnyToUsd(p.price) : p.price,
      mainImage: mainImageUrl,
      images: normalizedImages,
    };

    // Debug: Log first 3 products' images
    if (products.indexOf(p) < 3) {
      console.log(`[API DEBUG] Product "${p.name}":`, {
        hasImages: !!p.images,
        imageCount: p.images?.length || 0,
        firstImageRaw: p.images?.[0],
        normalizedImages: normalizedImages.slice(0, 2),
        mainImage: result.mainImage
      });
    }

    return result;
  });

  // 8) Response
  return NextResponse.json({
    products: converted,
    totalProducts: filteredCount,
    totalCollectionSize: rawCount,
    collectionName: Product.collection.name,
    databaseInfo: {
      database: mongoose.connection.db.databaseName,
      collection: Product.collection.name,
      model: Product.modelName,
      estimatedCount: await Product.estimatedDocumentCount(),
      exactCount,
      filteredCount,
    },
    pagination: {
      page,
      limit,
      hasMore: products.length === limit
    }
  });
}
