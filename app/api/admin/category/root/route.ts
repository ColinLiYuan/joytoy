import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';

// app/api/category/root
// get roots
export async function GET() {
    try {
        const url = '/api/admin/V1/category/getRoots';
        const result = await apiGet(url);

        return NextResponse.json(result);
    } catch (error) {
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, errorMessage },
            { status: 500 }
        );
    }
}