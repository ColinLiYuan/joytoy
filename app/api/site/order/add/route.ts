// app/api/order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { OrderCreateRequest } from '@/types/order';
import { getToken } from '@/lib/token-utils';
import { SessionManager } from '@/lib/session-utils'; // ✅ 引入

export async function POST(request: NextRequest) {
    try {
        const body: OrderCreateRequest = await request.json();

        // ✅ 1. 获取 Session ID
        const { sessionId } = SessionManager.getOrCreateSessionId(request);

        // 验证必需字段 (你的代码)
        if (!body.items || !body.shippingAddress || !body.shippingMethod) { /* ... */ }
        for (let i = 0; i < body.items.length; i++) { /* ... */ }

        const token = await getToken();

        // ✅ 修复：必须有 userId 或 sessionId
        if (!body.userId && !sessionId) {
            return NextResponse.json(
                { success: false, error: 'Missing userId or sessionId' },
                { status: 400 }
            );
        }

        // 设置默认值 (你的代码)
        const orderData: OrderCreateRequest = {
            ...body,
            shippingFee: body.shippingFee ?? 0,
            discountAmount: body.discountAmount ?? 0,
            customerNote: body.customerNote ?? '',
            // ✅ 游客不传 userId，登录用户传 userId
            // 这里的类型定义要与你的 OrderCreateRequest 接口一致
            userId: body.userId || undefined,
        };

        // ✅ 3. 准备请求头
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            // 游客和登录用户都传 sessionId (用于识别购物车)
            'x-session-id': sessionId,
        };

        // ✅ 如果登录了，才传 token
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions = { headers };

        // 4. 调用后端 API (你的代码)
        const result = await apiPost('/api/V1/order', orderData, requestOptions);

        // 5. 返回结果 (你的代码)
        return NextResponse.json(result);

    } catch (error) {
        // 异常处理 (你的代码)
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}