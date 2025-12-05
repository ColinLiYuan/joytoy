import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';
import { logger } from '@/lib/file-logger';

// app/api/category/root
// get roots
export async function GET(
    request: NextRequest
) {
    try {
        // logger.info('category root api start');

        const url = '/api/admin/V1/category/getRoots';
        const result:BackendApiResponse = await apiGet(url);

        return NextResponse.json(result);
    } catch (error) {
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}