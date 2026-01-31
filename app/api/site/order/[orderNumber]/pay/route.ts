// app/api/order/[orderNumber]/pay/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';
import { SessionManager } from '@/lib/session-utils'; // ✅ 引入 SessionManager

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const params = await context.params;
        const orderNumber = params.orderNumber;

        // console.log('payOrder as : ', orderNumber)

        if (!orderNumber) {
            return NextResponse.json(
                { success: false, error: 'Missing Order Number' },
                { status: 400 }
            );
        }

        const body = await request.json();

        // 验证必需字段
        if (!body.transactionId || !body.paymentMethod) {
            return NextResponse.json(
                { success: false, error: 'Missing payment details' },
                { status: 400 }
            );
        }

        // ✅ 1. 获取 Session ID (用于游客)
        const { sessionId } = SessionManager.getOrCreateSessionId(request);

        // ✅ 2. 尝试获取 Token (用于登录用户)
        const token = await getToken();

        // ✅ 3. 构造 Headers
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'x-session-id': sessionId, // 总是带上 Session ID
        };

        // 如果有 Token，带上；如果没有（游客），就不带
        // 后端接口不应该强制要求 Authorization，只要 orderId 和 transactionId 对得上即可
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        // 调用后端 API
        const result = await apiPost(`/api/V1/order/${orderNumber}/pay`, body, { headers });

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 PAYMENT Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}