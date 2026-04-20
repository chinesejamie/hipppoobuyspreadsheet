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
      product.link = convertToMuleBuy(product.id, product.store);
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

function convertToHipoBuy(id, platform) {
  const inviteCode = 'LKG2UDAUS';
  const platformId = getPlatformId(platform);
  return processToHipoBuy(platformId, id, inviteCode);
}

// Alias for backwards compatibility
function convertToMuleBuy(id, platform) {
  return convertToHipoBuy(id, platform);
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
      return 1; // Default to Taobao
  }
}

// Format: https://hipobuy.com/product/{platform}/{productId}?inviteCode=xxx
// Platform: 0 = 1688, 1 = Taobao, weidian = Weidian
function processToHipoBuy(platformId, productId, inviteCode) {
  let platformPath;
  switch (platformId) {
    case 0: // 1688
      platformPath = '0';
      break;
    case 1: // Taobao
      platformPath = '1';
      break;
    case 2: // Weidian
      platformPath = 'weidian';
      break;
    default:
      platformPath = '1';
  }
  return `https://hipobuy.com/product/${platformPath}/${productId}?inviteCode=${inviteCode}`;
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
