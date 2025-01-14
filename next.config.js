// /** @type {import('next').NextConfig} */
// const nextConfig = {

//     reactStrictMode: false,
//     // experimental: {
//     //     // Enable the Server Components feature flag
//     //     serverComponents: true,
//     //     // Specifically for enabling Server Actions, as of my last update
//     //     // Check Next.js documentation for the most current flags and names
//     //     appDir: true,
//     //   },
// }

// module.exports = nextConfig
/**@type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/webdevdata.net/:path*',
        destination: '/:path*',
        permanent: true,
      },
      {
        source: '/c/functions/:slug',
        destination: '/c-programming/functions/:slug',
        permanent: true,
      }
    ];
  }
};

module.exports = nextConfig;
