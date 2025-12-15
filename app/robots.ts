import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                // --- 1. 私密用户区域 (Private User Areas) ---
                // 这些页面包含用户个人信息，不需要被收录
                '/account/',
                '/checkout/',
                '/cart/',
                '/payment/',
                '/orders/',
                '/wishlist/',
                '/login',
                '/register',
                '/forgot-password',

                // --- 2. 后台管理 (Admin) ---
                '/admin/',

                // --- 3. 技术路径 (Technical Paths) ---
                '/api/',
                // 注意：不要 Disallow /_next/static 或 /_next/image，
                // Google 需要加载 JS/CSS/图片来渲染页面以判断移动端适配。
                '/_next/private/',

                // --- 4. 搜索结果 (Search Results) ---
                // Google 官方建议：不要收录站内搜索结果页，避免生成大量低质量页面
                '/search',

                // --- 5. 爬虫预算优化 (Crawl Budget Optimization) ---
                // 防止爬虫抓取无数种筛选组合（导致重复内容问题）
                '/*?*priceRange=',
                '/*?*colors=',
                '/*?*features=',
                '/*?*materials=',
                '/*?*sort=',
                // 关于分页 (?page=): 通常建议保留 allow，配合 canonical标签。
                // 但如果你不想让爬虫爬太深的分页，可以解开下面这行：
                // '/*?*page=',
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}