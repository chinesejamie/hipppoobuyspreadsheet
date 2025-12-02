import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const creatorName = searchParams.get('creatorName');
  const productName = searchParams.get('productName');
  const currency = searchParams.get('currency') || 'CNY';

  if (!creatorName || !productName) {
    return NextResponse.json(
      { message: "creatorName and productName are required" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    let product = await Product.findOneAndUpdate(
      { creatorName, name: productName },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).lean();

    if (!product) {
      return NextResponse.json(
        { message: "No products found" },
        { status: 404 }
      );
    }

    console.log("Original Price:", product.price);

    try {
      if (typeof product.price === 'number' && !isNaN(product.price)) {
        console.log("Currency for conversion:", currency);
        product.price = convertPrice(product.price, String(currency));
        console.log("Converted Price:", product.price);
      } else {
        throw new Error("Invalid price format");
      }
    } catch (error) {
      console.error("Price conversion error:", error.message);
      product.price = product.price.toFixed(2);
      console.log("Fallback Price:", product.price);
    }

    try {
      product.link = convertToJoyaBuy(product.id, product.store);
    } catch (error) {
      console.error("Link conversion error:", error.message);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

function convertToJoyaBuy(id, platform) {
  const inviteCode = '137664';
  const platformId = getPlatformId(platform);
  return processToJoyaBuy(platformId, id, inviteCode);
}

function getPlatformId(platform) {
  switch (platform) {
    case '1688':
      return 0;
    case 'Taobao':
      return 1;
    case 'Weidian':
      return 2;
    default:
      throw new Error("Unknown platform");
  }
}

function processToJoyaBuy(platformId, productId, inviteCode) {
  switch (platformId) {
    case 0:
      return `https://cnfans.com/product/?shop_type=ali_1688&id=${productId}&ref=${inviteCode}`;
    case 1:
      return `https://cnfans.com/product/?shop_type=taobao&id=${productId}&ref=${inviteCode}`;
    case 2:
      return `https://cnfans.com/product/?shop_type=weidian&id=${productId}&ref=${inviteCode}`;
    default:
      return '';
  }
}

const convertPrice = (price, targetCurrency) => {
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
    CNY: 1.00,
    PLN: 0.54,
  };

  if (typeof price !== 'number' || isNaN(price)) {
    throw new Error("Invalid price provided");
  }

  const currency = targetCurrency.toUpperCase();
  const conversionRate = conversionRates[currency];

  if (!conversionRate) {
    throw new Error("Unsupported currency provided");
  }

  return (price * conversionRate).toFixed(2);
};
