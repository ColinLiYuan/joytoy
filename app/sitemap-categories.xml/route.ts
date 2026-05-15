// app/sitemap-categories.xml

import { NextResponse } from 'next/server'
import { categoryService } from '@/services/categoryService';
import {CategoryResponse} from "@/types/category";

interface CategoryPath {
    loc: string;
    changefreq: string;
    priority: number;
}

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'

    let categories: CategoryResponse[] = []
    try {
        categories = await categoryService.getCategories()
    } catch (error) {
        console.error('❌ 获取二级分类失败:', error)
    }

    // 生成分类路径
    const categoryPaths: CategoryPath[] = []

    categories.forEach(subCategory => {
        categoryPaths.push({
            loc: `/collections/${subCategory.slug}`,
            changefreq: subCategory.changefreq || 'weekly',
            priority: subCategory.priority || 0.7,
        })
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${categoryPaths.map(category => `
  <url>
    <loc>${baseUrl}${category.loc}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${category.changefreq || 'weekly'}</changefreq>
    <priority>${category.priority || 0.8}</priority>
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