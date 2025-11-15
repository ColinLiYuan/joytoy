import { NextRequest, NextResponse } from 'next/server';
import { apiDelete, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// 从心愿单移除商品
export async function DELETE(
    request: NextRequest
) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');

        if (!userId || !productId) {
            return NextResponse.json(
                { error: '缺少 userId 或 productId 参数' },
                { status: 400 }
            );
        }
        const result: FrontApiResponse = await apiDelete(`/api/V1/wishlist/${userId}/items/${productId}`);

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { error: result.error || '从心愿单移除商品失败' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('移除心愿单代理错误:', error);
        const errorResult = handleApiError(error);
        return NextResponse.json(errorResult, { status: 500 });
    }
}