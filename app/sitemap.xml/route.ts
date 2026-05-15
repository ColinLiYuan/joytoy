// app/sitemap.xml
import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'

    const sitemaps = [
        'sitemap-pages.xml',
        'sitemap-categories.xml',
        'sitemap-products.xml',
        'sitemap-blogs.xml'
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemaps.map(sitemap => `
  <sitemap>
    <loc>${baseUrl}/${sitemap}</loc>
  </sitemap>
  `).join('')}
</sitemapindex>`

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}