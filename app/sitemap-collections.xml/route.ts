// app/sitemap-collections.xml
// 上架合集落地页 /collections/{slug}（营销聚合，与分类 sitemap 分开）

import { NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL || 'http://localhost:9356';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'

    let items: { slug: string; lastModified?: string }[] = []
    try {
        const res = await fetch(`${BACKEND}/api/V1/collections?page=0&size=100`, {
            signal: AbortSignal.timeout(15_000),
            headers: { Accept: 'application/json' },
        });
        const body = await res.json();
        if (body?.success) {
            const content = body.data?.content || [];
            items = content.map((c: any) => ({
                slug: c.slug,
                lastModified: c.updatedAt || undefined,
            }));
        }
    } catch (error) {
        console.error('Failed to load collections for sitemap:', error)
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${items.map(c => `
  <url>
    <loc>${baseUrl}/collections/${c.slug}</loc>
    ${c.lastModified ? `<lastmod>${new Date(c.lastModified).toISOString()}</lastmod>` : ''}
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
