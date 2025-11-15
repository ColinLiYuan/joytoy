import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// add to cart
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ cartId: string }> }
) {
    try {
        const { cartId } = await params;
        const body = await request.json();

        const url = `/api/V1/cart/${cartId}/items`;
        const result:FrontApiResponse = await apiPost(url, body);

        if (!result.success) {
            return NextResponse.json(
                {error: result.error},
                { status: 400 }
            );
        }

        return NextResponse.json(result.data);
    } catch (error) {
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}