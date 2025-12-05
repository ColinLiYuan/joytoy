// /app/api/admin/blog/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';

        let url = `/api/admin/V1/blog/list?page=${page}&size=${size}`;
        if (status) url += `&status=${status}`;

        // console.log('query list url ' + url)
        const result:BackendApiResponse = await apiGet(url);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Blog LIST Error:', error);
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}