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
    '/female-sex-toys/bullet-vibrators/the-brush',
    '/sex-toys/butt-plugs/gem-remote-metal-plug',
    '/female-sex-toys/bullet-vibrators/the-rouge-ii',
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
    '/pages/return-refund',
    '/female-sex-toys/bullet-vibrators/matte-red-lipstick-bullet-vibes',
    '/sex-toys/butt-plugs/medal-butt-plug-ht019',
    '/toys/male-sex-toys/male-masturbators/auto-suction-masturbator-fire',
    '/collections/vibrator?page=0',
    // 下架博客文章
    '/blog/health-benefits-of-solo-play',
    '/blog/stress-and-libido-connection',
    '/blog/minimalist-bedroom-aesthetic-guide',
    '/blog/science-of-afterglow-hormones',
    '/blog/ultimate-toy-care-guide',
    '/blog/why-do-men-sleep-after-sex',
    // 下架产品
    '/toys/female-sex-toys/clit-vibrators/rose-licking-vibrator',
    // 下架分类
    '/collections/male-sex-toys/manual-strokers',
    '/collections/best-sellers',
    // 下架产品（404列表）
    '/toys/female-sex-toys/g-spot-vibrators/the-swan',
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
    '/sex-toys',
    '/products'
];

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;
    
    // 🛑 核心修复：开发环境/本地访问直接跳过所有重定向，防止 SSL 错误
    const hostname = request.nextUrl.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    
    if (!isLocal) {
        const protocol = request.headers.get('x-forwarded-proto') || 'https';
        const host = request.headers.get('host') || '';
        
        // 1. 强制 HTTPS
        if (protocol === 'http') {
            const url = request.nextUrl.clone();
            url.protocol = 'https:';
            return NextResponse.redirect(url, { status: 301 });
        }
        
        // 2. 强制非 www
        if (host.startsWith('www.')) {
            const url = request.nextUrl.clone();
            url.host = host.replace('www.', '');
            return NextResponse.redirect(url, { status: 301 });
        }
    }

    // --- 1. 移除 ?page=0 参数 ---
    if (searchParams.get('page') === '0') {
        const url = request.nextUrl.clone();
        searchParams.delete('page');
        url.search = searchParams.toString();
        return NextResponse.redirect(url, { status: 301 });
    }

    // --- 2. 优先处理 301 重定向 (Redirects) ---
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

    // ✅ 新增：管理员路由保护
    if (pathname.startsWith('/admin')) {
        // 注意：Cookie key 是 accessToken (驼峰)，不是 access_token
        const token = request.cookies.get('accessToken') || request.cookies.get('access_token');
        
        if (!token) {
            console.log('[Middleware] Admin access denied: No token found');
            // 重定向到首页，带上 redirect 参数
            return NextResponse.redirect(new URL('/?redirect=/admin', request.url));
        }
        
        try {
            const payload = parseJwt(token.value);
            console.log('[Middleware] Admin token payload:', { isAdmin: payload.isAdmin, role: payload.role });
            
            // 检查是否有管理员权限（兼容 role 和 isAdmin 两种字段）
            const hasAdminPermission = payload.isAdmin === true || 
                                      payload.role === 'ADMIN' || 
                                      payload.role === 'SUPER_ADMIN';
            
            if (!hasAdminPermission) {
                console.log('[Middleware] Admin access denied: User is not admin');
                return NextResponse.redirect(new URL('/403', request.url));
            }
        } catch (error) {
            console.log('[Middleware] Admin access denied: Invalid token', error);
            return NextResponse.redirect(new URL('/?redirect=/admin', request.url));
        }
    }

    // ✅ 新增：联盟路由保护
    if (pathname.startsWith('/affiliate')) {
        const token = request.cookies.get('accessToken') || request.cookies.get('access_token');
        
        if (!token) {
            // 重定向到首页，带上 redirect 参数
            return NextResponse.redirect(new URL('/?redirect=/affiliate', request.url));
        }
        
        try {
            const payload = parseJwt(token.value);
            // 修复：同时检查 isAffiliate 和 affiliateId 字段
            // 后端可能只返回其中一个
            if (!payload.isAffiliate && !payload.affiliateId) {
                return NextResponse.redirect(new URL('/403', request.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/?redirect=/affiliate', request.url));
        }
    }

    return NextResponse.next();
}

// JWT 解析工具函数（简单实现，不验证签名）
function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        throw new Error('Invalid token');
    }
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