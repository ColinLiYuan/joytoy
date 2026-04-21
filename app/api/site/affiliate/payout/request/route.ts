// /app/api/site/affiliate/payout/request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { affiliateFetch } from '@/lib/affiliate-fetch';

export async function POST(request: NextRequest) {
    const body = await request.json();
    return affiliateFetch(request, '/api/V1/affiliate/payout/request', {
        method: 'POST',
        body
    });
}
