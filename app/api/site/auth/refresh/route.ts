// app/api/site/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost } from '@/lib/api-utils';
import { getToken, getRefreshToken } from '@/lib/token-utils';

export async function POST(request: NextRequest) {
    try {
        // 调试：打印所有 Cookie
        const allCookies = request.cookies.getAll();
        console.log('[Auth Refresh] All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
        
        // 获取 refreshToken
        let refreshToken = '';
        
        // 尝试从请求体获取
        try {
            const body = await request.json();
            refreshToken = body.refreshToken;
        } catch {
            // 如果请求体解析失败，从 cookie 获取
            refreshToken = await getRefreshToken() || '';
        }

        if (!refreshToken) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No refresh token found'
                },
                { status: 401 }
            );
        }

        // 调用后端刷新接口
        const result = await apiPost('/api/V1/users/refresh', { refreshToken });

        // ✅ 关键修复：传递后端返回的状态码
        const status = result.status || (result.success ? 200 : 500);
        return NextResponse.json(result, { status });

    } catch (error) {
        console.error('🔴 AUTH Refresh Error:', error);
        return NextResponse.json(
            { success: false, message: 'Token refresh failed' },
            { status: 500 }
        );
    }
}
