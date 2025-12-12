import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile these to ensure they are processed by Next.js pipeline
  transpilePackages: [
    '@tensorflow-models/pose-detection',
    '@tensorflow/tfjs-core',
    '@tensorflow/tfjs-backend-webgl',
    '@mediapipe/pose'
  ],
  webpack: (config, { isServer }) => {
    // Fix for missing fs module in dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // If on server, we might want to avoid bundling these complex binary/browser wrappers
    if (isServer) {
      config.externals.push({
        '@tensorflow/tfjs-core': 'commonjs @tensorflow/tfjs-core',
        '@tensorflow/tfjs-backend-webgl': 'commonjs @tensorflow/tfjs-backend-webgl',
        '@tensorflow-models/pose-detection': 'commonjs @tensorflow-models/pose-detection',
        '@mediapipe/pose': 'commonjs @mediapipe/pose',
      });
    }

    return config;
  },
  turbopack: {},
};

export default nextConfig;
