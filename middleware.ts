import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. 定义 301 重定向规则 (Moved Permanently)
// 键是旧路径，值是新路径
const redirectMap: Record<string, string> = {
    '/toys/female-sex-toys/bullet-vibrators/matte-red-lipstick-bullet-vibes': '/toys/female-sex-toys/bullet-vibrators/dart-precision-bullet',
    '/toys/female-sex-toys/bullet-vibrators/bullet-vibes-5-color-522': '/toys/female-sex-toys/bullet-vibrators/rouge-lipstick-bullet',
    '/toys/male-sex-toys/male-masturbators/auto-suction-masturbator-fire': '/toys/male-sex-toys/masturbators/titan-electric-cup',
    '/toys/female-sex-toys/clit-vibrators/rose-vibes-tongue': '/toys/female-sex-toys/clit-vibrators/rose-licking-vibrator',
    '/toys/sex-toys/butt-plugs/medal-butt-plug-ht019': '/toys/sex-toys/butt-plugs/gem-remote-metal-plug',
    '/collections/pussy-masturbators': '/male-sex-toys/manual-strokers',
    '/female-sex-toys/bullet-vibrators/the-brush': 'https://www.mythtoy.com/toys/female-sex-toys/bullet-vibrators/the-brush',
    '/female-sex-toys/bullet-vibrators/the-rouge-ii': 'https://www.mythtoy.com/toys/female-sex-toys/bullet-vibrators/the-rouge-ii',
};

// 2. 定义 410 删除规则 (Gone)
// 使用 Set 提高查找性能 (O(1))，比数组 includes (O(n)) 快
const gonePaths = new Set([
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
    '/collections/female-sex-toys/vibrators',
    '/collections/new',
    '/collections/male',
    '/collections/fairy-dildos',
    '/collections/valentine',
    '/collections/nipple-toys',
    '/collections/silicone-male-masturbator',
    '/collections/female',
    // 新增下架产品路径
    '/sex-toys/butt-plugs/gem-remote-metal-plug',
    '/lingerie/bodystockings/the-mesh',
    '/female-sex-toys/g-spot-vibrators/the-emerald',
    '/male-sex-toys/male-masturbators/the-shadow',
    '/male-sex-toys/male-masturbators/realistic-pocket-pussy-snow',
    '/female-sex-toys/wand-vibrators/scepter-smart-wand',
    '/blog/why-do-men-sleep-after-sex',
    '/female-sex-toys/g-spot-vibrators/the-link',
    '/toys/female-sex-toys/clit-vibrators/secret-wearable-app-vibe',
    '/toys/male-sex-toys/prostate-toys/remote-control-p-vibrator',
    '/toys/female-sex-toys/clit-suction-vibrators/charming-vibes',
    '/toys/female-sex-toys/clit-vibrators/power-clit-vibrator',
    '/toys/female-sex-toys/g-spot-vibrators/g-spot-green-191',
    '/toys/male-sex-toys/male-masturbators/funny-peach-pussy',
    '/toys/female-sex-toys/g-spot-vibrators/charming-vibes',
    '/toys/female-sex-toys/dildos/realistic-dildos-aley',
    '/toys/sex-toys/butt-plugs/medal-butt-plug-HT019',
    '/female-sex-toys/wand-vibrators/the-feather',
    '/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated',
    '/male-sex-toys/pussy-masturbators/realistic-pocket-pussy-dream',
    '/female-sex-toys/bullet-vibrators/dart-precision-bullet',
    '/female-sex-toys/bullet-vibrators/matte-red-lipstick-bullet-vibes',
    '/sex-toys/butt-plugs/medal-butt-plug-ht019',
    '/toys/male-sex-toys/male-masturbators/auto-suction-masturbator-fire',
    '/collections/vibrator?page=0',
    // 下架产品
    '/toys/female-sex-toys/clit-vibrators/vibrator-g-sucking-usb-szm',
    '/toys/female-sex-toys/clit-vibrators/squirrel-auto-suction-vibes',
    '/toys/male-sex-toys/pussy-masturbators/silicone-life-like-pussy',
    '/toys/female-sex-toys/clit-vibrators/suction-sex-toy-soft-szm',
    '/toys/male-sex-toys/male-masturbators/realistic-pocket-pussy-snow',
    '/toys/male-sex-toys/pussy-masturbators/realistic-pocket-pussy-dream',
    '/toys/male-sex-toys/sex-dolls/sex-doll-linda',
]);

// 3. 定义 410 前缀匹配规则
const gonePrefixes = [
    '/collections/vibrators',
    '/sex-toys',  // 临时注释，可能导致重定向循环
    '/products'
];

export async function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    
    // 0. 跳过 API 路由和静态资源
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
        return NextResponse.next();
    }
    
    // 注意：www 重定向由 Vercel 自动处理，不需要在 middleware 中处理
    // 避免与 Vercel 的域名配置冲突

    // 1. 移除 ?page=0 参数
    if (searchParams.get('page') === '0') {
        const url = request.nextUrl.clone();
        searchParams.delete('page');
        url.search = searchParams.toString();
        return NextResponse.redirect(url, { status: 301 });
    }

    // 2. 处理 301 重定向
    if (redirectMap[pathname]) {
        const destination = new URL(redirectMap[pathname], request.url);
        return NextResponse.redirect(destination, { status: 301 });
    }

    // 2.1 处理 /female-sex-toys/* 重定向到 /toys/female-sex-toys/*
    if (pathname.startsWith('/female-sex-toys/')) {
        const newPath = pathname.replace('/female-sex-toys/', '/toys/female-sex-toys/');
        const destination = new URL(newPath + request.nextUrl.search, request.url);
        return NextResponse.redirect(destination, { status: 301 });
    }

    // 2.2 处理 /male-sex-toys/* 重定向到 /toys/male-sex-toys/*
    if (pathname.startsWith('/male-sex-toys/')) {
        const newPath = pathname.replace('/male-sex-toys/', '/toys/male-sex-toys/');
        const destination = new URL(newPath + request.nextUrl.search, request.url);
        return NextResponse.redirect(destination, { status: 301 });
    }

    // 3. 处理 410 删除 - 精确匹配
    if (gonePaths.has(pathname)) {
        return new Response('Gone', { status: 410, headers: { 'Content-Type': 'text/plain', 'X-Frame-Options': 'DENY', 'X-Content-Type-Options': 'nosniff' } });
    }

    // 4. 处理 410 删除 - 前缀匹配
    for (const prefix of gonePrefixes) {
        if (pathname.startsWith(prefix)) {
            return new Response('Gone', { status: 410, headers: { 'Content-Type': 'text/plain', 'X-Frame-Options': 'DENY', 'X-Content-Type-Options': 'nosniff' } });
        }
    }

    return NextResponse.next();
}

// Config 主要是为了性能，让 Middleware 只在特定路径触发
export const config = {
    matcher: [
        /*
         * 匹配所有请求路径，除了：
         * 1. /api/ (API 路由)
         * 2. /_next/ (Next.js 内部资源)
         * 3. 静态文件和图片
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
