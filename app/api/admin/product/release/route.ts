import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';

// product release
export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const url = `/api/admin/V1/product/release`;
        
        // 获取前端传来的 Authorization header
        const authHeader = request.headers.get('authorization');
        const headers: Record<string, string> = {};
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }
        
        const result = await apiPost(url, body, { headers });

        return NextResponse.json(result);
    } catch (error) {
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}