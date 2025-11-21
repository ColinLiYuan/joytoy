/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    // 禁用源映射以减少内存使用
    productionBrowserSourceMaps: false,

    // 优化构建
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    images: {
        // 允许来自 R2 存储桶的图片
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mythtoy.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-c128c2f5caa744afbeb49b9904451478.r2.dev',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-e5d14c6d386c4d90979458082617517a.r2.dev',
                port: '',
                pathname: '/**',
            },
        ],
        // 优化图片加载
        formats: ['image/webp', 'image/avif'],
        // 在开发环境中禁用图片优化以减少内存使用
        unoptimized: process.env.NODE_ENV === 'development',
    },

    // 添加重定向配置
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true, // 301 永久重定向
            },
            {
                source: '/index.html',
                destination: '/',
                permanent: true,
            },
            {
                source: '/index',
                destination: '/',
                permanent: true,
            }
        ];
    },

    // 添加性能优化配置
    poweredByHeader: false,
    compress: true,
}

module.exports = nextConfig