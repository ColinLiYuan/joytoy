import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// add to wishlist
export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();
        const result: FrontApiResponse = await apiPost(`/api/V1/wishlist/items`, body);

        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(
                { error: result.error || '添加到心愿单失败' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('添加到心愿单代理错误:', error);
        const errorResult = handleApiError(error);
        return NextResponse.json(errorResult, { status: 500 });
    }
}