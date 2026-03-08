
// app/api/checkout
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { CheckoutValidateRequest } from '@/types/checkout';

export async function POST(request: NextRequest) {
    try {
        const body: CheckoutValidateRequest = await request.json();

        const reviewData: CheckoutValidateRequest = {
            ...body,
        };
        // console.log('create review route: ', reviewData)

        // 准备请求头，添加 Authorization
        const requestOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // 调用后端API创建订单
        const result = await apiPost('/api/V1/checkout/validateCoupon', reviewData, requestOptions);
        // console.log('🟢 Backend API response:', result);

        return NextResponse.json(result);

    } catch (error) {
        console.error('validateCoupon Error:', error);
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