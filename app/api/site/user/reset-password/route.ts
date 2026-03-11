// app/api/user/reset-password/route.ts
import { NextResponse } from 'next/server';
import { BACKEND_CONFIG } from '@/lib/api-config';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 转发到后端 V1 接口
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/V1/users/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Reset password proxy error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}