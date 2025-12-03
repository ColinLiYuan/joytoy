// /app/api/product/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { getToken } from '@/lib/cookie-utils';

// ✅ 关键：强制动态，确保每次都读取最新的 Cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 1. 再次尝试获取 token
        const token = await getToken();

        // Debug: 打印一下看看 (调试完可删除)
        console.log('API Route Token Check:', token ? 'Available' : 'Missing');

        const { searchParams } = new URL(request.url);
        // ... 获取其他参数 (保持你原有的代码) ...
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

        // ... 拼接 URL (保持你原有的代码) ...
        if (userId) url += `&userId=${userId}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (colors) url += `&colors=${colors}`;
        if (features) url += `&features=${features}`;
        if (materials) url += `&materials=${materials}`;
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (sortDirection) url += `&sortDirection=${sortDirection}`;

        // ✅ 2. 显式构造 Headers 并传给 apiGet
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            // 如果后端认 auth_token 这个 Cookie，也加上
            headers['Cookie'] = `auth_token=${token}`;
        }

        // 调用 apiGet (注意：确保你的 lib/api-utils.ts 的 apiGet 支持第二个参数 headers)
        // 如果 apiGet 不支持，你需要去修改 lib/api-utils.ts
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