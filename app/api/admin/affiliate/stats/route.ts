// app/api/admin/affiliate/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiGet, handleApiError } from '@/lib/api-utils';
import { getToken } from '@/lib/token-utils';

export async function GET(request: NextRequest) {
    try {
        const authToken = await getToken();
        
        if (!authToken) {
            return NextResponse.json(
                { success: false, error: 'Authentication required' },
                { status: 401 }
            );
        }

        const result = await apiGet('/api/admin/V1/affiliate/stats', authToken);
        return NextResponse.json(result);
    } catch (error) {
        console.error('🔴 Admin Affiliate Stats Error:', error);
        const { errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
