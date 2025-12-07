// app/api/order/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;

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
        // console.log('🟢 Order get API result:', result);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 ORDER GET Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}