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
      { source: '/uploads/:path*', destination: 'http://http://212.227.74.41/:4501/uploads/:path*' },
      { source: '/assets/profilePicture/:path*', destination: 'http://http://212.227.74.41/:4200/assets/profilePicture/:path*' },
      { source: '/assets/productImages/:path*', destination: 'http://http://212.227.74.41/:4200/assets/productImages/:path*' },
      { source: '/assets/images/:path*', destination: 'http://http://212.227.74.41/:4200/assets/images/:path*' },
    ];
  },
  env: {
    AGENT_NAME: process.env.AGENT_NAME || 'OOPBuy',
    INVITE_URL: process.env.INVITE_URL || 'https://oopbuy.com/register?inviteCode=DMP60XRTF',
  },
};

module.exports = nextConfig;
