import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';
import { logger } from '@/lib/file-logger';

// app/api/category/root
// get roots
export async function GET(
    request: NextRequest
) {
    try {
        // logger.info('category root api start');

        const url = '/api/admin/V1/category/getRoots';
        const result:FrontApiResponse = await apiGet(url);

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