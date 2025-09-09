import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
    './localization/i18n.ts',
);
 
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    domains: ["fakestoreapi.com"],
  },
};
 
export default withNextIntl(nextConfig);