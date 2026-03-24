// app/api/order/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { orderNumber, email } = body;

        // 1. 基础校验
        if (!orderNumber || !email) {
            return NextResponse.json(
                { success: false, error: 'Order Number and Email are required' },
                { status: 400 }
            );
        }

        // 2. 自动去除订单号开头的 '#' 号
        orderNumber = orderNumber.toString().trim().replace(/^#/, '');

        // 3. 构造要发送给 Java 后端的 JSON (因为后端之前我们改成 @RequestBody 接收 POST 了)
        const payload = {
            orderNumber: orderNumber,
            email: email.trim()
        };

        // 4. 调用后端 Java 接口
        const url = `/api/V1/order/track`;
        const result = await apiPost(url, payload);

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