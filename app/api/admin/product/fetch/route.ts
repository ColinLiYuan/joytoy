import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {


    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'id required' }, { status: 400 });
        }

        const url = `/api/admin/V1/product/${id}`;

        const result:BackendApiResponse = await apiGet(url);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Get Order Detail Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}