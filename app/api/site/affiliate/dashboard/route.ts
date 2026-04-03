import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        console.log('dddd')
        // 调用 Java 端的接口：/api/V1/affiliate/dashboard
        const result = await apiGet('/api/V1/affiliate/dashboard');
        return NextResponse.json(result);
    } catch (error) {
        const { errorMessage } = handleApiError(error);
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}