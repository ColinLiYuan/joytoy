// app/api/users/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { SessionManager } from '@/lib/session-utils';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 获取或创建 sessionId
        const { sessionId, isNew } = SessionManager.getOrCreateSessionId(request);

        // 准备请求头，包含 sessionId
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId  // 添加 sessionId 到 header
        };

        const result: FrontApiResponse<any> = await apiPost('/api/V1/users/login', body, {
            headers: headers,
        });

        if (result.success) {
            // 登录成功，设置 cookie
            const response = NextResponse.json(result.data);

            const userInfo = result.data?.data || result.data;
            // console.log('login route userInfo2: ', result.data);

            // 如果需要存储用户基本信息（非敏感信息）
            if (userInfo) {
                response.cookies.set('userInfo', JSON.stringify({
                    id: userInfo.id,
                    name: userInfo.name,
                    email: userInfo.email,
                    cartId: userInfo.cartId,
                    // 只存储必要的非敏感信息
                }), {
                    httpOnly: false, // 允许前端读取
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 天
                    path: '/',
                });

                const token = userInfo?.token;
                if (token) {
                    response.cookies.set('auth_token', token, {
                        httpOnly: true, // 防止 XSS 攻击
                        secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
                        sameSite: 'lax',
                        maxAge: 60 * 60 * 24 * 7, // 7 天
                        path: '/',
                    });
                }
            }

            // 设置或更新 sessionId Cookie（如果是新session或者需要更新）
            SessionManager.setSessionCookie(response, sessionId);

            const setCookies = response.cookies.getAll();
            console.log('🔐 Response cookies set:', setCookies);

            return response;
        } else {
            return NextResponse.json(
                { error: result.error || 'Login failed' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Login proxy error:', error);

        // 使用统一的错误处理
        const errorResult = handleApiError(error);
        return NextResponse.json(
            errorResult,
            { status: 500 }
        );
    }
}