import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'id required' }, { status: 400 });
        }

        const url = `/api/admin/V1/product/${id}`;
        const result = await apiGet(url);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Get Order Detail Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}