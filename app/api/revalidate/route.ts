// app/api/revalidate/route.ts
// 按需刷新指定页面缓存（Next ISR + Vercel Edge 缓存）。
// 鉴权：Authorization: Bearer <REVALIDATE_SECRET>（Vercel 环境变量，缺省用内置默认值）。
// 请求体：{ "path": "/blog/xxx" } 或 { "paths": ["/blog/xxx", "/blog"] }
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const SECRET = process.env.REVALIDATE_SECRET || 'mythtoy-cache-refresh';

export async function POST(request: NextRequest) {
    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token || token !== SECRET) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: { path?: unknown; paths?: unknown } = {};
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, message: '请求体需为 JSON' }, { status: 400 });
    }

    const paths: string[] = Array.isArray(body.paths)
        ? body.paths.filter((p): p is string => typeof p === 'string')
        : (typeof body.path === 'string' ? [body.path] : []);

    if (paths.length === 0) {
        return NextResponse.json({ success: false, message: 'path 或 paths 必填（以 / 开头的页面路径）' }, { status: 400 });
    }

    const refreshed: string[] = [];
    for (const p of paths) {
        if (!p.startsWith('/')) continue;
        revalidatePath(p);
        refreshed.push(p);
    }

    return NextResponse.json({ success: true, refreshed });
}
