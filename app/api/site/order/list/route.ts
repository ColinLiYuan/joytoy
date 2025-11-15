// app/api/order/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    console.log('🟢 ORDERS LIST route HIT!');
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '20';

        // console.log('🟢 Getting orders for user:', userId);

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'User ID is required'
                },
                { status: 400 }
            );
        }

        // 调用后端API获取订单列表
        const result = await apiGet(`/api/V1/order/user/${userId}?page=${page}&size=${size}`);
        // console.log('🟢 Orders list API result:', result);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to get orders'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('🔴 ORDERS LIST Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}