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
    '/collections/sex-toy': '/collections/sex-toys',
    '/contact': '/pages/contact',
    '/collections/new': '/collections/new-arrivals',
    '/collections/male': '/collections/male-sex-toys',
    '/collections/female': '/collections/female-sex-toys',
    '/collections/nipple-toys': '/collections/female-sex-toys/nipple-toys',
    '/toys/male-sex-toys/sex-dolls/sex-doll-linda': '/toys/male-sex-toys/sex-dolls/the-venus',
    '/female-sex-toys/wand-vibrators/the-feather': '/toys/female-sex-toys/wand-vibrators/the-feather',
    '/female-sex-toys/g-spot-vibrators/the-link': '/toys/female-sex-toys/g-spot-vibrators/the-link'
};

// 2. 定义 410 删除规则 (Gone)
// 使用 Set 提高查找性能 (O(1))，比数组 includes (O(n)) 快
const gonePaths = new Set([

    // 下架的产品
    '/female-sex-toys/bullet-vibrators/matte-red-lipstick-bullet-vibes',
    '/sex-toys/butt-plugs/medal-butt-plug-HT019',
    '/male-sex-toys/pussy-masturbators/life-like-miru',
    '/toys/male-sex-toys/sex-doll/mini-sex-doll-cui',
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
    '/toys/female-sex-toys/clit-vibrators/secret-wearable-app-vibe',
    '/female-sex-toys/clit-vibrators/charming-vibes',
    '/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated',
    '/female-sex-toys/wand-vibrators/scepter-smart-wand',
    '/female-sex-toys/bullet-vibrators/dart-precision-bullet',
    '/male-sex-toys/male-masturbators/auto-suction-masturbator-fire',
    '/male-sex-toys/pussy-masturbators/realistic-pocket-pussy-dream',
    // 不再需要的分类
    '/collections/vibrator',
    '/collections/sextoy',
    '/collections/pocket-pussy',
    '/collections/female-sex-toys/realistic-dildos',
    '/collections/lingerie/cos-play',
    '/collections/cos-play',
    '/collections/sex-lingerie',
    '/collections/male-sex-toys/sex-doll',
    '/collections/female-sex-toys/vibrators',
    '/collections/fairy-dildos',
    '/collections/valentine',
    '/collections/realistic-dildos',
    '/collections/silicone-male-masturbator',
    '/collections/male-sex-toys/pocket-pussy',
    '/collections/female-sex-toys/fairy-dildos',
    '/collections/sex-toys/pocket-pussy',
    '/collections/sex-toys/vibrator',
    '/collections/male-sex-toys/silicone-male-masturbator',
    // 下架的博客
    '/blog/why-do-men-sleep-after-sex',
    // 莫名其妙出现的
    '/membership',

]);

// 3. 定义 410 前缀匹配规则
const gonePrefixes = [
    '/female-sex-toys',
    '/male-sex-toys',
    '/collections/vibrators',
    '/sex-toys',
    '/products'
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- 优先处理 301 重定向 (Redirects) ---
    // 如果这个路径在映射表里，直接跳走
    if (redirectMap[pathname]) {
        const destination = new URL(redirectMap[pathname], request.url);
        return NextResponse.redirect(destination, { status: 301 });
    }

    // --- 处理 410 删除 (Gone) ---
    // 精确匹配
    if (gonePaths.has(pathname)) {
        return new Response('Gone', { status: 410, headers: { 'Content-Type': 'text/plain' } });
    }

    // 前缀匹配
    for (const prefix of gonePrefixes) {
        if (pathname.startsWith(prefix)) {
            return new Response('Gone', { status: 410, headers: { 'Content-Type': 'text/plain' } });
        }
    }

    // 白名单
    const exactAllowList = new Set([
        '/robots.txt',
        '/sitemap.xml',              // 索引文件
        '/sitemap-products.xml',     // 子 sitemap
        '/sitemap-categories.xml',   // 子 sitemap
        '/sitemap-pages.xml',        // 子 sitemap
        '/sitemap-blogs.xml',        // 子 sitemap
        '/manifest.json',            // PWA
        '/favicon.ico'               // 虽然 matcher 排除了，加这里双保险
    ]);

    // 3.2 目录白名单 (Directory Allowlist)
    // 某些标准协议文件夹
    const isDirectoryAllowed = pathname.startsWith('/.well-known/');

    // 如果在白名单内，直接放行，Next.js 会接管处理 (生成文件或返回静态文件)
    if (exactAllowList.has(pathname) || isDirectoryAllowed) {
        return NextResponse.next();
    }

     const isFileRequest = /\/[^/]+\.[^/]+$/.test(pathname);

    if (isFileRequest) {
        console.log(`🔒 Blocked missing file request: ${pathname}`);
        return new NextResponse('File not found', { status: 404 });
    }

    return NextResponse.next();
}

// Config 主要是为了性能，让 Middleware 只在特定路径触发
// 但如果你要拦截大量旧路径，与其写几百行 matcher，不如直接匹配所有非静态资源
export const config = {
    matcher: [
        /*
         * 匹配所有请求路径，除了：
         * 1. /api/ (API 路由)
         * 2. /_next/ (Next.js 内部资源)
         * 3. /_static (静态文件)
         * 4. 各种图片/字体文件扩展名
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}