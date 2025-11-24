import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { SessionManager } from '@/lib/session-utils';

// /api/cart/[cartId]
// get cart
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cartId: string }> }
) {
    try {
        const { cartId } = await params;

        // 1. 获取或创建 sessionId
        const { sessionId, isNew } = SessionManager.getOrCreateSessionId(request);

        // 2. 准备请求配置
        const requestOptions = SessionManager.prepareSessionHeaders(cartId, sessionId);

        // 3. 调用后端 API
        const url = `/api/V1/cart/${cartId}`;
        const result: FrontApiResponse = await apiGet(url, requestOptions);

        if (!result.success) {
            return NextResponse.json(
                {error: result.error},
                { status: 400 }
            );
        }

        // 4. 创建响应并设置 Cookie（如果是新session）
        const response = NextResponse.json(result.data);
        if (isNew) {
            SessionManager.setSessionCookie(response, sessionId);
        }

        return response;
    } catch (error) {
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}