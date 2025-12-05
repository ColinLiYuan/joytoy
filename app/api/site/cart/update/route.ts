// app/api/cart/update

import { NextRequest, NextResponse } from 'next/server';
import { apiPut, handleApiError } from '@/lib/api-utils';
import { SessionManager } from '@/lib/session-utils';
import { getToken } from '@/lib/cookie-utils';

// update quantity
export async function PUT(
    request: NextRequest
) {
    try {
        // 从请求体中获取 quantity
        const body = await request.json();
        let quantity = body.quantity || 1;
        let itemId = body.itemId || 1;

        // 1. 获取或创建 sessionId
        const { sessionId, isNew } = SessionManager.getOrCreateSessionId(request);

        // 2. 准备请求头
        const headers: Record<string, string> = {
            'x-session-id': sessionId,
            'Content-Type': 'application/json',
        };

        // 3. 如果有token，添加到请求头
        const token = await getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const requestOptions = {
            headers,
        };

        // 4. 调用后端 API
        // 如果后端需要查询参数
        const url = `/api/V1/cart?quantity=${quantity}&itemId=${itemId}`;

        const result = await apiPut(url, undefined, requestOptions);

        // 5. 创建响应并设置 Cookie（如果是新session）
        const response = NextResponse.json(result);
        if (isNew) {
            SessionManager.setSessionCookie(response, sessionId);
        }

        return response;

    } catch (error) {
        console.error('🔴 PUT Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}