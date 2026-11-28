// app/api/revalidate/route.ts
// 按需刷新指定页面缓存（Next ISR + Vercel Edge 缓存），GET/POST 均可，无鉴权。
// GET:  /api/revalidate?path=/blog/xxx            （可重复 path 参数刷多个）
// GET:  /api/revalidate?path=/blog/xxx,/collections/abc （逗号分隔多个）
// POST: body { "path": "..." } 或 { "paths": ["...", "..."] }
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

function collectPaths(searchParams: URLSearchParams, body: { path?: unknown; paths?: unknown }): string[] {
    const out: string[] = [];
    for (const p of searchParams.getAll('path')) {
        for (const part of p.split(',')) {
            const t = part.trim();
            if (t) out.push(t);
        }
    }
    if (Array.isArray(body.paths)) {
        body.paths.filter((p): p is string => typeof p === 'string').forEach(p => out.push(p));
    } else if (typeof body.path === 'string') {
        out.push(body.path);
    }
    return out.filter(p => p.startsWith('/'));
}

async function handle(request: NextRequest) {
    let body: { path?: unknown; paths?: unknown } = {};
    if (request.method === 'POST') {
        try {
            body = await request.json();
        } catch {
            // 忽略无法解析的 body，仍按 query 参数处理
        }
    }

    const paths = collectPaths(request.nextUrl.searchParams, body);
    if (paths.length === 0) {
        return NextResponse.json({ success: false, message: '缺少 path 参数（以 / 开头的页面路径，可逗号分隔多个）' }, { status: 400 });
    }

    for (const p of paths) {
        revalidatePath(p);
    }
    return NextResponse.json({ success: true, refreshed: paths });
}

export async function GET(request: NextRequest) {
    return handle(request);
}

export async function POST(request: NextRequest) {
    return handle(request);
}
