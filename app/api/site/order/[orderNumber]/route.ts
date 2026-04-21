// app/api/order/[orderNumber]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params;

        if (!orderNumber) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Order ID is required'
                },
                { status: 400 }
            );
        }

        // 🔧 Extract token from Cookie header
        const cookieHeader = request.headers.get('cookie') || '';
        const token = parseAccessTokenFromCookie(cookieHeader);

        console.log('[ORDER DETAIL] Token extracted:', token ? 'YES' : 'NO');
        if (token) {
            console.log('[ORDER DETAIL] Token preview:', token.substring(0, 50) + '...');
        }

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    errorMessage: '用户未登录，无法获取订单详情'
                },
                { status: 401 }
            );
        }

        // Call backend API with token
        console.log('[ORDER DETAIL] Calling backend:', `/api/V1/order/${orderNumber}`);
        const result = await apiGet(`/api/V1/order/${orderNumber}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('[ORDER DETAIL] Backend response:', {
            success: result.success,
            message: result.message,
            status: result.status,
            hasData: !!result.data
        });

        // 🔧 关键修复：如果后端返回 401，直接透传给客户端，让客户端处理刷新
        if (result.status === 401) {
            return NextResponse.json(result, { status: 401 });
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 ORDER GET Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}

// Helper: parse accessToken from cookie string
function parseAccessTokenFromCookie(cookieString: string): string | null {
    if (!cookieString) return null;
    
    const cookies = cookieString.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
            return decodeURIComponent(value);
        }
    }
    return null;
}