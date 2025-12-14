// app/api/wishlist/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export async function GET(request: NextRequest) {
    try {
        // 1. 获取 token
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    errorMessage: '用户未登录，无法获取心愿列表'
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

        let url = `/api/V1/wishlist`;
        const result = await apiGet(url, requestOptions);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 Wishlist LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}