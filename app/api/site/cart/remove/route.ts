// app/api/cart/remove

import { NextRequest, NextResponse } from 'next/server';
import { apiDelete, handleApiError } from '@/lib/api-utils';
import { SessionManager } from '@/lib/session-utils';
import { getToken } from '@/lib/token-utils';

export async function DELETE(
    request: NextRequest
) {
    try {
        const body = await request.json();
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
        const url = `/api/V1/cart?itemId=${itemId}`;
        const result = await apiDelete(url, requestOptions);

        // 5. 创建响应并设置 Cookie（如果是新session）
        const response = NextResponse.json({
            data: result || { message: 'Item removed successfully' }
        });

        if (isNew) {
            SessionManager.setSessionCookie(response, sessionId);
        }

        return response;
    } catch (error) {
        console.error('🔴 DELETE Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}