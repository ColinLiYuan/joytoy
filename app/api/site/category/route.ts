import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

// app/api/category
// get categories
export async function GET(
    request: NextRequest
) {
    try {
        // console.log('category api start');

        const url = '/api/V1/category/getCategories';
        const result:BackendApiResponse = await apiGet(url);

        return NextResponse.json(result);
    } catch (error) {
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}