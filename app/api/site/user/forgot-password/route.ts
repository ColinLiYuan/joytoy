import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_CONFIG } from '@/lib/api-config';

// 定义预期的响应数据结构（根据你的后端返回情况调整）
interface ForgotPasswordResponse {
    success?: boolean;
    message?: string;
    error?: string;
}

export async function POST(request: NextRequest) {
    try {
        // 解析请求体
        const body = await request.json();

        // 转发到 Spring Boot 后端
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/V1/users/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // 根据你后端的返回格式（text 或 json）进行处理
        const data = await response.text();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: data || 'Password reset request failed' },
                { status: response.status }
            );
        }

        // 统一返回 success: true 格式，方便前端 AuthModal 判断
        return NextResponse.json({
            success: true,
            message: data
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}