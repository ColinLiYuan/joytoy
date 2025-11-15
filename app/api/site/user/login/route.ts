// app/api/users/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result: FrontApiResponse<any> = await apiPost('/api/V1/users/login', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (result.success) {
            // 登录成功，设置 cookie
            const response = NextResponse.json(result.data);

            // 设置用户 token 到 cookie（根据你的 API 返回结构调整）
            const token = result.data?.token || result.data?.access_token;
            const userInfo = result.data?.data || result.data;
            // console.log('login route userInfo: ', userInfo.data.id);
            console.log('login route userInfo2: ', result.data);

            if (token) {
                response.cookies.set('auth_token', token, {
                    httpOnly: true, // 防止 XSS 攻击
                    secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS
                    sameSite: 'lax',
                    maxAge: 60 * 60 * 24 * 7, // 7 天
                    path: '/',
                });
            }

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
            }

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