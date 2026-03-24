// app/api/order/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';  // 确保引入 apiPost

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { orderNumber, email } = body;

        // 1. 基础校验
        if (!orderNumber || !email) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order Number and Email are required'
                },
                { status: 400 }
            );
        }

        // 2. 去除订单号开头的 '#'
        orderNumber = orderNumber.toString().trim().replace(/^#/, '');
        email = email.trim();  // 也去除邮箱首尾空格

        // 3. 构造请求体（POST 请求，需要把参数放在 body 里）
        const requestBody = {
            orderNumber,
            email,
        };

        // 4. 调用后端 Java 接口 (POST /api/V1/order/track)
        const result = await apiPost('/api/V1/order/track', requestBody);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 ORDER TRACK Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}