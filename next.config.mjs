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
  // reactCompiler: true // 일단 빌드 오류를 줄이기 위해 컴파일러 옵션은 잠시 제외하거나 유지 (필요시)
  reactCompiler: true,
};

// PWA 설정을 적용하여 내보냅니다.
export default withPWA(nextConfig);
