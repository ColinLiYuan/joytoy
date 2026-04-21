// app/api/order/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '20';

        // 1. 获取 token
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    errorMessage: '用户未登录，无法获取订单列表'
                },
                { status: 401 }
            );
        }

        // 2. 准备请求头，添加 Authorization
        const requestOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        let url = `/api/V1/order/list?page=${page}&size=${size}`;
        const result = await apiGet(url, requestOptions);

        // ✅ 关键修复：传递后端返回的状态码
        const status = result.status || (result.success ? 200 : 500);
        return NextResponse.json(result, { status });

    } catch (error) {
        console.error('🔴 ORDERS LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}
