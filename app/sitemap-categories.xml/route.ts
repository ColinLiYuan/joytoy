// app/sitemap-categories.xml

import { NextResponse } from 'next/server'
import { categoryService } from '@/services/categoryService';
import {CategoryResponse} from "@/types/category";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'

    let categories: CategoryResponse[] = []
    try {
        categories = await categoryService.getCategories()
    } catch (error) {
        console.error('Failed to load categories for sitemap:', error)
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categories.map(cat => `
  <url>
    <loc>${baseUrl}/collections/${cat.slug}</loc>
    <lastmod>${cat.lastModified ? new Date(cat.lastModified).toISOString() : new Date().toISOString()}</lastmod>
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
