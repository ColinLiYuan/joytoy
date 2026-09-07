// app/llms.txt/route.ts — AI 爬虫站点清单（llmstxt.org 规范）
// 内容为品牌定位 + 核心页面 + 可引用关键事实，供 GPTBot/PerplexityBot/ClaudeBot 等快速建立站点认知。
import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';

    const text = `# MythToy

> MythToy is a premium adult lifestyle brand offering body-safe pleasure devices for wellness and intimacy. Elegant design meets modern technology, with discreet worldwide shipping and secure checkout.

## Core Pages

- [Home](${baseUrl}/)
- [All Products](${baseUrl}/collections/all)
- [About MythToy](${baseUrl}/pages/about)
- [FAQ](${baseUrl}/pages/faq)
- [Shipping Policy](${baseUrl}/pages/shipping-policy)
- [Return & Refund](${baseUrl}/pages/return-refund)
- [Blog](${baseUrl}/blog)
- [Wholesale](${baseUrl}/pages/wholesale)

## Key Facts

- Body-safe, medical-grade silicone devices; 1-year warranty
- Discreet worldwide shipping: USA 5-12 business days, EU/UK 5-14 business days (processing 1-3 days)
- Privacy-protected billing: transactions appear as 'MT TECH'
- Adult products: all visitors must confirm 18+

## Optional

- [Sitemap](${baseUrl}/sitemap.xml)
`;

    return new NextResponse(text, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
        },
    });
}
