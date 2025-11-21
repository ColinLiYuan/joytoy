import { NextRequest, NextResponse } from 'next/server';
import { apiGet, apiDelete, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// get user wishlist
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        // console.log('get user wishlist route:')
        const params = await context.params;
        const { userId } = params;
        const url = `/api/V1/wishlist/${userId}/items`;

        const result: FrontApiResponse = await apiGet(url);

        if (!result.success) {
            return NextResponse.json(
                {error: result.error},
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Get wishlist proxy error:', error);
        const errorResult = handleApiError(error);
        return NextResponse.json(errorResult, { status: 500 });
    }
}

// clear user wishlist
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {
        const params = await context.params;
        const { userId } = params;
        const url = `/api/V1/wishlist/${userId}`;

        const result: FrontApiResponse = await apiDelete(url);

        if (!result.success) {
            return NextResponse.json(
                {error: result.error},
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Clear wishlist proxy error:', error);
        const errorResult = handleApiError(error);
        return NextResponse.json(errorResult, { status: 500 });
    }
}