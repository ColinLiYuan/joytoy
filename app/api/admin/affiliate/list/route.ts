// app/api/admin/affiliate/list/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const authToken = await getToken();
        
        if (!authToken) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        // 构建查询参数
        const page = searchParams.get('page') || '0';
        const size = searchParams.get('size') || '20';
        const sortBy = searchParams.get('sortBy') || 'id';

        const queryParams = new URLSearchParams({
            page,
            size,
            sortBy
        });

        const result = await apiGet(`/api/admin/V1/affiliate/list?${queryParams.toString()}`, authToken);
        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Admin Affiliate List Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
