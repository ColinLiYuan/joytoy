import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// /api/cart/[cartId]
// get cart
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ cartId: string }> }
) {
    try {
        const { cartId } = await params;

        // console.log('/api/cart/[cartId] ' + cartId)
        const url = `/api/V1/cart/${cartId}`;
        const result:FrontApiResponse = await apiGet(url);
        // console.log('🟢 PUT - apiPut 结果:', result);

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