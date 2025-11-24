import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { SessionManager } from '@/lib/session-utils';

// add to cart
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ cartId: string }> }
) {
    try {
        const { cartId } = await params;
        const body = await request.json();

        // 使用 SessionManager 简化代码
        const { sessionId, isNew } = SessionManager.getOrCreateSessionId(request);
        const requestOptions = SessionManager.prepareSessionHeaders(cartId, sessionId);

        const url = `/api/V1/cart/${cartId}/items`;
        const result: FrontApiResponse = await apiPost(url, body, requestOptions);

        if (!result.success) {
            return NextResponse.json(
                {error: result.error},
                { status: 400 }
            );
        }

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