// app/sitemap-blogs.xml/route.ts
import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';
    let blogs: any[] = [];

    try {
        const response = await blogService.list(0, 1000);
        blogs = response.content || [];
        console.log(`✅ Sitemap 获取到 ${blogs.length} 篇博客`);
    } catch (error) {
        console.error('❌ 获取博客列表失败:', error);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${blogs.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            // 博客更新频率可能较高，缓存设短一点
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    });
}