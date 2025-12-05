import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';
import { SessionManager } from '@/lib/session-utils';
import { getToken } from '@/lib/cookie-utils';

// /api/cart/get
// get cart
export async function GET(
    request: NextRequest
) {
    try {
        // 1. 获取或创建 sessionId
        const { sessionId, isNew } = SessionManager.getOrCreateSessionId(request);

        // 2. 准备请求头
        const headers: Record<string, string> = {
            'x-session-id': sessionId,
            'Content-Type': 'application/json',
        };

        // 3. 如果有token，添加到请求头；没有就用sessionId
        const token = await getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions = {
            headers,
        };

        // 4. 调用后端 API
        const url = `/api/V1/cart`;
        const result: BackendApiResponse = await apiGet(url, requestOptions);

        // console.log('cart get route:', result);

        // 5. 创建响应并设置 Cookie（如果是新session）
        const response = NextResponse.json(result);
        if (isNew) {
            SessionManager.setSessionCookie(response, sessionId);
        }

        return response;
    } catch (error) {
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}