// next.config.js
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./localization/i18n.ts');

const nextConfig = {
  async rewrites() {
    return [
      
      {
        source: "/:locale/api/:path*",
        destination: "http://156.67.24.200:4000/api/:path*",
      },
     
      {
        source: "/api/:path*",
        destination: "http://156.67.24.200:4000/api/:path*",
      },
    ];
  },
  images: {
    domains: ["fakestoreapi.com","picsum.photos","img.freepik.com","www.freepik.com"],
  },
};

export default withNextIntl(nextConfig);