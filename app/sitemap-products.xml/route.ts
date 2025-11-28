// app/sitemap-products.xml

import { NextResponse } from 'next/server'
import { BACKEND_CONFIG } from '@/lib/api-config'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com'

    let products = []
    try {
        const productUrl = `${BACKEND_CONFIG.baseURL}/api/V1/product/all`
        console.log('sitemap-products.xml url: ', productUrl)
        const res = await fetch(productUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        })

        if (res.ok) {
            const responseData = await res.json()
            console.log('📦 API 返回数据结构:', responseData)

            // 根据 Java API 的结构提取数据
            if (responseData.data && Array.isArray(responseData.data)) {
                products = responseData.data
                console.log(`✅ 动态获取 ${products.length} 个商品`)
            } else {
                console.error('❌ API 返回的数据格式不正确:', responseData)
                throw new Error('Invalid API response format')
            }
        } else {
            throw new Error(`API responded with status: ${res.status}`)
        }
    } catch (error) {
        console.error('❌ 获取商品失败:', error)
        if (process.env.NODE_ENV !== 'production') {
            products = [
                { slug: '/vibrator-pro' },
                { slug: '/massage-oil' },
            ]
            console.log('🔄 使用测试数据:', products.length, '个商品')
        }
    }

    // 确保 products 是数组
    if (!Array.isArray(products)) {
        console.error('❌ products 不是数组:', products)
        products = []
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/toys${product.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  `).join('')}
</urlset>`

    console.log(`📄 生成包含 ${products.length} 个商品链接的 sitemap`)

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}