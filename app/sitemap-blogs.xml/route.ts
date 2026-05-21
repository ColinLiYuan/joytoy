// app/sitemap-blogs.xml/route.ts
import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';
    let blogs: any[] = [];

    try {
        const response = await blogService.list(0, 1000);
        blogs = response.content || [];
        console.log(`Sitemap fetched ${blogs.length} blog posts`);
    } catch (error) {
        console.error('Failed to fetch blog list for sitemap:', error);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${blogs.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
  </url>
  `).join('')}
</urlset>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    });
}
