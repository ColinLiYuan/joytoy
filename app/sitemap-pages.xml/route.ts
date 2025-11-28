// app/sitemap-pages.xml

import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com'

    const staticPages = [
        { loc: '', priority: 1.0, changefreq: 'daily' }, // 首页
        { loc: '/collections', priority: 0.9, changefreq: 'weekly' }, // 分类总览
        { loc: '/blog', priority: 0.9, changefreq: 'daily' }, // 博客首页
        // 其他静态页
        { loc: '/pages/about', priority: 0.5, changefreq: 'monthly' },
        { loc: '/pages/contact', priority: 0.5, changefreq: 'monthly' },
        { loc: '/pages/wholesale', priority: 0.8, changefreq: 'monthly' }, // 批发页很重要
        { loc: '/pages/shipping-policy', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/return-refund', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/privacy-policy', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/terms-and-conditions', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/payment-policy', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/cookie-policy', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/age-verification', priority: 0.3, changefreq: 'yearly' },
        { loc: '/pages/order-tracking', priority: 0.5, changefreq: 'monthly' }
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}
</urlset>`

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600'
        }
    })
}