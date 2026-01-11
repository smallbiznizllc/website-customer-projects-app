/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: process.env.S3_BUCKET_NAME 
      ? [`${process.env.S3_BUCKET_NAME}.s3.amazonaws.com`]
      : [],
  },
  env: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  },
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/creative-landing.html',
      },
    ]
  },
  // Exclude functions directory from Next.js compilation
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /functions\/.*\.ts$/,
      use: 'ignore-loader',
    })
    return config
  },
}

module.exports = nextConfig