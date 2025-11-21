import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com'

    const staticPages = [
        { loc: '', priority: 1.0, changefreq: 'daily' },
        { loc: '/pages/wholesale', priority: 1.0, changefreq: 'monthly' },
        { loc: '/pages/about', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/contact', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/privacy-policy', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/terms-and-conditions', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/payment-policy', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/cookie-policy', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/age-verification', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/shipping-policy', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/return-refund', priority: 0.3, changefreq: 'monthly' },
        { loc: '/pages/order-tracking', priority: 0.3, changefreq: 'monthly' }

    ]

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
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}