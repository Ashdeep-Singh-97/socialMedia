/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
  },
};

export default nextConfig;
