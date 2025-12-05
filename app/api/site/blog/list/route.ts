// /app/api/blog/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { BackendApiResponse } from '@/types/api';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '12';

        let url = `/api/V1/blog/list?page=${page}&size=${size}`;
        // console.log('blog list route url: ' + url)

        const result:BackendApiResponse = await apiGet(url);
        // console.log('blog list route:', result);

        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Blog LIST Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}