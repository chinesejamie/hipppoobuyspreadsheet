/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // allow absolutely any HTTP URL
      {
        protocol: 'http',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      // allow absolutely any HTTPS URL
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
  rewrites() {
    return [
      { source: '/uploads/:path*', destination: 'http://217.154.115.9:4501/uploads/:path*' },
      { source: '/assets/images/:path*', destination: 'http://217.154.115.9:4501/assets/images/:path*' },
      { source: '/assets/productImages/:path*', destination: 'http://217.154.115.9:4501/assets/productImages/:path*' },
      { source: '/assets/profilePicture/:path*', destination: 'http://217.154.115.9:4501/assets/profilePicture/:path*' },
    ];
  },
  env: {
    AGENT_NAME: process.env.AGENT_NAME || 'MuleBuy',
    INVITE_URL: process.env.INVITE_URL || 'https://mulebuy.com/register?ref=200001570',
    DEBUG_MODE: process.env.DEBUG_MODE || 'false',
  },
};

module.exports = nextConfig;
