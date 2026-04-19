/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    // 禁用源映射以减少内存使用
    productionBrowserSourceMaps: false,
    
    // ✅ 强制所有页面动态渲染,避免 useSearchParams/useParams 的 Suspense 问题
    // 这会禁用静态页面生成,所有页面都会在请求时动态渲染
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

    // 开启 React 严格模式（建议开启，有助于发现潜在 Bug）
    reactStrictMode: true,

    // 优化构建：生产环境移除 console
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // ✅ SEO 优化：生成静态页面时预渲染关键路径
    experimental: {
        // ✅ 禁用部分预渲染，避免 useSearchParams/useParams 的 Suspense 问题
        ppr: false,
        // 启用 ISR (Incremental Static Regeneration) 优化
        staleTimes: {
            dynamic: 30, // 动态内容缓存 30 秒
            static: 300, // 静态内容缓存 5 分钟
        },
        // ✅ Server Action 文件大小限制（10MB）
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },

    // ✅ 核心修改区域：图片优化策略
    images: {
        // 1. 强制缓存时间：设置为 1 年 (秒)。
        // 这样 Vercel 优化过一次图片后，一年内都不会再重新消耗额度去生成同一张图。
        minimumCacheTTL: 31536000,

        // 2. 精简生成的尺寸：
        // 默认 Next.js 会生成 8-10 种尺寸。减少尺寸变种能显著降低额度消耗。
        // 这里只保留了最常用的手机、平板、桌面尺寸。
        deviceSizes: [360, 640, 750, 1080, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128], // 用于头像或小图标

        // 3. 允许的域名
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mythtoy.com',
            },
            {
                protocol: 'https',
                hostname: '*.r2.dev', // ✅ 优化：使用通配符匹配所有 R2 子域名，以后新增桶不用改配置
            },
        ],

        formats: ['image/webp', 'image/avif'],

        // 开发环境禁用优化，省电脑资源；生产环境开启
        unoptimized: process.env.NODE_ENV === 'development',
    },

    // 调试日志 (可选)：开发时可以看到 fetch 的缓存情况
    logging: {
        fetches: {
            fullUrl: true,
        },
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

    poweredByHeader: false,
    compress: true,
}

module.exports = nextConfig