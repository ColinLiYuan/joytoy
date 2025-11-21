import { NextRequest, NextResponse } from 'next/server';
import { apiPut, apiDelete, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// /api/cart/items/[itemId]
// update quantity and delete item
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;

        // 从请求体中获取 quantity 和 cartId
        let quantity = 1;
        let cartId = '';

        try {
            const body = await request.json();
            quantity = body.quantity || 1;
            cartId = body.cartId;

            // console.log('cart update route cartId: ', cartId)

            if (!cartId) {
                return NextResponse.json(
                    { error: 'Cart ID is required' },
                    { status: 400 }
                );
            }
        } catch (error) {
            console.log('🟡 PUT - 无法解析请求体');
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // 调用后端 API - 数量通过查询参数传递
        const url = `/api/V1/cart/items/${itemId}?quantity=${quantity}&cartId=${cartId}`;
        const result: FrontApiResponse = await apiPut(url);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);

    } catch (error) {
        console.error('🔴 PUT Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}

// DELETE 方法
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ itemId: string }> }
) {
    try {
        const { itemId } = await params;

        // 从请求体中获取 cartId
        let cartId = '';

        try {
            const body = await request.json();
            cartId = body.cartId;

            if (!cartId) {
                return NextResponse.json(
                    { error: 'Cart ID is required' },
                    { status: 400 }
                );
            }
        } catch (error) {
            console.log('🟡 DELETE - 无法解析请求体');
            return NextResponse.json(
                { error: 'Invalid request body' },
                { status: 400 }
            );
        }

        // 调用后端 API
        const url = `/api/V1/cart/items/${itemId}?cartId=${cartId}`;
        const result = await apiDelete(url);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to remove item from cart'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data || { message: 'Item removed successfully' }
        });
    } catch (error) {
        console.error('🔴 DELETE Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}