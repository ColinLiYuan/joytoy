import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { FrontApiResponse } from '@/types/api';

// /api/filter
// get filters
export async function GET(
    request: NextRequest
) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        if (!type) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Type parameter is required'
                },
                { status: 400 }
            );
        }

        const url = `/api/V1/filter/${type}`;
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