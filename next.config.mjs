import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./localization/i18n.ts");

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const API_PORT = process.env.NEXT_PUBLIC_API_PORT;
const API_IMAGES_HOST = process.env.NEXT_PUBLIC_API_IMAGES_HOST;

if (!API_HOST || !API_PORT) {
  throw new Error("API host or port is not defined");
}

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/:locale/api/:path*",
        destination: `http://${API_HOST}:${API_PORT}/api/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `http://${API_HOST}:${API_PORT}/api/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: API_IMAGES_HOST,
        port: API_PORT,
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
