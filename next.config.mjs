import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./localization/i18n.ts");

// نجيب env
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_IMAGES = process.env.NEXT_PUBLIC_API_IMAGES;

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined, defaulting to /api");
}

// next config
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:locale/api/:path*",
        destination: `${API_BASE_URL || "/api"}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL || "/api"}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: API_IMAGES
      ? [
          {
            protocol: "http",
            hostname: new URL(API_IMAGES).hostname,
            port: new URL(API_IMAGES).port || "",
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default withNextIntl(nextConfig);
