// app/google-merchant-feed.xml/route.ts

import { NextResponse } from 'next/server'
import { BACKEND_CONFIG, SITE_HEADERS } from '@/lib/api-config'
import { getProductImageUrl } from '@/lib/image-utils'
import { isHiddenCategory } from '@/lib/constants/hidden-categories'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'
    const currency = 'USD'

    let products = []
    try {
        const productUrl = `${BACKEND_CONFIG.baseURL}/api/V1/product/all`
        console.log('[Google Merchant Feed] Fetching products from:', productUrl)
        
        const res = await fetch(productUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...SITE_HEADERS,
            },
            cache: 'no-store'
        })

        if (res.ok) {
            const responseData = await res.json()
            console.log('[Google Merchant Feed] API Response:', responseData)

            // 根据 Java API 的结构提取数据
            if (responseData.data && Array.isArray(responseData.data)) {
                products = responseData.data
                console.log(`[Google Merchant Feed] ✅ Fetched ${products.length} products`)
            } else {
                console.error('[Google Merchant Feed] ❌ Invalid API response format:', responseData)
                throw new Error('Invalid API response format')
            }
        } else {
            throw new Error(`API responded with status: ${res.status}`)
        }
    } catch (error) {
        console.error('[Google Merchant Feed] ❌ Failed to fetch products:', error)
        products = []
    }

    // 确保 products 是数组
    if (!Array.isArray(products)) {
        console.error('[Google Merchant Feed] ❌ products is not an array:', products)
        products = []
    }

    // 剔除隐藏分类商品（realistic / torso），不进 Google Merchant Center
    products = products.filter(product => !isHiddenCategory(product.categories))
    console.log(`[Google Merchant Feed] Products after hidden filter: ${products.length}`)

    // 生成 Google Merchant Center XML Feed
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>MythToy Product Feed</title>
    <link>${baseUrl}</link>
    <description>Product feed for Google Merchant Center</description>
    ${products.map(product => {
        // 处理产品数据
        const id = product.id || product.sku || Math.random().toString(36).substr(2, 9)
        const title = product.title || product.name || 'Unknown Product'
        const description = product.description || ''
        const link = `${baseUrl}/toys${product.slug}`
        
        // 图片处理：主图使用 product.image，副图使用 galleries（已包含主图）
        const imageLink = getProductImageUrl(undefined, product.image)
        
        // 副图：galleries 中已包含主图，直接使用所有图片作为副图
        const additionalImages = (product.galleries || []).map((g: any) => getProductImageUrl(undefined, g.url))
        
        // 库存判断：累加所有SKU的stock
        const totalStock = (product.productSkus || []).reduce((sum: number, sku: any) => sum + (sku.stock || 0), 0)
        const availability = totalStock > 0 ? 'in stock' : 'out of stock'
        
        const price = product.currentPrice || product.originalPrice || 0
        const brand = product.brand || 'MythToy'
        const condition = 'new'
        const googleProductCategory = '778'
        const productType = getProductType(product.categories)
        const mpn = product.sku || ''
        
        // 清理描述中的HTML标签和特殊字符
        const cleanDescription = cleanText(description)
        const cleanTitle = cleanText(title)

        return `
    <item>
      <g:id>${escapeXml(String(id))}</g:id>
      <g:title>${escapeXml(cleanTitle)}</g:title>
      <g:description>${escapeXml(cleanDescription)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageLink)}</g:image_link>
      ${additionalImages.map((img: string) => `<g:additional_image_link>${escapeXml(img)}</g:additional_image_link>`).join('\n      ')}
      <g:price>${price.toFixed(2)} ${currency}</g:price>
      <g:availability>${escapeXml(availability)}</g:availability>
      <g:brand>${escapeXml(brand)}</g:brand>
      <g:condition>${escapeXml(condition)}</g:condition>
      <g:adult>yes</g:adult>
      <g:google_product_category>${escapeXml(googleProductCategory)}</g:google_product_category>
      <g:product_type>${escapeXml(productType)}</g:product_type>
      <g:mpn>${escapeXml(mpn)}</g:mpn>
      <g:shipping>
        <g:country>US</g:country>
        <g:service>Standard (6-12 business days)</g:service>
        <g:price>4.99 USD</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>GB</g:country>
        <g:service>Standard (5-14 business days)</g:service>
        <g:price>4.99 USD</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>DE</g:country>
        <g:service>Standard (5-14 business days)</g:service>
        <g:price>4.99 USD</g:price>
      </g:shipping>
      <g:return_policy_label>
        <g:url>${baseUrl}/pages/return-refund</g:url>
      </g:return_policy_label>
    </item>`
    }).join('')}
  </channel>
</rss>`

    console.log(`[Google Merchant Feed] 📄 Generated feed with ${products.length} products`)

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
    })
}

// 辅助函数：清理文本
function cleanText(text: string): string {
    if (!text) return ''
    // 移除HTML标签
    let cleaned = text.replace(/<[^>]*>/g, '')
    // 移除Markdown标记
    cleaned = cleaned.replace(/\*\*/g, '') // 移除 **
    cleaned = cleaned.replace(/\*/g, '')   // 移除 *
    cleaned = cleaned.replace(/###/g, '')  // 移除 ###
    cleaned = cleaned.replace(/##/g, '')   // 移除 ##
    cleaned = cleaned.replace(/#/g, '')    // 移除 #
    cleaned = cleaned.replace(/__/g, '')   // 移除 __
    cleaned = cleaned.replace(/_/g, '')    // 移除 _
    cleaned = cleaned.replace(/```/g, '')  // 移除 ```
    cleaned = cleaned.replace(/`/g, '')    // 移除 `
    // 移除多余空格
    cleaned = cleaned.replace(/\s+/g, ' ').trim()
    // 限制长度（Google建议不超过5000字符）
    if (cleaned.length > 4999) {
        cleaned = cleaned.substring(0, 4996) + '...'
    }
    return cleaned
}

// 辅助函数：转义XML特殊字符
function escapeXml(text: string): string {
    if (!text) return ''
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}

// 辅助函数：获取Google产品分类
function getGoogleProductCategory(categories?: string[]): string {
    if (!categories || categories.length === 0) {
        return 'Health & Beauty > Personal Care > Sexual Wellness'
    }
    
    // 根据分类映射到Google产品分类
    const categoryStr = categories.join(' ').toLowerCase()
    
    if (categoryStr.includes('vibrat')) {
        return 'Health & Beauty > Personal Care > Sexual Wellness > Vibrators'
    } else if (categoryStr.includes('massag')) {
        return 'Health & Beauty > Personal Care > Massage & Relaxation'
    } else if (categoryStr.includes('oil') || categoryStr.includes('lubricant')) {
        return 'Health & Beauty > Personal Care > Sexual Wellness > Lubricants'
    } else if (categoryStr.includes('toy')) {
        return 'Health & Beauty > Personal Care > Sexual Wellness > Sex Toys'
    }
    
    return 'Health & Beauty > Personal Care > Sexual Wellness'
}

// 辅助函数：获取产品类型
function getProductType(categories?: string[]): string {
    if (!categories || categories.length === 0) {
        return 'Sexual Wellness'
    }
    return categories.join(' > ')
}
