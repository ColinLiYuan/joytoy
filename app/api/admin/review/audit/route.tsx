import { NextRequest, NextResponse } from 'next/server';
import { apiPost, handleApiError } from '@/lib/api-utils';

export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const url = `/api/admin/V1/review/audit`;
        const result = await apiPost(url, body);

        return NextResponse.json(result);
    } catch (error) {
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}