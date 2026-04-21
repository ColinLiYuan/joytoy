// /app/api/site/affiliate/orderList/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { affiliateFetch } from '@/lib/affiliate-fetch';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword');
    const page = searchParams.get('page') || '0';
    const size = searchParams.get('size') || '12';

    let url = `/api/V1/affiliate/orderList?page=${page}&size=${size}`;
    if (status) url += `&status=${status}`;
    if (keyword) url += `&keyword=${keyword}`;

    return affiliateFetch(request, url);
}