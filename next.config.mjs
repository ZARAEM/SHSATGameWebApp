/** @type {import('next').NextConfig} */
const nextConfig = {
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
