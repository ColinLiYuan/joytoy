// app/api/users/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const result: BackendApiResponse<any> = await apiPost('/api/V1/users/register', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return NextResponse.json(result);
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