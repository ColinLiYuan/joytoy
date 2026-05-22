// app/sitemap-products.xml

import { NextResponse } from 'next/server'
import { BACKEND_CONFIG } from '@/lib/api-config'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'

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
            console.log('API response data structure:', responseData)

            if (responseData.data && Array.isArray(responseData.data)) {
                products = responseData.data
                console.log(`Dynamically fetched ${products.length} products`)
            } else {
                console.error('Invalid API response format:', responseData)
                throw new Error('Invalid API response format')
            }
        } else {
            throw new Error(`API responded with status: ${res.status}`)
        }
    } catch (error) {
        console.error('Failed to fetch products for sitemap:', error)
        if (process.env.NODE_ENV !== 'production') {
            products = [
                { slug: '/vibrator-pro' },
                { slug: '/massage-oil' },
            ]
            console.log('Using test data:', products.length, 'products')
        }
    }

    if (!Array.isArray(products)) {
        console.error('products is not an array:', products)
        products = []
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${products.map(product => `
  <url>
    <loc>${baseUrl}/toys${product.slug}</loc>
    ${product.updatedAt ? `<lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>` : ''}
  </url>
  `).join('')}
</urlset>`

    console.log(`Generated sitemap with ${products.length} product URLs`)

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}
