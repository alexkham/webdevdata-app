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
      },
      // Old buried tool URLs → new standalone /tools/<slug> pages.
      {
        source: '/tools/coding-tools/html-minifier',
        destination: '/tools/html-minifier',
        permanent: true,
      },
      {
        source: '/tools/coding-tools/css-minifier',
        destination: '/tools/css-minifier',
        permanent: true,
      },
      // Category page of the removed coding-tools dir.
      {
        source: '/tools/coding-tools',
        destination: '/tools',
        permanent: true,
      },
      {
        source: '/tools/converters',
        destination: '/tools',
        permanent: true,
      },
      // Interim (temporary) — final home is the future /reference section:
      // ascii-converter → /reference/ascii-table, tables/* → /reference/*.
      // css-units-converter: keep-or-reference decision still open.
      {
        source: '/tools/converters/ascii-converter',
        destination: '/tools',
        permanent: false,
      },
      {
        source: '/tools/converters/css-units-converter',
        destination: '/tools',
        permanent: false,
      },
      {
        source: '/tools/tables/:path*',
        destination: '/tools',
        permanent: false,
      },
      {
        source: '/tools/coding-tools/json-tree',
        destination: '/tools/json-tree',
        permanent: true,
      },
      {
        source: '/tools/converters/json-js',
        destination: '/tools/json-js',
        permanent: true,
      },
      {
        source: '/tools/coding-tools/javascript-minifier',
        destination: '/tools/js-minifier',
        permanent: true,
      },
      {
        source: '/tools/coding-tools/html-encoder',
        destination: '/tools/html-encoder',
        permanent: true,
      },
      {
        source: '/tools/converters/html-entities',
        destination: '/tools/html-encoder',
        permanent: true,
      },
      {
        source: '/tools/converters/yaml-json',
        destination: '/tools/yaml-json',
        permanent: true,
      },
      {
        source: '/tools/coding-tools/url-encoder-decoder',
        destination: '/tools/url-encoder',
        permanent: true,
      },
      {
        source: '/tools/converters/json-xml',
        destination: '/tools/json-xml',
        permanent: true,
      }
    ];
  }
};

module.exports = nextConfig;
