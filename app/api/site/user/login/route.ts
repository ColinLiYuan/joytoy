// app/api/users/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { SessionManager } from '@/lib/session-utils';
import { LoginResponse } from '@/types/auth';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // 获取或创建 sessionId
        const { sessionId } = SessionManager.getOrCreateSessionId(request);

        // 准备请求头，包含 sessionId
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'X-Session-Id': sessionId
        };

        const result = await apiPost<LoginResponse>('/api/V1/users/login', body, {
            headers: headers,
        });

        // console.log('user login route result: ', result)

        // 登录成功，设置 cookie
        const response = NextResponse.json(result);

        // 正确获取用户信息：只有在 success 为 true 时才从 data 中获取
        if (result.success && result.data) {
            const userInfo: LoginResponse = result.data;

            // 存储用户基本信息（非敏感信息）
            response.cookies.set('userInfo', JSON.stringify({
                id: userInfo.id,
                name: userInfo.firstName + (userInfo.lastName ? ' ' + userInfo.lastName : ''),
                email: userInfo.email,
                cartId: userInfo.cartId,
                displayName: userInfo.displayName || userInfo.firstName,
                // 只存储必要的非敏感信息
            }), {
                httpOnly: false, // 允许前端读取
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 天
                path: '/',
            });

            const accessToken = userInfo.accessToken;
            if (accessToken) {
                response.cookies.set('accessToken', accessToken, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
                    sameSite: 'lax',
                    maxAge: 60 * 30 // 30分钟
                    path: '/',
                });
            }
            const refreshToken = userInfo.refreshToken;
            if (refreshToken) {
                response.cookies.set('refreshToken', refreshToken, {
                    httpOnly: false,
                    secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 天
                    path: '/',
                });
            }
        }

        // 设置或更新 sessionId Cookie（如果是新session或者需要更新）
        SessionManager.setSessionCookie(response, sessionId);

        return response;
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