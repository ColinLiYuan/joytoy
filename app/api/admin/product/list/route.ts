// /app/api/admin/product/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const status = searchParams.get('status');
        const keyword = searchParams.get('keyword');
        const vendor = searchParams.get('vendor');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';

        let url = `/api/admin/V1/product/list?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;
        if (category) url += `&category=${category}`;
        if (keyword) url += `&keyword=${keyword}`;
        if (vendor) url += `&vendor=${vendor}`;
        // console.log('query list url ' + url)

        // 获取前端传来的 Authorization header
        const authHeader = request.headers.get('authorization');
        const headers: Record<string, string> = {};
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const result = await apiGet(url, { headers });
        // console.log('admin product list route:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Product LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}