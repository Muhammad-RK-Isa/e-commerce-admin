/** @type {import('next').NextConfig} */
const nextConfig = {
    modularizeImports: true,
    images: {
        domains: [
            "res.cloudinary.com"
        ],
    },
};

module.exports = nextConfig;
