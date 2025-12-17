import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

// Keep Next config minimal; enable bundle analyzer only when ANALYZE=true
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Opt-in to React strict mode
  reactStrictMode: true,
  // Add empty turbopack config to silence the warning
  turbopack: {},
};

export default withAnalyzer(nextConfig);
