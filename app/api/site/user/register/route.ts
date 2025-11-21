// app/api/users/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result: FrontApiResponse<any> = await apiPost('/api/V1/users/register', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (result.success) {
            return NextResponse.json(result.data);
        } else {
            return NextResponse.json(
                { error: result.error || 'Registration failed' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Registration proxy error:', error);

        // 使用统一的错误处理
        const errorResult = handleApiError(error);
        return NextResponse.json(
            errorResult,
            { status: 500 }
        );
    }
}