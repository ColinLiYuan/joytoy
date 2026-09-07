import type { NextConfig } from "next";

// 后端 API 地址（从环境变量读取，用于 Next.js 代理配置）
// 优先使用 NEXT_PUBLIC_BACKEND_BASE_URL（客户端可用）
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL || 'http://localhost:9356';

// 🔍 构建时输出环境变量（调试用）
console.log('\n🔧 [Build Time] Environment Variables:');
console.log('  NEXT_PUBLIC_BACKEND_BASE_URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
console.log('  BACKEND_BASE_URL:', process.env.BACKEND_BASE_URL);
console.log('  Resolved backendUrl:', backendUrl);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('');

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
            dynamic: 300,
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
        // 多站点每站一个 R2 桶（pub-xxx.r2.dev 域名各不相同），通配放行所有 r2.dev 桶；
        // 站点若换成自定义图片域名，需在此追加对应 hostname
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mythtoy.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '**.r2.dev',
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
                    // 安全头
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
            {
                // 页面路由：Vercel 边缘缓存（ISR 风格）
                source: '/((?!api|admin|_next|checkout|account|wishlist).*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=3600, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                // 静态资源：长期缓存
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
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
            // 用户端 API 代理（解决 Mixed Content 问题）
            {
                source: '/api/V1/:path*',
                destination: `${backendUrl}/api/V1/:path*`,
            },
            {
                source: '/api/backend/:path*',
                destination: `${backendUrl}/api/V1/:path*`,
            },
            // 管理端 API 代理
            {
                source: '/api/admin/:path*',
                destination: `${backendUrl}/api/admin/:path*`,
            },
            // 联盟 API 代理（解决 Mixed Content 问题）
            {
                source: '/api/V1/affiliate/:path*',
                destination: `${backendUrl}/api/V1/affiliate/:path*`,
            },
        ];
    },

    poweredByHeader: false,
    compress: true,
};

export default nextConfig;
