// app/api/order/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    console.log('🟢 ORDER GET route HIT!');
    try {
        const { orderId } = await params;
        console.log('🟢 Getting order:', orderId);

        if (!orderId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order ID is required'
                },
                { status: 400 }
            );
        }

        // 调用后端API获取订单详情
        const result = await apiGet(`/api/V1/order/${orderId}`);
        console.log('🟢 Order get API result:', result);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to get order'
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.data
        });

    } catch (error) {
        console.error('🔴 ORDER GET Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}