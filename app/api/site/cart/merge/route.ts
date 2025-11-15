import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest, handleApiError } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionCartToken = searchParams.get('sessionCartToken');
        const userId = searchParams.get('userId');

        if (!sessionCartToken || !userId) {
            return NextResponse.json(
                { success: false, error: 'sessionCartToken and userId are required' },
                { status: 400 }
            );
        }

        const queryParams = new URLSearchParams();
        queryParams.append('sessionCartToken', sessionCartToken);
        queryParams.append('userId', userId);

        const response = await proxyRequest(`/api/cart/merge?${queryParams.toString()}`, {
            method: 'POST',
        });

        if (response.status === 204 || response.status === 200) {
            return NextResponse.json({ success: true });
        }

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { success: false, error: data.message || 'Failed to merge carts' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        const { error: errorMessage } = handleApiError(error);
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}