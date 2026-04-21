// /app/api/site/affiliate/payout/my-payouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { affiliateFetch } from '@/lib/affiliate-fetch';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '20';

    const url = `/api/V1/affiliate/payout/my-payouts?page=${page}&size=${size}`;
    return affiliateFetch(request, url);
}
