// api/product/list/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import {cookies} from "next/headers";

// ✅ 保持强制动态
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 🔍 暴力调试：直接从 Request Header 里拿，不经过 Next.js 的 cookies() 封装
        // 这样能排除所有 Next.js 版本兼容性问题

        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        // console.log('🔍 ALL COOKIES:', allCookies);

        const allCookies2 = request.cookies;
        // console.log('🔍 ALL COOKIES222:', allCookies2);

        // 方法 A: 从 nextUrl cookies 拿
        let token = request.cookies.get('auth_token')?.value;

        // 方法 B: 如果 A 也没有，直接解析 Header 字符串 (最底层的方法)
        if (!token) {
            const cookieHeader = request.headers.get('cookie') || '';
            const match = cookieHeader.match(/auth_token=([^;]+)/);
            if (match) {
                token = match[1];
                console.log('✅ 居然是从 Header 字符串里硬解出来的！');
            }
        }

        // 🖨️ 打印调试结果
        console.log('------------------------------------------------');
        console.log('🍪 API Route Debug Info:');
        console.log('👉 URL:', request.url);
        console.log('👉 All Cookies Names:', request.cookies.getAll().map(c => c.name).join(', '));
        console.log('👉 auth_token found?', !!token);
        console.log('------------------------------------------------');

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const userId = searchParams.get('userId');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const colors = searchParams.get('colors');
        const features = searchParams.get('features');
        const materials = searchParams.get('materials');
        const sortBy = searchParams.get('sortBy');
        const sortDirection = searchParams.get('sortDirection');

        let url = `/api/V1/product/queryByCategory?category=${category}&page=${page}&size=${size}`;

        if (userId) url += `&userId=${userId}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (colors) url += `&colors=${colors}`;
        if (features) url += `&features=${features}`;
        if (materials) url += `&materials=${materials}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (sortDirection) url += `&sortDirection=${sortDirection}`;

        // ✅ 3. 构造 Headers
        const headers: Record<string, string> = {};

        // 如果这里 token 有值，就一定会发给后端
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            headers['Cookie'] = `auth_token=${token}`;
        }

        const result: FrontApiResponse = await apiGet(url, headers);

        if (!result.success) {
            return NextResponse.json({error: result.error}, { status: 400 });
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('🔴 Product LIST Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}