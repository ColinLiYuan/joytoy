import { NextRequest, NextResponse } from 'next/server';
import { apiDelete, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

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
                    message: 'productId 参数缺失'
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
                    message: '用户未登录，无法操作心愿单'
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
        const result = await apiDelete(
            `/api/V1/wishlist?productId=${productId}`,
            requestOptions
        );

        // 确保返回标准 JSON 格式
        return NextResponse.json({
            success: result.success,
            message: result.message,
            data: result.data
        });

    } catch (error) {
        console.error('移除心愿单代理错误:', error);
        const { errorMessage } = handleApiError(error);

        return NextResponse.json(
            {
                success: false,
                message: errorMessage || '移除心愿单失败'
            },
            { status: 500 }
        );
    }
}