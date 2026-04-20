// Price conversion utilities
export const conversionRates = {
  USD: 0.14,
  GBP: 0.11,
  EUR: 0.12,
  NZD: 0.23,
  AUD: 0.21,
  CAD: 0.19,
  MXN: 2.55,
  BRL: 0.72,
  KRW: 186.24,
  CNY: 1.0,
  PLN: 0.54,
};

export const currencySymbols = {
  USD: '$',
  GBP: '£',
  EUR: '€',
  NZD: 'NZ$',
  AUD: 'A$',
  CAD: 'C$',
  MXN: '$',
  BRL: 'R$',
  KRW: '₩',
  CNY: '¥',
  PLN: 'zł',
};

export function convertPrice(price, currency) {
  const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
  const rate = conversionRates[currency] || 1;
  const result = (numPrice * rate).toFixed(2);

  // Debug logging (controlled by DEBUG_MODE env var)
  if (typeof window !== 'undefined' && window.DEBUG_MODE && numPrice > 0) {
    console.log(`[convertPrice] ${numPrice} CNY × ${rate} (${currency}) = ${result}`);
  }

  return result;
}

export function getPlatformId(platform) {
  const platformLower = platform?.toLowerCase();
  if (platformLower === '1688') return 0;
  if (platformLower === 'taobao') return 1;
  if (platformLower === 'weidian') return 2;
  return 1;
}

// Convert to HipoBuy link format with proper platform handling
// Format: https://hipobuy.com/product/{platform}/{productId}?inviteCode=xxx
// Platform: 0 = 1688, 1 = Taobao, weidian = Weidian
export function convertToHipoBuy(id, platform) {
  const inviteCode = 'LKG2UDAUS';
  const platformLower = String(platform).toLowerCase();

  let platformPath;
  if (platformLower === '1688' || platformLower === 'ali_1688') {
    platformPath = '0';
  } else if (platformLower === 'taobao') {
    platformPath = '1';
  } else if (platformLower === 'weidian') {
    platformPath = 'weidian';
  } else {
    platformPath = '1'; // Default to Taobao
  }

  return `https://hipobuy.com/product/${platformPath}/${id}?inviteCode=${inviteCode}`;
}

// Alias for backwards compatibility - uses new HipoBuy format
export function convertToMuleBuy(id, platform) {
  return convertToHipoBuy(id, platform);
}
