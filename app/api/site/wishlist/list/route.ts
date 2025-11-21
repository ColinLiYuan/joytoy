import { NextRequest, NextResponse } from 'next/server';
import { apiGet, apiDelete, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { getServerUserId } from '@/lib/cookie-utils';

// get user wishlist
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const url = `/api/V1/wishlist/${userId}/items`;

        // console.log('route getWishlist url: ', url)
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
    request: NextRequest
) {
    try {
        const userId = await getServerUserId();
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