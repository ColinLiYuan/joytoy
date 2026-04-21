import { NextRequest, NextResponse } from 'next/server';
import { SERVER_CONFIG, BACKEND_CONFIG } from '@/lib/api-config';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    try {
        const { orderNumber } = await params;
        
        console.log('[Order Cancel API] Starting cancel for order:', orderNumber);
        
        // 获取 Cookie 中的 Token
        const token = request.cookies.get('accessToken')?.value;
        const refreshToken = request.cookies.get('refreshToken')?.value;

        if (!token) {
            console.log('[Order Cancel API] No access token found');
            return NextResponse.json({ 
                success: false, 
                message: '请先登录' 
            }, { status: 401 });
        }

        // 调用后端取消订单接口
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/order/${orderNumber}/cancel`;
        console.log('[Order Cancel API] Calling backend URL:', url);
        console.log('[Order Cancel API] BACKEND_CONFIG.baseURL:', BACKEND_CONFIG.baseURL);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        });

        console.log('[Order Cancel API] Backend response status:', response.status);
        
        const data = await response.json();
        console.log('[Order Cancel API] Backend response data:', data);

        if (!response.ok || !data.success) {
            console.error('[Order Cancel API] Backend error:', data);
            return NextResponse.json({ 
                success: false, 
                message: data.message || '取消订单失败' 
            }, { status: response.status });
        }

        console.log('[Order Cancel API] Order cancelled successfully');
        return NextResponse.json({ success: true, message: data.message || '订单已取消' });

    } catch (error) {
        console.error('[Order Cancel API] Error:', error);
        return NextResponse.json({ 
            success: false, 
            message: '系统错误，请稍后重试' 
        }, { status: 500 });
    }
}
