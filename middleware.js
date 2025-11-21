import { NextResponse } from 'next/server'

export function middleware(request) {
    const { pathname } = request.nextUrl

    // 精确匹配的路径列表
    const exactBlockedPaths = [
        '/female-sex-toys/bullet-vibrators/matte-red-lipstick-bullet-vibes',
        '/sex-toys/butt-plugs/medal-butt-plug-HT019',
        '/male-sex-toys/pussy-masturbators/life-like-miru',
        '/products/vibrator-g-sucking-usb-szm',
        '/products/vibrator-silicone-sucking-mirro',
        '/membership',
        '/products/suction-sex-toy-soft-szm',
        '/products/sex-doll-vagina-dghs',
        '/contact',
        '/collections/male-sex-toys/pocket-pussy',
        '/collections/female-sex-toys/fairy-dildos',
        '/collections/sex-toys/pocket-pussy',
        '/toys/male-sex-toys/sex-doll/mini-sex-doll-cui',
        '/collections/sex-toys/vibrator',
        '/collections/male-sex-toys/silicone-male-masturbator',
        '/toys/female-sex-toys/clit-suction-vibrators/suction-sex-toy-soft-szm',
        '/toys/female-sex-toys/clit-suction-vibrators/squirrel-auto-suction-vibes',
        '/toys/female-sex-toys/clit-suction-vibrators/charming-vibes',
        '/toys/female-sex-toys/vibrators/vibrators-g-sucking-usb-szm',
        '/toys/female-sex-toys/vibrators/suction-sex-toy-soft-szm',
        '/toys/female-sex-toys/vibrator/suction-sex-toy-soft-szm',
        '/toys/female-sex-toys/vibrator/vibrator-g-sucking-usb-szm',
        '/toys/male-sex-toys/nipple-toys',
        '/toys/male-sex-toys/sex-doll/sex-doll-vagina-dghs',
        '/toys/male-sex-toys/pocket-pussy/funny-peach-pussy',
        '/toys/male-sex-toys/pocket-pussy/realistic-pocket-pussy-snow',
        '/toys/male-sex-toys/pocket-pussy/realistic-pocket-pussy-south',
        '/toys/male-sex-toys/pocket-pussy/realistic-pocket-pussy-dream',
        '/collections/vibrator',
        '/collections/sextoy',
        '/collections/pocket-pussy',
        '/collections/female-sex-toys/realistic-dildos',
        '/collections/lingerie/cos-play',
        '/collections/sex-lingerie',
        '/male-sex-toys/male-masturbators/auto-suction-masturbator-fire',
        '/female-sex-toys/clit-vibrators/charming-vibes',
        '/collections/male-sex-toys/sex-doll',
        '/collections/female-sex-toys/vibrators'
    ]

    // 前缀匹配的路径（对应 nginx 的 ^~）
    const prefixBlockedPaths = [
        '/collections/vibrators',
        '/sex-toys',
        '/products'
    ]

    // 检查精确匹配
    if (exactBlockedPaths.includes(pathname)) {
        return new Response('Gone', {
            status: 410,
            headers: {
                'Content-Type': 'text/plain',
            }
        })
    }

    // 检查前缀匹配
    for (const prefix of prefixBlockedPaths) {
        if (pathname.startsWith(prefix)) {
            return new Response('Gone', {
                status: 410,
                headers: {
                    'Content-Type': 'text/plain',
                }
            })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        // 精确匹配路径
        '/female-sex-toys/bullet-vibrators/matte-red-lipstick-bullet-vibes',
        '/sex-toys/butt-plugs/medal-butt-plug-HT019',
        '/male-sex-toys/pussy-masturbators/life-like-miru',
        '/products/vibrator-g-sucking-usb-szm',
        '/products/vibrator-silicone-sucking-mirro',
        '/membership',
        '/products/suction-sex-toy-soft-szm',
        '/products/sex-doll-vagina-dghs',
        '/collections/male-sex-toys/pocket-pussy',
        '/collections/female-sex-toys/fairy-dildos',
        '/collections/sex-toys/pocket-pussy',
        '/toys/male-sex-toys/sex-doll/mini-sex-doll-cui',
        '/collections/sex-toys/vibrator',
        '/collections/male-sex-toys/silicone-male-masturbator',
        '/toys/female-sex-toys/clit-suction-vibrators/suction-sex-toy-soft-szm',
        '/toys/female-sex-toys/clit-suction-vibrators/squirrel-auto-suction-vibes',
        '/toys/female-sex-toys/clit-suction-vibrators/charming-vibes',
        '/toys/female-sex-toys/vibrators/vibrators-g-sucking-usb-szm',
        '/toys/female-sex-toys/vibrators/suction-sex-toy-soft-szm',
        '/toys/female-sex-toys/vibrator/suction-sex-toy-soft-szm',
        '/toys/female-sex-toys/vibrator/vibrator-g-sucking-usb-szm',
        '/toys/male-sex-toys/nipple-toys',
        '/toys/male-sex-toys/sex-doll/sex-doll-vagina-dghs',
        '/toys/male-sex-toys/pocket-pussy/funny-peach-pussy',
        '/toys/male-sex-toys/pocket-pussy/realistic-pocket-pussy-snow',
        '/toys/male-sex-toys/pocket-pussy/realistic-pocket-pussy-south',
        '/toys/male-sex-toys/pocket-pussy/realistic-pocket-pussy-dream',
        '/collections/vibrator',
        '/collections/sextoy',
        '/collections/pocket-pussy',
        '/collections/female-sex-toys/realistic-dildos',
        '/collections/lingerie/cos-play',
        '/collections/sex-lingerie',
        '/male-sex-toys/male-masturbators/auto-suction-masturbator-fire',
        '/female-sex-toys/clit-vibrators/charming-vibes',
        '/collections/male-sex-toys/sex-doll',
        '/collections/female-sex-toys/vibrators',

        // 前缀匹配路径
        '/collections/vibrators/:path*',
        '/sex-toys/:path*',
        '/products/:path*'
    ]
}