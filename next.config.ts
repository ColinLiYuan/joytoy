import type { NextConfig } from "next";

// 后端 API 地址（从环境变量读取，用于 Next.js 代理配置）
const backendUrl = process.env.BACKEND_BASE_URL || 'http://localhost:9356';

const nextConfig: NextConfig = {
    output: 'standalone',
    
    // 禁用源映射以减少内存使用
    productionBrowserSourceMaps: false,

    // 开启 React 严格模式
    reactStrictMode: true,

    // 优化构建：生产环境移除 console
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // ✅ SEO 优化：生成静态页面时预渲染关键路径
    experimental: {
        ppr: false,
        staleTimes: {
            dynamic: 30,
            static: 300,
        },
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },

    // ✅ 图片优化策略
    images: {
        minimumCacheTTL: 31536000,
        deviceSizes: [360, 640, 750, 1080, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128],
        
        // ✅ 允许的域名
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mythtoy.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-c128c2f5caa744afbeb49b9904451478.r2.dev',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-e5d14c6d386c4d90979458082617517a.r2.dev',
                pathname: '/**',
            },
        ],
        
        // ✅ 添加 quality 配置
        qualities: [75, 90],
        
        formats: ['image/webp', 'image/avif'],
        unoptimized: process.env.NODE_ENV === 'development',
    },

    // 调试日志
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'x-next-cache-tags',
                        value: 'dynamic',
                    },
                ],
            },
        ];
    },

    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
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

    async rewrites() {
        return [
            {
                source: '/api/backend/:path*',
                destination: `${backendUrl}/api/V1/:path*`,
            },
        ];
    },

    poweredByHeader: false,
    compress: true,
};

export default nextConfig;
