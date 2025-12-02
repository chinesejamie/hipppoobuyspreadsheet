/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.taobaocdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.tmall.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Reduce memory issues during development
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Reduce memory pressure during development
  experimental: {
    // Disable memory cache in dev to reduce malloc errors
    isrMemoryCacheSize: 0,
  },
  async rewrites() {
    return [
      { source: '/uploads/:path*', destination: 'http://localhost:4501/uploads/:path*' },
      { source: '/assets/profilePicture/:path*', destination: 'http://localhost:4200/assets/profilePicture/:path*' },
      { source: '/assets/productImages/:path*', destination: 'http://localhost:4200/assets/productImages/:path*' },
      { source: '/assets/images/:path*', destination: 'http://localhost:4200/assets/images/:path*' },
    ];
  },
};

export default nextConfig;
