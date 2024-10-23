/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pics.zaraem.dev",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
