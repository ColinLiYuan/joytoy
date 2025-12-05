import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

// blog release
export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const url = `/api/admin/V1/blog/release`;
        const result:BackendApiResponse = await apiPost(url, body);

        return NextResponse.json(result);
    } catch (error) {
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}