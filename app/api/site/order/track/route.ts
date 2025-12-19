// app/api/order/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

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

        // 2. ✅ 核心优化：自动去除订单号开头的 '#' 号
        // 逻辑：如果是 "#MYTH-123"，变成 "MYTH-123"；如果是 "MYTH-123"，保持不变
        // trim() 去除首尾空格，replace(/^#/, '') 去除开头的井号
        orderNumber = orderNumber.toString().trim().replace(/^#/, '');

        // 3. 构造查询参数 (后端是 @RequestParam，所以是 Query String)
        const queryParams = new URLSearchParams({
            orderNumber: orderNumber,
            email: email.trim() // 邮箱也顺手去个空格
        });

        // 4. 调用后端 Java 接口 (GET /api/V1/order/track?orderNumber=...&email=...)
        // 不需要 Token，这是公开接口
        const result = await apiGet(`/api/V1/order/track?${queryParams.toString()}`);

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