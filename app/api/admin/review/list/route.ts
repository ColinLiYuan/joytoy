// app/api/admin/review/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '15';

        let url = `/api/admin/V1/review/list?page=${page}&size=${size}`;

        console.log('Proxying to backend:', url);

        const result = await apiGet(url);

        return NextResponse.json(result);

    } catch (error) {
        console.error('🔴 REVIEWS LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}