// app/sitemap-pages.xml

import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'

    const staticPages = [
        '/',
        '/collections',
        '/blog',
        '/pages/about',
        '/pages/contact',
        '/pages/wholesale',
        '/pages/shipping-policy',
        '/pages/return-refund',
        '/pages/privacy-policy',
        '/pages/terms-and-conditions',
        '/pages/payment-policy',
        '/pages/cookie-policy',
        '/pages/age-verification',
        '/pages/order-tracking'
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
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
