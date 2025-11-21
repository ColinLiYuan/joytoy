import { NextResponse } from 'next/server'

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com'

    const robots = `
User-agent: *

Allow: /$

Allow: /home$
Allow: /index$
Allow: /default$

Allow: /_next/static/
Allow: /_next/image/
Allow: /_next/data/
Allow: /images/
Allow: /assets/
Allow: /favicon.ico

Allow: /collections/$
Allow: /collections/best-sellers$
Allow: /toys/$
Allow: /products/$

Disallow: /checkout/
Disallow: /cart/
Disallow: /account/
Disallow: /payment/
Disallow: /orders/
Disallow: /wishlist/
Disallow: /admin/

Disallow: /login
Disallow: /register
Disallow: /forgot-password

Disallow: /api/
Disallow: /_next/static/chunks/
Disallow: /header/

Disallow: /search

Allow: /collections/
Allow: /toys/
Allow: /products/

Disallow: /*?*priceRange=
Disallow: /*?*colors=
Disallow: /*?*features=
Disallow: /*?*materials=
Disallow: /*?*sort=
Disallow: /*?*page=

Allow: /*?utm_
Allow: /*?ref=
Allow: /*?source=
Allow: /*?campaign=

Disallow: /*?*=

Sitemap: ${baseUrl}/sitemap.xml
`.trim()

    return new NextResponse(robots, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400'
        }
    })
}