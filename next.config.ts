import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // headers() config added to explicitly allow cross-origin popups for Google Login
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
