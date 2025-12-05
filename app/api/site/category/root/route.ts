import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

// app/api/category/root
// get roots
export async function GET(
    request: NextRequest
) {
    try {
        // logger.info('category root api start');

        const url = '/api/V1/category/getRoots';
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