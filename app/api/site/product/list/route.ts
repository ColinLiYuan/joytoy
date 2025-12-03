// /app/api/product/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { getToken } from '@/lib/cookie-utils';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken();
        console.log('getProductsByCategory route token: ', token)
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const userId = searchParams.get('userId');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';

        // 筛选参数
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const colors = searchParams.get('colors');
        const features = searchParams.get('features');
        const materials = searchParams.get('materials');

        // 新增排序参数
        const sortBy = searchParams.get('sortBy');
        const sortDirection = searchParams.get('sortDirection');

        let url = `/api/V1/product/queryByCategory?category=${category}&page=${page}&size=${size}`;

        if (userId) {
            url += `&userId=${userId}`;
        }

        // 添加筛选参数到后端API
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (colors) url += `&colors=${colors}`;
        if (features) url += `&features=${features}`;
        if (materials) url += `&materials=${materials}`;

        // 添加排序参数到后端API
        if (sortBy) url += `&sortBy=${sortBy}`;
        if (sortDirection) url += `&sortDirection=${sortDirection}`;

        // console.log('product list route url: ' + url);

        const result: FrontApiResponse = await apiGet(url);

        if (!result.success) {
            return NextResponse.json(
                {error: result.error},
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('🔴 Product LIST Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}