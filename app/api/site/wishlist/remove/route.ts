import { NextRequest, NextResponse } from 'next/server';
import { apiDelete, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';
import { getToken } from '@/lib/cookie-utils';

// 从心愿单移除商品
export async function DELETE(
    request: NextRequest
) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'productId 参数缺失'
                },
                { status: 400 }
            );
        }

        // 1. 获取 token
        const token = await getToken();

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    error: '用户未登录，无法操作心愿单'
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

        // 3. 调用后端 API 移除心愿单商品
        const result: BackendApiResponse = await apiDelete(
            `/api/V1/wishlist?productId=${productId}`,
            requestOptions
        );

        return NextResponse.json(result);

    } catch (error) {
        console.error('移除心愿单代理错误:', error);
        // 正确使用 handleApiError
        const { errorMessage } = handleApiError(error);

        return NextResponse.json(
            {
                success: false,
                errorMessage
            },
            { status: 500 }
        );
    }
}