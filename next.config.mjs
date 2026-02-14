import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Turbopack과 Webpack 설정을 공존시키기 위한 빈 설정 추가
  experimental: {
    turbopack: {},
  },
};

export default withPWA(nextConfig);
