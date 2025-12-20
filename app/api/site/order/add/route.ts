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

        // 1. 先创建 Response 对象
        const response = NextResponse.json(result);

        // 2. 如果后端返回成功，说明订单已创建
        // 此时我们删除游客的 Session Cookie
        // 注意：如果是登录用户，是否删除取决于你的业务。
        // 通常如果是混合购物车逻辑，下单后清空 Session 也是安全的，因为 Session 代表临时购物车。
        if (result && (result.success === true || result.id)) {
            SessionManager.deleteSessionCookie(response);
        }

        // 3. 返回带有 "Set-Cookie: CART_SESSION_ID=; Max-Age=0" 的响应
        return response;
        // ✅ 核心修改结束

    } catch (error) {
        // 异常处理 (你的代码)
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}